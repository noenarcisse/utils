

//Generic guards

//typeguards et checks
export function isBool(arg:any): arg is boolean
{
		return typeof arg === 'boolean'
}
export function isEmptyString(arg: string): boolean {
	return arg === ''
}

//time related utility functions
export function isDate(arg: any): arg is Date {
	return arg instanceof Date
}
export function minutesToHours(minutes:number)
{
	throw new Error("Not implemented yet");
}