const verticalItems = document.querySelectorAll('.vertical-carousel__items')
const servicesSection2 = document.querySelector('.services')

const textItems = document.querySelectorAll('.vertical-carousel__items--text') 
const numberItems = document.querySelectorAll('.vertical-carousel__items--numbers')

function slideText(e) {
    if (e.deltaY > 0) {
        console.log(textItems)
        textItems.forEach(items => items.scrollBy(0, 120))
    }
    else {
        textItems.forEach(items => items.scrollBy(0, -120))
    }
}

servicesSection2.addEventListener('wheel', (e) => slideText(e))

function slideNumber(e) {
    if (e.deltaY > 0) {
        console.log(numberItems)
        numberItems.forEach(items => items.scrollBy(0, 250))
    }
    else {
        numberItems.forEach(items => items.scrollBy(0, -250))
    }
}

servicesSection2.addEventListener('wheel', (e) => slideNumber(e))