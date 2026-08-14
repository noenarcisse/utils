import os
import std/osproc
import std/paths
import strformat
import strutils

proc printHelp()

let args: seq[string] = commandLineParams()

if args.len() < 1 : echo "Nombre d'args incorrect"; printHelp() ; quit(0) 

let file = args[0]

if not fileExists(file) : echo &"Le fichier source {file} n'existe pas" ; quit(0)

let (_, filename, ext) = splitFile(Path(file))

let cmd1 = &"cmd /c tsc {file}"
let cmd2 = &"node ./{filename}.js "&join(args[1..^1], " ")

let err = execCmd(cmd1)

if err != 0 :
    echo "TS Erreur de compilation"
    quit(err)
# et fileexists sur le js
if not fileExists(string(filename)&".js") :
    echo "Le fichier js n'existe pas"
    quit(0)

discard execCmd(cmd2)


proc printHelp() =
    echo "ts [ts file] [args?]"