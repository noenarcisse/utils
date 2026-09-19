//timeHelpers.ts
import { ref } from 'vue'

export const currentTime = ref<Date>(new Date(Date.now()))
export const refreshTimer =  60;



/**
 * Laisse un pseudo delai de base pour les temps de chargements afin d'éviter l'apparition brusque d'éléments
 * @param timer Temps en secondes (float)
 * @returns Promise<true> at the end of the timer
 */
export async function fakeTimeout(timer:number): Promise<boolean>
{
	return new Promise((resolve) => {
		setTimeout(()=>{
			resolve(true);
		},timer*1000)
	});
}

/**
 *  Remet a jour la variable de temps 
 */
export function updateTime() {
	currentTime.value = new Date(Date.now())
}


export function displayCurrentTime() : string
{
	return displayDate(currentTime.value)
}

export function displayDate(d:Date):string
{
	return 		d.getDate().toString().padStart(2, '0')+'/'+
				(d.getMonth()+1).toString().padStart(2, '0')+'/'+
				d.getFullYear().toString().padStart(2, '0')+' '+
				d.getHours().toString().padStart(2, '0')+':'+
				d.getMinutes().toString().padStart(2, '0')
}