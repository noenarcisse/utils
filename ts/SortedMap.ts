//violement windsurfed, a relire

export class SortedMap<T>
{
    private _order : number[];
    private _map : Map<number, T>;

    constructor(map? : Map<number, T>)
    {
        if(!map)
        {
            this._order = [];
            this._map = new Map<number, T>();
            return;
        }

        this._order = [...map.keys()];
        this._order.sort((a, b) => a - b);
        this._map = new Map(map);
    }

    get(key : number) : T | undefined
    {
        return this._map.get(key);
    }

    //Bug : set ne met pas à jour _order lors d'un update
    //En fait ici pas de bug, mais les deux branches font this._map.set(key, value) — elles se simplifient :
    set(key : number, value : T) : void
    {
        if(this._map.has(key))
        {
            this._map.set(key, value);
            return;
        }

        this._map.set(key, value);
        this.sort();
    }

    delete(key : number) : void
    {
        this._map.delete(key);
        this._order = this._order.filter(k => k !== key);
    }

    getAllByOrder() : T[]
    {
        return this._order.map(k => this._map.get(k)!);
    }

    //getAllByOrderDesc mute le tableau de retour
    //.reverse() est in-place en JS — il inverse _order lui-même si 
    // on ne fait pas attention. Ici c'est safe car .map() crée un nouveau tableau avant le .reverse(), 
    // mais c'est un piège classique à noter :

    getAllByOrderDesc() : T[]
    {
        return this._order.map(k => this._map.get(k)!).reverse();
    }

    //Logique ? : getHighest / getLowest lèvent une erreur mais sont typées | undefined
    getHighest() : T | undefined
    {
        if(this.isEmpty())
            throw new Error("Sorted map is empty");

        return this._map.get(this._order[this._order.length - 1]);
    }

    getLowest() : T | undefined
    {
        if(this.isEmpty())
            throw new Error("Sorted map is empty");
        
        return this._map.get(this._order[0]);
    }

    private sort() : void
    {
        this._order = [...this._map.keys()];
        this._order.sort((a, b) => a - b);
    }
    //C'est une info utile pour le caller, pas de raison de la garder privée
    private isEmpty() : boolean
    {
        return this._order.length <= 0;
    }
}