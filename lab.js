import {Color} from './js/Color.js'
import * as Perl from './js/perl.utils.js';

const content = document.body.querySelector('.console');

//genius de Gemini qui exploite l'anonyme pour recupérer le texte pur dans la fn 
//et dodge le eval qui cache la colo syntaxique
function say(fn) {
    
    // 1. Extraction propre de l'expression (le code source de la fonction)
    // On retire "() => ", les accolades éventuelles et les retours à la ligne
    let expression = fn.toString()
        .replace(/^\s*\(\)\s*=>\s*/, '') // Enlève () => {   }
        .replace(/^{|}$/g, '')           
        .trim();

    // 2. Création de la ligne de commande (Affichage du code)
    let divCmd = document.createElement("div");
    divCmd.className = "line-cmd";
    divCmd.innerHTML = `<span class="beginOfLine"> > </span><span class="cmd">${expression}</span>`;
    content.appendChild(divCmd);

    // 3. Exécution et récupération du résultat
    let resultat;
    let isError = false;

    try {
        resultat = fn();
    } catch (e) {
        resultat = e.message;
        isError = true;
    }

    // 4. Création de la ligne de résultat
    let divRes = document.createElement("div");
    let spanRes = document.createElement("span");
    
    // Formatage du résultat (gestion des objets et des erreurs)
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
    
    // Optionnel : Scroll automatique vers le bas
    content.scrollTop = content.scrollHeight;
}


let str = "Zz"
	

for(let i=0; i<3; i++)
{
	say(() => str = Perl.strInc(str))
}

for(let i=0; i<10; i++)
{
	say(() => str = Perl.StrDec(str))
}
say(() => Perl.StrDec('a'));
say(() => Perl.StrDec('b'));





	let c = new Color(255, 0, 0, .5);
	say(() => c.toString());	
	say(() => c.swizzle('gbr').toString());
	say(() => c.swizzle('gbr').swizzle('argb').toString());
	
	let c1 = new Color(1,1,1,.2);
	
	let c2 = new Color("rgb(255,100,255)");
	
	let c21 = new Color("rgb(55 100 255)");
	
	let c22 = new Color("rgb(5 1 25)");
	
	let c3 = new Color(new Array(5,2,1));
	
	let c4 = new Color(new Array(255, 255, 255, .5));
	
	let c5 = new Color("#ff00FF");

//not working
	// let c6 = new Color("#F00");
	// say(c6);
	

	say(() => c1.toString());
	say(() => c2.toString());
	say(() => c21.toString());
	say(() => c22.toString());
	say(() => c3.toString());
	say(() => c4.toString());
	say(() => c2.toHex());
	
	say(() => c4.toString());
	
	say(() => c5.toString());

	

// var g = new Gradient('90deg,rgba(87, 199, 133, 1) 14%, rgba(226, 182, 27, 1) 24%, rgba(226, 182, 27, 1) 47%, rgba(42, 123, 155, 1) 57%, rgba(42, 123, 155, 1) 80%, rgba(87, 199, 133, 1) 90%, rgba(87, 199, 133, 1) 100%')

// g.toString();