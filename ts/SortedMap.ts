
export class SortedMap<T>
{
    private _order : number[];
    private _map : Map<number, T[]>;

    //used for lazy sorting
    private _isSorted : boolean;

    constructor(map? : Map<number, T[]>)
    {
        if(!map)
        {
            this._order = [];
            this._map = new Map<number, T[]>();
            this._isSorted = false;
            return;
        }

        this._order = [...map.keys()];
        this._map = new Map(map);
        this._isSorted = false;
    }

    get(key : number) : T[] | undefined
    {
        return this._map.get(key);
    }

    set(key : number, value : T) : void
    {
        if(this._map.has(key))
        {
            this._map.get(key)!.push(value);
            return;
        }

        const values : T[] =  [value];
        this._map.set(key, values);
        this._order.push(key);

        this._isSorted = false;
        //non
        //this.sort();
    }

    delete(key : number) : void
    {
        this._map.delete(key);
        this._order = this._order.filter(k => k !== key);
    }

    getAllByOrder() : T[]
    {
        this.sort();
        return this._order.flatMap(k => this._map.get(k)!);
    }

    getAllByOrderDesc() : T[]
    {
        this.sort();
        return this._order.flatMap(k => this._map.get(k)!).reverse();
    }

    getHighest() : T[] | undefined
    {
        if(this.isEmpty()) return undefined;

        this.sort();
        return this._map.get(this._order[this._order.length - 1]);
    }
    getLowest() : T[] | undefined
    {
        if(this.isEmpty()) return undefined;

        this.sort();
        return this._map.get(this._order[0]);
    }

    isEmpty() : boolean
    {
        return this._order.length <= 0;
    }

    //PRIVATES
    private sort() : void
    {
        if(this._isSorted) return;

        this._order = [...this._map.keys()];
        this._order.sort((a, b) => a - b);

        this._isSorted=true;
    }

}