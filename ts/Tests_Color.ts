import Color from "./Color";


let col : Color; 

col = new Color(200, 10, 200);
console.log(col);

//error normal
// col = new Color(200, 10);
// console.log(col);

col = new Color("#FF00FFFF");
console.log(col);

// col = new Color(257, 0, -1);
// console.log(col);

col = new Color(254, 10, -0, 1);
console.log(col);

col = new Color("#FF00FF");
console.log(col);

col = new Color("rgb(255, 0, 255)");
console.log(col);

col = new Color("rgb(25 0 255)");
console.log(col);

//error not normal alpha issue with .5 !!
// col = new Color("rgba(25 0 255 .5)");
// console.log(col);

col = new Color("rgba(25 0 255 0)");
console.log(col);

col = new Color("rgba(25 0 255 1)");
console.log(col);

col = new Color("rgba(25 0 255 0.5)");
console.log(col);

col = new Color("rgba(25, 0, 255, 0.5)");
console.log(col);

col = new Color("rgba(      25 0                 , 255            0.5)");
console.log(col);


// col = new Color("rgba(      2521 0                 , 255            0.5)");
// console.log(col);

col = new Color([2,1,3]);
console.log(col);

// col = new Color([2,1]);
// console.log(col);

// col = new Color([2,1,]);
// console.log(col);

//error array vide evidemment
// col = new Color(new Array());
// console.log(col);


const arr:number[] = new Array<number>(1,2,3,1);
col = new Color(arr);
console.log(col);

col = new Color([1,2,3,1]);
console.log(col);

// col = new Color([1,2,3,1.2]);
// console.log(col);

col = new Color([1,2,3, .2]);
console.log(col);

//les floats en plein dans le rgb ?!!
col = new Color([10.89,2,3, .2]);
console.log(col);