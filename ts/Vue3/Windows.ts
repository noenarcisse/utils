
//definir les modules authorisés en fenetres ici
import { markRaw, type Component } from "vue";
import { isEmptyString } from "./Generics";




//peut etre utilisé facilement avec <component :is="resolveComponent(module)" />
export interface DOMWindow
{
    id : number;
    kind : string; //string for now, could be typed ? used to differentiate popups and normal windows
    name : string;
    width? : number;
    height? : number;
    index? : number;
    module : Component;
}

//TODO
export function createDOMWindow(name : string, module : Component) : DOMWindow
{
    return {
        id: 1,
        kind : "test",
        name: !isEmptyString(name) ? name : "Window",
        width: 100,
        height: 100,
        index: 1,
        module: module
    };
}


//TODO
// possiblement moyen d'ameliorer ca en Record<number, Function> ? avec un loader en fonction du component? 
export class ComponentsLibrary
{
    private _components : Map<number, Component> = new Map();
    private currentId: number = 0;
    private unusedIds : number[] = [];

    addComponent(compo : Component) : number
    {
        const id = this.generateId();
        //mark raw pour eviter les proxies abusif.
        this._components.set(id, markRaw(compo));

        return id;
    }

    removeComponent(id : number) : boolean
    {
        let isDeleted : boolean = this._components.delete(id)

        if(isDeleted)
            this.unusedIds.push(id);

        return isDeleted;
    }

    getComponent(id : number) : Component
    {
        const compo = this._components.get(id);
        if(compo === undefined)
            throw new Error("Aucun module ne possède l'ID spécifiée.");
        
        return compo;
    }

    //privates methods
    private generateId() : number
    {
        if(this.unusedIds.length > 0)
            return this.unusedIds.shift() as number; //force cast, cannot be undef

        this.currentId++;
        return this.currentId; 
    }
}