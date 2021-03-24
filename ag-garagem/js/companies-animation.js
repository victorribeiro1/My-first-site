const inHaus = document.getElementById('inHaus')
const topLyne = document.getElementById('topLyne')
const solistica = document.getElementById('solistica')
const wecareAuto = document.getElementById('wecareAuto')

let counterInHaus = 0
let counterTopLyne = 400
let counterSolistica = 800
let counterWecareAuto = 1200
setInterval(() => {
    
    // inHaus
    let xLeftInHaus = inHaus.getBoundingClientRect().left
    inHaus.style.left = counterInHaus + 'px'
    counterInHaus++
    
    if (xLeftInHaus > window.screen.width) {
        counterInHaus = -200
    }
    

    // topLyne
    let xLeftTopLyne = topLyne.getBoundingClientRect().left
    topLyne.style.left = counterTopLyne + 'px'
    counterTopLyne++
    
    if (xLeftTopLyne > window.screen.width) {
        counterTopLyne = -200
    }
    
    
    // solistica
    let xLeftSolistica = solistica.getBoundingClientRect().left
    solistica.style.left = counterSolistica + 'px'
    counterSolistica++

    if (xLeftSolistica > window.screen.width) {
        counterSolistica = -200
    }


    // wecareAuto
    let xLeftWecareAuto = wecareAuto.getBoundingClientRect().left
    wecareAuto.style.left = counterWecareAuto + 'px'
    counterWecareAuto++

    if (xLeftWecareAuto > window.screen.width) {
        counterWecareAuto = -200
    }
}, 20)