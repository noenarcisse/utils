//STRUCT
/**
 * Canvas data, as a mutable struct.
 * @param {string} selector - The selector to target the HTML element
 * @param {number} [width] - The width of the canvas
 * @param {number} [height] - The height of the canvas
 * @returns 
 */
export const Canvas = (selector, width, height) => {
	if (!(typeof selector === 'string'))
		throw new Error("Canvas selector must be a string");

	const domRef = document.querySelector(selector);

	if (!isCanvas(domRef))
		throw new Error("The targeted object must be a HTML Canvas");

	//guard des w/h en number | undef
	if(width && height)
	{
		if(typeof width !== 'number' || typeof height !== 'number')
			throw new Error("The width and the height must be numbers");
	}

	const ctx = domRef.getContext("2d");
	domRef.width = width ?? 0;
	domRef.height = height ?? 0;

	// const isResized = false;
	// const ratio = 0;

	//return avec lock des elemts pour simuler une struct mut
	return Object.seal({
		__type: "CanvasStruct",
		domRef,
		ctx,
		isResized,
		get width() {
			return domRef.width;
		},
		set width(val) {
			domRef.width = val;
		},
		get height() {
			return domRef.height;
		},
		set height(val) {
			domRef.height = val;
		}
	});
};

// IMPL
export const CanvasImpl = {
	test() {
		console.log("Je teste un truc");
	},
	autoResize(canvas) {
		//to be tested
		if (!canvas || !(canvas.__type === "CanvasStruct"))
			throw new Error("Object is not a Canvas struct");

		if (canvas.width >= canvas.height) {
			resizeWidth(canvas);
		}
		else {
			resizeHeight(canvas);
		}
	}
};

//Privates
function isCanvas(htmlElem) {
	return htmlElem && htmlElem instanceof HTMLCanvasElement;
}

function resizeWidth(canvas, size) {

	const ratio = canvas.width / size;
	canvas.width = size;
	canvas.height /= ratio;
}
function resizeHeight(canvas, size) {

	const ratio = canvas.height / size;
	canvas.width /= ratio;
	canvas.height = size;

}
