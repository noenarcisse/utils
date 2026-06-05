open System.IO
open System.Text
open System
//WIP script auto generate md files

let stopWatch = System.Diagnostics.Stopwatch.StartNew()


let saveFileName = "./test.md"

let excludes = Set.ofList  [".git" ; "README.md" ; "package"]
let searchOpt = SearchOption.AllDirectories

let getFileName (path:string) = Path.GetFileNameWithoutExtension(path)
let getFileExt (path:string) = Path.GetExtension(path)
let containsExclude (fileName : string) = excludes |> Set.exists fileName.Contains
let displayFileWithExt (path:string) = $"{getFileName path}{getFileExt path}"

let listDirs path= 
    Directory.EnumerateDirectories(path , "*", searchOpt)
    |> Seq.filter (containsExclude >> not)
    |> Seq.toList

let listFilesFlat (list : string list) =
    list 
    |> List.collect ( Directory.EnumerateFiles  >> Seq.toList) //flatmap
    |> List.filter(containsExclude >> not)

//for dictionnary sorting
let getLanguageDir (path:string) =
    //Path.GetRelativePath ? pour safe
    path.[2..] // ghetto, c'est vraiment pour forcer le ./ en moins du nom comme je part en path rel
    |> Path.GetDirectoryName
    |> fun pathDir -> pathDir.Split Path.DirectorySeparatorChar
    |> Array.head


let createDict (paths: string list) =
    paths 
    |> List.toSeq
    |> Seq.groupBy getLanguageDir
    |> Seq.map(fun (dir, fileNames)-> dir, fileNames |> Seq.toList)
    |> Map.ofSeq

//TESTING
let formatFiles (f: string -> string) (list : string list) =
    list
    |> List.map(fun e -> f(e))

let formatDic (dic:Map<string, string list>) =
    let str = StringBuilder()
    for k in dic.Keys do
        str.AppendLine("## "+k) |> ignore
        str.AppendLine(String.Join("<br>", formatFiles Path.GetFileName dic[k])) |> ignore
        str.AppendLine() |> ignore
    
    str.ToString()

let saveToFile filepath (dic : Map<string,string list>) =
    let str = dic |> formatDic
    File.WriteAllText(filepath, str)
    dic     

let displayDict =
    Map.iter(fun k v -> printfn "[%s] %A" k (v |> List.map displayFileWithExt))

let tee f x = f x; x

//RESULT
printfn "FILES MAP:"

"."
|> listDirs  
|> listFilesFlat
|> createDict
|> tee displayDict
|> saveToFile saveFileName



stopWatch.Stop()
printfn "Exec time: %.2fms" stopWatch.Elapsed.TotalMilliseconds