import sets
import strutils
import std/paths
import std/dirs
import std/files

var sql_tokens = @[
    "select","from","as",
    "where",
    "order","group","by",
    "asc","desc",
    "count","sum",
    "insert","into","values",
    "delete",
    "update",
    "concat",
    "distinct",
    "like",
    "ilike",
    "cast",
    "extract",
    "to_char",
    "position",
    "substring", "upper","lower","replace", "trim","rtrim","ltrim",
    "count", "max","min","avg","case","when","else","end","nullif","coalesce"
    ].toHashSet

# open file, rw
var f, f2 : File
var fs : seq[string]

let wd = getCurrentDir()
for e in walkDir(wd) :

    if e.kind != pcFile : continue
    let (_,filename,ext) = splitFile(e.path)
    if ext != ".sql" : continue
    fs.add $filename&ext


for file in fs :

    let fp = $file #repassage en string leggit
    if open(f, fp, FileMode.fmRead) :
        # non defer, il est fermé plus loin, trust me
        if open(f2, "tmp_"&fp, FileMode.fmWrite) : echo "Nice"
            

        try :
            var currentWord : seq[char]

            while not f.endOfFile() :
                currentWord = @[]
                let l = f.readLine()

                echo l

                for c in l :
                    #  parsing here
                    # todo
                    if c in Whitespace :
                        var wordStr = currentWord.join()

                        if wordStr in sql_tokens :
                            echo "Found : ", wordStr
                            f2&=wordStr.toUpperAscii()
                        else :
                            echo wordStr
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
                echo "last not taken : ", wordStr
                f2&=wordStr.toUpperAscii()

        except :
            echo "oops"
        finally :
            f.close()
            f2.close()          
    else :
        echo "Impossible d'ouvrir le fichier"

    #move here
    moveFile(Path("tmp_"&fp), Path(fp))
#end foreach files
            
# la meilleure solution c'est
# ouvrir un autre fichier, scan par line, parse la line curr, ecrire le fichier 2 avec remplacement sur les tokens
# puis move fichier_2_tmp -> fichier1