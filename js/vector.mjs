export default class Vector {
    static W = 1000
    static H = 1000
    static redim(W, H){
        Vector.W = W
        Vector.H = H
    }
    constructor(x = 0, y = 0){
        this.x = x
        this.y = y
        Vector.W = Math.max(Vector.W, this.x)
    }
    get hash(){
        return Vector.W * this.y + this.x
    }
    toString(){
        return `(${this.x}, ${this.y})`
    }
}