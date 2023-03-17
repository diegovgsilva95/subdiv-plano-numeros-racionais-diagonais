import Vector from "./vector.mjs";

export default class Line {
    /** @param {Vector} */
    constructor(A, B){
        this.A = A
        this.B = B
    }
    toString(){
        return `${this.A.toString()} -> ${this.B.toString()}`
    }
    static fromCoords(Ax, Ay, Bx, By){
        return new Line(new Vector(Ax, Ay), new Vector(Bx, By))
    }
}