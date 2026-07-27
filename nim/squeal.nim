import sets
import strutils
import std/paths
import std/dirs
import std/files

var sql_tokens = @[
    "select","from","as","where",
    "order","group","by",
    "asc","desc",
    "count","sum",
    "insert","into","values",
    "delete","update",
    "concat","distinct",
    "like","ilike",
    "cast","extract","to_char",
    "position","substring", "upper","lower","replace", "trim","rtrim","ltrim",
    "count", "max","min","avg","case","when","else","end","nullif","coalesce"
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
        if open(f2, "tmp_"&file, FileMode.fmWrite) : echo "Nice"           

        try :
            var currentWord : seq[char]

            while not f.endOfFile() :
                currentWord = @[]
                let l = f.readLine()

                for c in l :
                    #  parsing here
                    if c in Whitespace :
                        var wordStr = currentWord.join()

                        if wordStr in sql_tokens :
                            f2&=wordStr.toUpperAscii()
                        else :
                            f2.write wordStr
                        f2&=c 
                        # on vide quand finito
                        currentWord = @[]
                    else :
                        currentWord.add c
                f2&='\l' 
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