import os
import osproc
import strutils
import strformat
import terminal

proc pureWindowsTrash(path: string)
proc customDirsExists(dirs : seq[string]) : seq[string]

try :
    let dpaths = @["basics", "exos", "others"]

    let notfound = customDirsExists dpaths
    if notfound.len() > 0 :
        echo "Directories not found : ", join(notfound, ",")
        echo "Program exited"
        quit(0)

    var filesDeleted : seq[string] = @[]

    for dirpath in dpaths :
        for e in walkDir dirpath :

            if e.kind == PathComponent.pcFile :
                var (_,_,ext) = e.path.splitFile()
                if ".exe" == ext.toLowerAscii() :
                    filesDeleted.add(e.path)
        
    echo "Exe files found:"
    for e in filesDeleted :
        echo e

    echo "Delete those files?"
    let userresp = readChar(stdin)
    
    if userresp == 'y' :
        for e in filesDeleted :
            pureWindowsTrash e

        echo &"{len filesDeleted} fichier(s) supprimé(s)"
    
    echo "Press any key to quit"
    discard getch()

except OSError, ValueError,  IOError, EOFError :
    echo getCurrentExceptionMsg()

proc customDirsExists(dirs : seq[string]) : seq[string] =
    var notfound : seq[string] = @[]
    for d in dirs :
        if not dirExists d :
            notfound.add(d)
    return notfound

proc pureWindowsTrash(path: string) =
    let absPath = path.absolutePath()
    var code = execCmd("powershell -Command \"Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('" & absPath & "', 'OnlyErrorDialogs', 'SendToRecycleBin')\"")  
    if code != 0 :
        raise newException(OSError, "Erreur de PS : code err = " & $code)