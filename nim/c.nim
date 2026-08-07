import os
import std/osproc
import std/paths
import strformat
import strutils

proc printHelp()

let args: seq[string] = commandLineParams()

if args.len() < 2 : echo "Nombre d'args incorrect"; printHelp() ; quit(0) 

let compiler = 
    case args[0]
        of "g" : "gcc"
        of "t" : "tcc"
        else : "" 
if compiler == "" : echo "Argument de compiler non valide"; printHelp(); quit(0)

if not fileExists(args[1]) : echo &"Le fichier source {args[1]} n'existe pas" ; quit(0)

let (_, filename, ext) = splitFile(Path(args[1]))

let cmd1 = &"{compiler} {args[1]}"
let cmd2 = &"./{filename}.exe "&join(args[2..^1], " ")

discard execCmd(cmd1)
discard execCmd(cmd2)


proc printHelp() =
    echo "c [compilter: t|g] [c file] [args?]"