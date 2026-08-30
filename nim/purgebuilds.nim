import os
import osproc
import strutils
import strformat
import terminal
import sets

# removes any build
# or packages folders ?
# targets : bin, obj, node_modules

# add cmd with builds and/or packages folders
# identify the project folde rtype and associated packages / build folder names ?

proc pureWindowsTrash(path: string)
proc walkThisWay(basedir : string, targets : HashSet[string]) : seq[string]

try :
    let targets = @["bin", "obj", "node_modules"].toHashSet
    let filesToDelete = walkThisWay(".", targets)

    echo "Dir to delete found:"
    for e in filesToDelete :
        echo e

    echo "Delete those files?"
    let userresp = readChar(stdin)
    
    if userresp == 'y' :
        for e in filesToDelete :
            pureWindowsTrash e

        echo &"{len filesToDelete} fichier(s) supprimé(s)"
    
    echo "Press any key to quit"
    discard getch()

except OSError, ValueError,  IOError, EOFError :
    echo getCurrentExceptionMsg()


proc walkThisWay(basedir : string, targets : HashSet[string]) : seq[string] =
        
    for e in walkDir basedir :
        if e.kind != pcDir : continue

        let (_ ,filename, _) = e.path.splitFile()
        if filename.toLowerAscii() in targets :
            result.add(e.path)
        else : 
            let res = walkThisWay(e.path, targets)
            result.add(res)

proc pureWindowsTrash(path: string) =
    let absPath = path.absolutePath()
    var code = execCmd("powershell -Command \"Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory('" & absPath & "', 'OnlyErrorDialogs', 'SendToRecycleBin')\"")  
    if code != 0 :
        raise newException(OSError, "Erreur de PS : code err = " & $code)