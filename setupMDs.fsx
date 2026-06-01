open System.IO
open System.Collections.Generic
//WIP script auto generate md files


type FilePath = string
//mut dic
let dico =  Dictionary<string, List<FilePath>>()



let excludes = Set.ofList  [".git" ; "README.md" ; "package"]
let searchOpt = SearchOption.AllDirectories

let getFileName (path:string) = 
    Path.GetFileNameWithoutExtension(path)

let getFileExt (path:string) = 
    Path.GetExtension(path)

let containsExclude (fileName : string) =
    excludes |> Set.exists(fun e -> fileName.Contains(e)) 

let listDirs path= 
    Directory.EnumerateDirectories(path , "*", searchOpt)
    |> Seq.filter(fun f -> f |> containsExclude |> not)
    |> Seq.toList


let displayList list =
    list
    |> List.iter(fun e -> printfn "%s" e)


let listFilesFlat (list : string list) =
    list 
    |> List.collect (fun e -> Directory.EnumerateFiles e |> Seq.toList) //flatmap
    |> List.filter(fun f -> containsExclude f|> not)

//for dictionnary sorting
let getLanguageDir (path:string) =
    path.[2..]
    |> Path.GetDirectoryName
    |> fun pathDir -> pathDir.Split Path.DirectorySeparatorChar
    |> Array.head

let bagInDict (path:string) =
    let dir = path |> getLanguageDir

    if not(dico.ContainsKey dir) then
        dico[dir] <- List<FilePath>()

    let fp = path |> getFileName
    dico[dir].Add(fp)
    ()

let makeDictImut (dico : Dictionary<string, List<FilePath>>) =
    dico
    |> Seq.map(fun kv -> kv.Key, kv.Value|>List.ofSeq) //aled
    |> Map.ofSeq //boom imut allez ciao!

let displayFolderAndFile (path:string) =
   $"[{getLanguageDir path}] {getFileName path}"

// printfn "DIRS:"
// "."
// |> listDirs 
// |> displayList


// printfn "FILES:"
"."
|> listDirs  
|> listFilesFlat
|> List.iter(fun f -> bagInDict f)
//|> List.iter(fun f-> printfn "%s" (displayFolderAndFile f))
//|> List.iter(fun f -> getLanguageDir f |> printfn "%s")

printfn "DICT:"
dico
|> makeDictImut
|> Map.iter(fun k v -> printfn "[%s] %A" k v)
