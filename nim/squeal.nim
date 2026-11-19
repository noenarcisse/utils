import sets
import strutils
import strformat
import std/paths
import std/dirs
import std/files

# manque begin, commit et rollback

# y'a un bug si y'a une sous req avec une parenthese ouvrante where (select * from etc)
# la parenthese empeche la capture du SELECT

var sql_tokens = @[
    "create", "alter", "drop", "if", "exists", "table", 
    "select","from","as","where", "having",
    "order","group","by",
    "asc","desc",
    "case", "and", "or",
    "count","sum",
    "insert","into","values",
    "delete","update",
    "concat","distinct",
    "like","ilike",
    "cast","extract","to_char",
    "position","substring", "upper","lower","replace", "trim","rtrim","ltrim",
    "count", "max","min","avg","case","when","else","end","nullif","coalesce",
    "left", "right", "outer","inner", "join","full",
    "union", "intersect", "except", "on", "in",
    "with",
    "default", "is", "not", "null", "nulls", "last",
    "decimal", "varchar", "char", "int", "boolean", "timestamptz", "uuid", "unique",
    "constraint", "foreign", "key", "references", "cascade",
    "begin", "rollback", "commit",
    "declare", "procedure", "function", "returns"
    ].toHashSet

var f, f2 : File
var fs : seq[string]

let IgnoredChars = Whitespace + {'(', ')', ';'}

let wd = getCurrentDir() # OSError non gérée
for e in walkDir(wd) :
    if e.kind != pcFile : continue
    let (_,filename,ext) = splitFile(e.path)
    if ext != ".sql" : continue
    fs.add $filename&ext

for file in fs :
    if open(f, file, FileMode.fmRead) :
        # non defer, il est fermé plus loin, trust me
        if open(f2, "tmp_"&file, FileMode.fmWrite) : echo &"Fixing {file}"           

        try :
            var currentWord : seq[char]

            while not f.endOfFile() :
                # readline ca ENLEVE le dernier /l
                #je dois le rajouter a la main en fin de loop
                let l = f.readLine()

                for c in l :
                    #  parsing here
                    if c in IgnoredChars and currentWord.len() > 0 :
                        var wordStr = currentWord.join()

                        

                        if wordStr in sql_tokens :
                            f2&=wordStr.toUpperAscii()
                        else :
                            f2&=wordStr
                        f2&=c 
                        # on vide quand finito
                        currentWord = @[]
                    elif c in IgnoredChars :
                        f2&=c
                    else :
                        currentWord.add c
                    
                #on vide le dernier mot, il est avant le \l
                # qui est enlevé par le splitLine ici :d
                if currentWord.len() > 0 :
                    var wordStr = currentWord.join()
                    if wordStr in sql_tokens :
                        f2&=wordStr.toUpperAscii()
                    else :
                        f2&=wordStr
                        
                f2&='\l'
                currentWord = @[]
                 
            # dernier mot on touche possiblement EOF, faut verifier si il est dedans
            if currentWord.join() in sql_tokens :
                var wordStr = currentWord.join()
                f2&=wordStr.toUpperAscii()
        except :
            echo "oops"
        finally :
            #safe?
            f.close()
            f2.close()          
    else :
        echo "Impossible d'ouvrir le fichier"

    moveFile(Path("tmp_"&file), Path(file)) # exeption non gérée?
#end foreach files