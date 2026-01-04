/**
 * PerlString Utils
 * Fournit une incrémentation et décrémentation de chaînes compatible avec Perl.
 */
 
 

/**
 * Incrémente une chaine de caractères alphabétique sur le modèle de Perl
 * @param {string} str 
 * @returns 
 */
export function PerlIncrement(str)
{
	//regex du str pour verifier /^[a-z]+$/i
	reg = /^[a-z]+$/i;
	if(!reg.test(str))
		throw new Error("PerlIncrement: argument must be a string of alphabetical characters only");

	const chars = [...str]; //spread into chars[]

	let i=chars.length-1;
	while(i >= 0)
	{
		const charCode = chars[i].charCodeAt(0);
		
		if (isLetter(charCode)) 
		{
			chars[i] = String.fromCharCode(shiftRight(charCode));
			// Si ce n'était PAS un z/Z (pas de débordement), on s'arrête
			if (charCode !== 90 && charCode !== 122) {
				break;
			}

			// si on a tourné jusqu'au debut on est en debordement et on doit ajouter un nouveau rang
			if (i === 0) {
				chars.unshift(chars[0]); // push en amont du tab et decal
			}
		}
		i--;
	}
	
	return chars.join('');
	
}

/**
 * Décrémente une chaine de caractères alphabétique. Retourne une chaine vide si la chaine de départ était "a".
 * @param {string} str 
 * @returns 
 */
export function PerlDecrement(str) 
{
	reg = /^[a-z]+$/i;
	if(!reg.test(str))
		throw new Error("PerlIncrement: argument must be a string of alphabetical characters only");


    const chars = [...str];
    let i = chars.length - 1;

    while (i >= 0) {
        const charCode = chars[i].charCodeAt(0);

        // Si on sort de l'alphabet par le bas (c'est un A ou un a)
        if (isLetter(charCode)) 
		{
            chars[i] = String.fromCharCode(shiftLeft(charCode));

			if (charCode !== 65 && charCode !== 97) 
			{
				break;
			}
            // SI on est au premier caractère ET qu'on vient de le faire boucler
            if (i === 0) 
			{
                chars.shift(); // On supprime le caractère de tête (ex: "aa" -> "z")
            }
        }
        i--;
    }
    return chars.join('');
}

//		PRIVATE

function isLetter(c)
{
	return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
}

function shiftRight(i)
{
	if(i === 90 || i === 122)
		return i-25;
	return ++i;
}

function shiftLeft(i)
{
	if(i === 65 || i === 97)
		return i+25;
	return --i;
}