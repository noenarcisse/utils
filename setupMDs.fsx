open System.IO
open System.Collections.Generic
//WIP script auto generate md files


type FilePath = string
//mut dic
let dico =  Dictionary<string, FilePath>()



let excludes = Set.ofList  [".git"]
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
    |> List.collect (fun e -> Directory.EnumerateFiles(e) |> Seq.toList) //flatmap

//for dictionnary sorting
let getLanguageDir (path:string) =
    path.[2..]
    |> Path.GetDirectoryName
    |> fun pathDir -> pathDir.Split(Path.DirectorySeparatorChar)
    |> Array.head

let bagInDict (dir:string)(fp : FilePath) =
    //TODO
    dico[dir] <- fp
    ()

printfn "DIRS:"
"."
|> listDirs 
|> displayList


printfn "FILES:"
"."
|> listDirs  
|> listFilesFlat
//|> List.iter(fun f -> getLanguageDir f |> printfn "%s")