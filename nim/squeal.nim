import sets
import strutils
import strformat
import std/paths
import std/dirs
import std/files

# bug, les tokens sont pas reconnu apres des \t ?
# sur du sql indenté ca passe vraiment meme pas sur select


var sql_tokens = @[
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
    "union", "intersct", "except", "on", "in",
    "with",
    "default", "is", "null", "nulls", "last"
    ].toHashSet

var f, f2 : File
var fs : seq[string]

let wd = getCurrentDir()
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
                    if c in Whitespace and currentWord.len() > 0 :
                        var wordStr = currentWord.join()

                        

                        if wordStr in sql_tokens :
                            f2&=wordStr.toUpperAscii()
                        else :
                            f2&=wordStr
                        f2&=c 
                        # on vide quand finito
                        currentWord = @[]
                    elif c in Whitespace :
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

    moveFile(Path("tmp_"&file), Path(file))
#end foreach files