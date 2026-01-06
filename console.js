const whitelist ='';

const content = document.body.querySelector('.console');
//YOLO
const input = document.body.querySelector('input');
console.log(input)
//const validBtn = document.querySelector('button')[0];
//validBtn.addEventListener("click", () => {console.log("do stuff 2")});

//LISTENERS
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        submitForm(e.target)
    }
});



//verifier l'input user
//laisser les gens s'auto hack localement si ca les amuse


//refacto sortir la console.js hors du lab et import here

//genius de Gemini qui exploite l'anonyme pour recupérer le texte pur dans la fn 
//et dodge le eval qui cache la colo syntaxique
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



function submitForm(input) {
    console.log("USER INPUT : " + input.value);
    input.value = '';
}
function readCmd(userCmd)
{
    let cmd;

    if(lockXSS(userCmd) | lockFunCall(userCmd))
        throw new Error("Forbidden command found. Execution blocked.");

    cmd=userCmd;
    let regObj;
    let regFn;
    //si read obj
    if(regObj.test(cmd))
    {
        execObj(cmd);
    }
    //si read fn
    if(regFn)
    {
        execFn(cmd)
    }
}

function execObj(cmd)
{
    try
    {

    }
    catch(e)
    {

    }
}

function execFn(cmd)
{

}

//empecher les XSS
function lockXSS(cmd)
{
    let reg = /fetch|XMLHttpRequest/;
    return reg.test(cmd);
}
//interdire les mot clé function et => pour emplecher les callbacks
function lockFnCall(cmd)
{
    let reg = /function|=>/;
    return reg.test(cmd);
}



