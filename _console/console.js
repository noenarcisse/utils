
//refacto hard
//whitelist ?
//blacklist correctement pour pouvoir lever ou ajouter des elements
const whitelist ={};
const blacklist={};
import { History } from '../js/history.js';

const histo = new History('input', 10);

histo.Init();


//limit the size of this at some point
//let histo = [] //string[]
// let iHisto=0;

//     console.log(histo);

// function logHisto(str)
// {
//     histo.unshift(str);
// }

// function browseHisto(n)
// {
//     if(n > 0 && iHisto+n < histo.length)
//     {
//         iHisto += n;
//         input.value = histo[iHisto];
//     }
//     if(n < 0 && (iHisto+n) >= 0)
//     {
//         iHisto += n;
//         input.value = histo[iHisto];
//     }
// }


const content = document.body.querySelector('.console');
//YOLO
const input = document.body.querySelector('input');
console.log(input)
//const validBtn = document.querySelector('button')[0];
//validBtn.addEventListener("click", () => {console.log("do stuff 2")});


input.addEventListener("keyup", (e) => {

    //console.log(e.key);
    if (e.key === "Enter") {
        submitForm(e.target);
    }
});

//LISTENERS
// input.addEventListener("keyup", (e) => {

//     //console.log(e.key);
//     if (e.key === "Enter") {
//         logHisto(e.target.value);
//         submitForm(e.target);
//     }
//     else if(e.key === "ArrowUp")
//     {
//         browseHisto(1)
//     }
//     else if(e.key === "ArrowDown")
//     {
//         browseHisto(-1)
//     }
//     else
//     {
//         iHisto=-1;
//     }
// });

// init par register()
let localScope = {};



export function register(classes) {
    localScope = { ...localScope, ...classes };
}

export function say(fn) 
{
    let expression = fn.toString()
        .replace(/^\s*\(\)\s*=>\s*/, '') // Enlève () => {   }
        .replace(/^{|}$/g, '')           
        .trim();

    let divCmd = document.createElement("div");
    divCmd.className = "line-cmd";
    divCmd.innerHTML = `<span class="beginOfLine"> > </span><span class="cmd">${expression}</span>`;
    content.appendChild(divCmd);

    let resultat;
    let isError = false;
    try 
    {
        resultat = fn();
    } 
    catch (e) 
    {
        resultat = e.message;
        isError = true;
    }

    let divRes = document.createElement("div");
    let spanRes = document.createElement("span");
    
    if (isError) {
        spanRes.className = "result error";
        spanRes.textContent = "Error: " + resultat;
    } else {
        spanRes.className = "result";
        spanRes.textContent = (typeof resultat === 'object') ? JSON.stringify(resultat) : resultat;
    }

    divRes.innerHTML = `<span class="beginOfLine"> > </span>`; // Indentation pour le résultat
    divRes.appendChild(spanRes);
    content.appendChild(divRes);

    content.scrollTop = content.scrollHeight;
}

//draft, cut clone and c/c by splitting subroutines
function sayUser(cmd)
{
    //cmd is a string entered by user already treated

    let divCmd = document.createElement("div");
    divCmd.className = "line-cmd";
    divCmd.innerHTML = `<span class="beginOfLine"> > </span><span class="cmd">${cmd}</span>`;
    content.appendChild(divCmd);

    let resultat;
    let isError = false;
    try 
    {
        const keys = Object.keys(localScope);
        const values = Object.values(localScope);
        
        let runner = new Function(...keys, `return ${cmd}`);
        resultat = runner(...values);
    } 
    catch (e) 
    {
        resultat = e.message;
        isError = true;
    }

    let divRes = document.createElement("div");
    let spanRes = document.createElement("span");
    
    if (isError) {
        spanRes.className = "result error";
        spanRes.textContent = "Error: " + resultat;
    } else {
        spanRes.className = "result";
        spanRes.textContent = `${resultat}`;
    }

    divRes.innerHTML = `<span class="beginOfLine"> > </span>`; // Indentation pour le résultat
    divRes.appendChild(spanRes);
    content.appendChild(divRes);

    content.scrollTop = content.scrollHeight;
}

function submitForm(input) {
    console.log("USER INPUT : " + input.value);
    readCmd(input.value);
    input.value = '';
}
function readCmd(cmd)
{
    if(lockXSS(cmd) || lockFnCall(cmd))
        error(cmd);

    sayUser(cmd);
}

//empecher les XSS
function lockXSS(cmd)
{
    let reg = /fetch|XMLHttpRequest/i;
    return reg.test(cmd);
}
//interdire les mot clé function et => pour emplecher les callbacks
function lockFnCall(cmd)
{
    let reg = /function|=>/i;
    return reg.test(cmd);
}

function error(cmd) {

    let divCmd = document.createElement("div");
    divCmd.className = "line-cmd";
    divCmd.innerHTML = `<span class="beginOfLine"> > </span><span class="cmd">${cmd}</span>`;
    content.appendChild(divCmd);

    let divRes = document.createElement("div");
    let spanRes = document.createElement("span");
    divRes.innerHTML = `<span class="beginOfLine"> > </span>`;
    spanRes.textContent = "Forbidden command found. Execution rejected."
    spanRes.className = 'error';
    divRes.appendChild(spanRes);
    content.appendChild(divRes);

    input.value = '';
    content.scrollTop = content.scrollHeight;

    throw new Error("Forbidden command found. Execution rejected.");

} 


