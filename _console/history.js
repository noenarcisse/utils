//history.js

export class History {
    /**
     * History class constructor
     * @param {string} textInput - The DOM selector to target the first element found.
     * @param {number} size - The maximum size of the history
     */
    constructor(textInput, size) {

        if (size <= 0)
            throw new Error("The size of the history must be bigger than 0!");

        if (!typeof textInput === "object") {
            //guard pour verifier le DOM element est bien un text input!
        }

        if (size !== "undefined")
            this._size = size+2; //representation reelle du nombre d'element dans la liste sans le [0] immuable

        //lock [0] with empty string for ux
        this._entries = [""];
        this._cursor = 0;
        this._target = document.body.querySelector(textInput);

    }

    /**
     * Initialize the listeners on the targeted DOM element
     * @returns 
     */
    Init() {
        if (this._target === "undefined")
            return;

        this._target.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                this.Log( this._target.value);
            }
            else if (e.key === "ArrowUp") {
                this.Browse(1);
            }
            else if (e.key === "ArrowDown") {
                this.Browse(-1);
            }
            else {
                this._cursor = -1;
            }
        });
    }


    /**
     * Log the text in the history
     * @param {string} str 
     */
    Log(str) {
        if(str !== "")
            this._entries.unshift(str);

        this.Trim();
    }

    /**
     * Browse the entries saved in the history.
     * @param {*} offset - The offset used to move the cursor in the history
     */
    Browse(offset) {
        if (offset > 0 && (this._cursor + offset) < this._entries.length) {
            this._cursor += offset;
            this._target.value = this._entries[this._cursor];
        }
        if (offset < 0 && (this._cursor + offset) >= 0) {
            this._cursor += offset;
            this._target.value = this._entries[this._cursor];
        }
    }

    Trim()
    {
        if(this._size === "undefined")
            return;

        if(this._entries.length >= this._size)
            this._entries.splice(this._entries.length-2, 1);    //pop de l'element -2
    }
}