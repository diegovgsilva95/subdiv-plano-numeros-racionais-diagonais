import {sleep, clear, log, irand, prepareCanvas} from "./utils.mjs"
import Vector from "./vector.mjs"
import Line from "./line.mjs"
import Decimal from "../node_modules/decimal.js/decimal.mjs"

const DESCANSO_QTD = 500000,
    DESCANSO_QTD_DESENHO = 50000

let tamanhoQuadrado = 840,
    /** @type {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, W: number, H: number}} */
    {canvas, ctx, W, H} = prepareCanvas("canvas", tamanhoQuadrado, tamanhoQuadrado),
    divisões = 2,
    /** @type {Line[]} */
    linhas = [],
    pinos = [],
    ultimaRender = {
        linhas: 0,
        pinos: 0
    }
    
let computar = async function(){
    let intervalo = Array.from(Array(divisões + 1)).map((_, i) => i),
        intervaloA = intervalo,
        intervaloB = intervalo.slice(1),
        qtdIntervaloA = intervaloA.length,
        qtdIntervaloB = intervaloB.length,
        permutações = [],
        permutaçõesÚnicas = [],
        pontos = [],
        i = 0
    
    log(intervaloA, intervaloB)
    log()
    log(`Gerando ${qtdIntervaloA * qtdIntervaloB} permutações...`)
    for(i = 0; i < qtdIntervaloA * qtdIntervaloB; i++){
        let índiceA = i % qtdIntervaloA,
            índiceB = (i / qtdIntervaloA) | 0,
            A = intervaloA[índiceA],
            B = intervaloB[índiceB],
            r = Decimal(A).div(B),
            found = false
            
        permutações.push({
            A, B, r
        })
        
        for(let permutação of permutaçõesÚnicas)
            if(permutação.eq(r)){
                found = true
                break
            }

        if(!found){
            r.A = A
            r.B = B
            permutaçõesÚnicas = [...permutaçõesÚnicas, r].sort()
        }

        if(i > 0 && i % DESCANSO_QTD == 0)
            await sleep(1000/30)
    }

    log(`${permutaçõesÚnicas.length} permutações únicas.`)

    i = 0
    log(`Gerando ${permutaçõesÚnicas.length**2} pontos...`)
    for(let permutaçãoA of permutaçõesÚnicas){
        for(let permutaçãoB of permutaçõesÚnicas){
            // let [x,y] = [W * permutaçãoA / divisões, H * permutaçãoB / divisões],
            let [x,y] = [+(permutaçãoA.mul(W).div(divisões)), +(permutaçãoB.mul(H).div(divisões))],
                v = new Vector(x, y)
            pontos.push(v)

            if(++i % DESCANSO_QTD == 0)
                await sleep(1000/30)
        }
    }


    i = 0
    log(`Gerando ${pontos.length*(pontos.length-1)/2} linhas...`)
    for(let ia = 0; ia < pontos.length-1; ia++){
        let cor = [(360 * (ia / (pontos.length-1))).toFixed(2) + "deg", irand(69,81)+"%", irand(28,30)+"%"],
            a = pontos[ia],
            pino = new Vector(a.x, a.y)

        pino.cor = cor
        pinos.push(pino)

        for(let ib = ia+1; ib < pontos.length; ib++){
            let b = pontos[ib]
            if(ia == pontos.length-2 && ib == pontos.length-1){
                let cor = [360 + "deg", irand(69,81)+"%", irand(28,30)+"%"],
                    pino = new Vector(b.x, b.y)
        
                pino.cor = cor
                pinos.push(pino)
            }
                
            // if(a.x != b.x && a.y != b.y){
                let linha = new Line(a, b)
                linha.cor = cor
                linhas.push(linha)
                // log(linha.A, linha.B)
            // }

            if(++i % DESCANSO_QTD == 0)
                await sleep(1000/30)

        }
    }

    log(`${linhas.length} linhas foram geradas, de ${pontos.length*(pontos.length-1)/2} linhas previstas`)
    requestAnimationFrame(draw)

    

},

draw = async function(){

    if(ultimaRender.linhas != linhas.length || ultimaRender.pinos != pinos.length){
        ctx.fillStyle = "#CCC"
        ctx.lineWidth = 3
        ctx.fillRect(0, 0, W, H)
        let i = 0
    
        for(let linha of linhas){
            ctx.strokeStyle = `hsla(${linha.cor},0.5)`
            ctx.beginPath()
            ctx.moveTo(linha.A.x, linha.A.y)
            ctx.lineTo(linha.B.x, linha.B.y)
            ctx.stroke()

            if(++i % DESCANSO_QTD_DESENHO == 0){
                await sleep(1000/30)
            }
        }
        
        i = 0
        for(let pino of pinos){
            ctx.fillStyle = `hsla(${pino.cor},0.5)`
            ctx.beginPath()
            ctx.arc(pino.x, pino.y, W/30, 0, 7)
            ctx.fill()

            if(++i % DESCANSO_QTD_DESENHO == 0){
                await sleep(1000/30)
            }
        }
        ultimaRender.linhas = linhas.length
        ultimaRender.pinos = pinos.length
    }

    requestAnimationFrame(draw)
}


Decimal.set({ precision: 50 })
clear()
Vector.redim(W, H)
computar()