open Microsoft.VisualBasic.FileIO
open System.IO

// Removes .meta from extracted unity folders
[<EntryPoint>]
let main (argv : string[]) = 

    let path = 
        match argv.Length with
        | 1 -> argv[0]
        | _ -> failwith "Error in the number of args, expected only one : folder path"

    if Directory.Exists path |> not then failwith "The directory specified doesn't exist"

    let pattern = "*.meta"
    let options: SearchOption = SearchOption.AllDirectories

    let getFiles (pattern:string) (options : SearchOption) (path : string) = 
        Directory.EnumerateFiles (path, pattern, options)
        |> Seq.toList

    let displayFiles list =
        list |> List.iter (fun f -> printfn "Deleting: %s" f)
    
    let tee f x = f x; x

    path
    |> getFiles  pattern options
    |> tee displayFiles
    |> List.iter(fun f -> FileSystem.DeleteFile(f, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin))

    printfn "Finito pépito"
    0