//faut terminer les lancement d'erreur en cas de value off en arg1


// Idée : Ajouter une méthode lighten(amount) ou saturate(amount).

/**
 * 
 */
class Color
{
	/**
	 * 
	 * @param {*} arg1 
	 * @param {*} arg2?
	 * @param {*} arg3?
	 * @param {*} arg4? 
	 */
	constructor(arg1, arg2, arg3, arg4)
	{
		let r,g,b;
		let a = null;
		
		//QUADRUPLE
		if(typeof arg4 !== 'undefined')
			a=arg4;
		
		// TRIPLE
		if (typeof arg3 !== 'undefined') {
			// R G B		
			r = arg1;
			g = arg2;
			b = arg3;
		}
		
		//MONO
		if(typeof arg2 === 'undefined')
		{
			if(typeof arg1 === 'string')
			{
				let col = null;

				//string rgba (255, 255, 255)
				//attention le [\s,]+ accepte possiblement : "255 , , 255"
				let regRGBA = /^rgba\(\s*[0-9]{1,3}[\s,]+[0-9]{1,3}[\s,]+[0-9]{1,3}[\s,]+[0-9.]+\s*\)$/i;
				let reg =  /^rgb\(\s*[0-9]{0,3}[\s,]+[0-9]{0,3}[\s,]+[0-9]{1,3}\s*\)$/i;

				if (regRGBA.test(arg1)) {
					col = arg1.match(/\d+\.?\d*/g); // On extrait les 4 nombres
					
					r = parseInt(col[0]);
					g = parseInt(col[1]);
					b = parseInt(col[2]);
					
					// On vérifie si l'alpha extrait (col[3]) est valide
					if (col[3].match(/^[01](\.[0-9]+)?$/)) {
						a = parseFloat(col[3]);
					} else {
						throw new Error("Alpha value must be between 0 and 1 (e.g., 0.5)");
					}
				}
				else if(reg.test(arg1)) //string rgb (255, 255, 255)
				{
					col = arg1.match(/[0-9]{1,3}/g);
					
					r=col[0];
					g=col[1];
					b=col[2];
				}
				//string #ffffff
				reg = /^[#][0-9a-fA-F]{6}/g;
				if(reg.test(arg1))
				{
					col = arg1.match(/[0-9a-fA-F]{2}/g);
					r = parseInt(col[0],16);
					g = parseInt(col[1],16);
					b = parseInt(col[2],16);
				}

				if(!col)
					throw new Error("The color format cannot be parsed. Color as a string must be either rgb(), rgba() or an HEXA value");

			}
			
			if(Array.isArray(arg1)) 			//array
			{
				//array a 3 +
				if(arg1.length >= 3)
				{
					r = arg1[0];
					g = arg1[1];
					b = arg1[2];
					
					//array a 4
					a = (arg1.length == 4) ? arg1[3] : null;
				}

			}
		}
		

		if (!(isColorValue(r) && isColorValue(g) && isColorValue(b))) 
			throw new Error("RGB (" + r + " " + g + " " + b + ") values are not [0-255]");
		

		if(a == null)
			a=1;
		
		if(!isAlphaValue(a))
			throw new Error("Alpha value is not [0-1]");

		this.a = a;
		this.r = r;
		this.g = g;
		this.b = b;
		
		
		function isColorValue(n)
		{
			return ((n >= 0) && (n < 256));
		}
		function isAlphaValue(a)
		{
			return ((a >= 0) && (a <= 1));
		}
	}
	
	toString()
	{
		return 'R:'+this.r+' G:'+this.g+' B:'+this.b+' A:'+this.a;
	}
	
	toRgb()
	{
		return `rgb(${this.r},${this.g},${this.b})`;
	}
	
	toHex()
	{
		const _r = Math.round(this.r).toString(16).padStart(2, '0');
		const _g = Math.round(this.g).toString(16).padStart(2, '0');
		const _b = Math.round(this.b).toString(16).padStart(2, '0');

		return `#${_r}${_g}${_b}`.toUpperCase();
	}

}

// clamp rgb values
// C'est une source d'erreur classique : un calcul donne 256 ou -1. Pour éviter que le CSS ne rejette la couleur, tu peux "clamer" les valeurs.
//     La logique : R=max(0,min(255,R))

export default Color;