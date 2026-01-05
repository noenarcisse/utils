import {Color} from './js/Color.js'
import * as Perl from './js/perl.utils.js';

const content = document.body.querySelector('.console');

function say(cmd)
{
	let bOL = document.createElement("span");
	bOL.textContent = ">"
	bOL.className="beginOfLine";

	let divCmd = document.createElement("div");
	let span2Cmd = document.createElement("span");
	span2Cmd.textContent = "say("+cmd+")";	
	

	divCmd.appendChild(bOL);
	divCmd.appendChild(span2Cmd);

	span2Cmd.className="cmd";
	content.appendChild(divCmd);

	let div = document.createElement("div");
	let span2 = document.createElement("span");

	div.appendChild(bOL.cloneNode(true));
	span2.textContent = eval(cmd);
	span2.className = "result";	
	div.appendChild(span2);
	content.appendChild(div);
}

let str = "Zz"
	
// say(str = str.inc())
// say(str = str.inc())
// say(str = str.inc())
// say(str = str.inc())

for(let i=0; i<3; i++)
{
	say("str = Perl.strInc(str)")
}

for(let i=0; i<10; i++)
{
	say("str = Perl.StrDec(str)")
}
say("Perl.StrDec('a')");
say("Perl.StrDec('b')");





	let c = new Color(255, 0, 0, .5);
	say("c.toString()");	
	say("c.swizzle('gbr').toString()");
	say("c.swizzle('gbr').swizzle('argb').toString()");
	
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
	

	say("c1.toString()");
	say("c2.toString()");
	say("c21.toString()");
	say("c22.toString()");
	say("c3.toString()");
	say("c4.toString()");
	say("c2.toHex()");
	
	say("c4.toString()");
	
	say("c5.toString()");

	

// var g = new Gradient('90deg,rgba(87, 199, 133, 1) 14%, rgba(226, 182, 27, 1) 24%, rgba(226, 182, 27, 1) 47%, rgba(42, 123, 155, 1) 57%, rgba(42, 123, 155, 1) 80%, rgba(87, 199, 133, 1) 90%, rgba(87, 199, 133, 1) 100%')

// g.toString();