//TBD saturate (keep higher color and diminish 1 or 2 others channels)

//tdb color hexa avec alpha #FFFFFFF00
//tdb color as objet litt {r,g,b,a}

/**
 * Color object with possible manipulation of a color
 * @class
 */
export class Color
{
	/**
	 * Constructor
	 * @param {number|string|Array<number>} arg1 - The source of the color.
	 * Can be:
	 * - The red channel
	 * - A string representing the CSS string rgb(), rgba(), #FF00FF
	 * - An array of numbers with or without alpha such as [255,0,255,0.5]
	 * @param {number} [arg2] - The green channel of the color
	 * @param {number} [arg3] - The blue channel of the color
	 * @param {number} [arg4=1] - The alpha channel of the color
	 */
	constructor(arg1, arg2, arg3, arg4=1)
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
					col = arg1.match(/\d+\.?\d*/g); // 4 deci avec . possible
					
					r = parseInt(col[0]);
					g = parseInt(col[1]);
					b = parseInt(col[2]);
					
					// On vérifie si l'alpha extrait (col[3]) est valide
					if (col[3].match(/^[01](\.[0-9]+)?$/)) {
						a = parseFloat(col[3]);
					} else {
						throw new Error("Alpha value must be a float between 0 and 1");
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

	/**
	 * 
	 * @param {Object} pattern 
	 * @returns 
	 */
	swizzle(pattern) 
	{
		const old = {
			r: this.r,
			g: this.g,
			b: this.b,
			a: this.a * 255 //normalisation temp de channel A
		};

		const channels = pattern.toLowerCase().split("");

		// 2. Swizzling : les valeurs s'échangent sans perte d'échelle
		if (channels.length > 0) this.r = old[channels[0]] ?? old.r;
		if (channels.length > 1) this.g = old[channels[1]] ?? old.g;
		if (channels.length > 2) this.b = old[channels[2]] ?? old.b;

		let newAlphaIn255;
		if (channels.length > 3) 
		{
			newAlphaIn255 = old[channels[3]] ?? (this.a * 255);
		} 
		else 
		{
			newAlphaIn255 = old.a;
		}

		// retour a un alpha float entre 0 - 1
		this.a = newAlphaIn255 / 255;

		this.r = Math.round(this.r);
		this.g = Math.round(this.g);
		this.b = Math.round(this.b);

		return this;
	}
	lighten(add)
	{
		add=Math.abs(add);
		this.r = this.clampColor(this.r+add);
		this.g = this.clampColor(this.g+add);
		this.b = this.clampColor(this.b+add);
	}
	darken(sub)
	{
		sub=Math.abs(sub);
		this.r = this.clampColor(this.r-sub);
		this.g = this.clampColor(this.g-sub);
		this.b = this.clampColor(this.b-sub);
	}

	clampColor(c)
	{
		if(c > 255) c=255;
		if(c < 0) c=0;
		return c
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

export default Color;