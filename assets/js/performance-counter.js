const counters = document.querySelectorAll('.performance__counter')
function animateCounter() {

    let firstCounter = counters[0].innerText
    let secondCounter = counters[1].innerText
    let tertiaryCounter = counters[2].innerText

    const firstInterval = setInterval(() => {
        
        if (firstCounter == 10) {
            clearInterval(firstInterval)
        }

        counters[0].innerText = firstCounter++

    }, 160)

    const secondInterval = setInterval(() => {
        
        if (secondCounter == 3620) {
            clearInterval(secondInterval)
        }

        counters[1].innerText = secondCounter++

    }, 1)

    const tertiaryInterval = setInterval(() => {

        
        if (tertiaryCounter == 98) {
            clearInterval(tertiaryInterval)
        }

        counters[2].innerText = tertiaryCounter++

    }, 17)
}