
import * as Console from './console.js';

import {Color} from './js/Color.js'
import * as Perl from './js/perl.utils.js';

Console.register({Color, Perl});

//TEMP whitelist system
// const registry = { Perl, Color }; // Vous listez juste les imports une fois

// const whitelist = {};

// Object.entries(registry).forEach(([name, content]) => {
//     // Si c'est une classe (possède un prototype)
//     if (typeof content === 'function' && content.prototype) {
//         whitelist[name] = Object.getOwnPropertyNames(content.prototype)
//                                 .filter(m => m !== 'constructor');
//     } 
//     // Si c'est un module/objet
//     else {
//         whitelist[name] = Object.keys(content).filter(k => typeof content[k] === 'function');
//     }
// });

// Console.register(whitelist);


let str = "Zz"
	

for(let i=0; i<3; i++)
{
	Console.say(() => str = Perl.strInc(str))
}

for(let i=0; i<10; i++)
{
	Console.say(() => str = Perl.StrDec(str))
}
Console.say(() => Perl.StrDec('a'));
Console.say(() => Perl.StrDec('b'));

	let c = new Color(255, 0, 0, .5);
	Console.say(() => c.toString());	
	Console.say(() => c.swizzle('gbr').toString());
	Console.say(() => c.swizzle('gbr').swizzle('argb').toString());
	
	c = new Color(1,1,1,.2);
    Console.say(() => c.toString());

	c = new Color("rgb(255,100,255)");
    Console.say(() => c.toString());
    c = new Color("rgb(55 100 255)");
    Console.say(() => c.toString());

    c = new Color(new Array(5,2,1));
    Console.say(() => c.toString());

    c = new Color(new Array(255, 255, 255, .5));
    Console.say(() => c.toString());
    c = new Color("#ff00FF");
    Console.say(() => c.toString());

//not working
    // let c6 = new Color("#F00");
    // Console.say(c6);


	

// var g = new Gradient('90deg,rgba(87, 199, 133, 1) 14%, rgba(226, 182, 27, 1) 24%, rgba(226, 182, 27, 1) 47%, rgba(42, 123, 155, 1) 57%, rgba(42, 123, 155, 1) 80%, rgba(87, 199, 133, 1) 90%, rgba(87, 199, 133, 1) 100%')

// g.toString();