const P = (S,J) => new Promise(S, J);

export function loadImage(url, timeoutMs = 1000){

    let img = new Image()
    return P((res, rej) => {
        let timeoutFn = function(){
            img.src = ""
            img = null
            rej(new Error("Timeout"))
        },
        timeout = setTimeout(timeoutFn, timeoutMs)

        img.src = url
        img.onload = function(){
            clearTimeout(timeout)
            res(img)
        }
        img.onerror = function(){
            clearTimeout(timeout)
            rej(new Error(`Load Error`))

        }

    })
}
export const sleep = ms => P(r => setTimeout(r, ms))
export const rand = (n,x) => Math.random() * (x-n) + n;
export const irand = (n,x) => Math.round(rand(n,x));

export const log = console.log.bind(console),
    clear = console.clear.bind(console)


export const prepareCanvas = function(canvasSel, W, H){
    let 
    /** @type {HTMLCanvasElement} */
        canvas = document.querySelector(canvasSel),
    /** @type {CanvasRenderingContext2D} */
        ctx = canvas.getContext("2d")

    canvas.width = W
    canvas.height = H
    return {W, H, canvas, ctx}
}
export const prepareVirtualCanvas = function(baseCtx){
    let 
        W = baseCtx.canvas.width,
        H = baseCtx.canvas.height,
    /** @type {HTMLCanvasElement} */
        canvas = new OffscreenCanvas(W, H),
    /** @type {CanvasRenderingContext2D} */
        ctx = canvas.getContext("2d")

    return {W, H, canvas, ctx}
}

