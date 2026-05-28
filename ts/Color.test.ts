import { describe, it, expect } from "vitest";
import Color from "./Color";

describe("Color - constructeur RGB", () => {

    it("crée une couleur valide avec 3 canaux", () => {
        const col = new Color(200, 10, 200);
        expect(col.r).toBe(200);
        expect(col.g).toBe(10);
        expect(col.b).toBe(200);
        expect(col.a).toBe(1);
    });

    it("rejette un RGB hors limites", () => {
        expect(() => new Color(257, 0, -1)).toThrow();
    });

});

describe("Color - constructeur string hex", () => {

    it("parse #FF00FF correctement", () => {
        const col = new Color("#FF00FF");
        expect(col.r).toBe(255);
        expect(col.g).toBe(0);
        expect(col.b).toBe(255);
    });

    it("parse #FF00FFFF avec alpha", () => {
        const col = new Color("#FF00FFFF");
        expect(col.a).toBeCloseTo(1);
    });

});

describe("Color - constructeur rgba()", () => {

    it("parse rgba avec virgules", () => {
        const col = new Color("rgba(25, 0, 255, 0.5)");
        expect(col.a).toBeCloseTo(0.5);
    });

    // ton bug identifié dans les commentaires !
    it("parse rgba avec .5 sans zéro devant", () => {
        const col = new Color("rgba(25 0 255 .5)");
        expect(col.a).toBeCloseTo(0.5);
    });

});