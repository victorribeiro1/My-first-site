const allItems = document.querySelectorAll('.carousel__item')
const allServices = document.querySelectorAll('.carousel__service')
const servicesSection = document.querySelector('.services')
const items = document.querySelector('.carousel__items')

// lembre-se de usar o magic scroll para usar 
// a funcionalidade do slide apenas quando a section estiver no meio da tela

function slide(e) {
    if (e.deltaY > 0) {
        items.scrollBy(900, 0)
    }
    else {
        items.scrollBy(-900, 0)
    }
}

servicesSection.addEventListener('wheel', (e) => slide(e))

// CAROUSEL MANAGER ->

const carouselButton = document.querySelectorAll('.carousel-button')

function clickShadow(event) {
    const target = event.target

    let x = event.clientX - event.target.offsetLeft
    let y = event.clientY - event.target.offsetTop
    console.log(event.target.offsetTop)

    let ripples = document.createElement('span')
    ripples.style.left = `${x}px`
    ripples.style.top = `${y}px`

    target.appendChild(ripples)
}

carouselButton.forEach(button => {
    button.addEventListener('click', function(event) {
        const target = event.target

        let x = event.clientX - event.target.offsetLeft
        let y = event.clientY - event.target.offsetTop
        console.log(event.target)

        let ripples = document.createElement('span')
        ripples.style.left = `${x}px`
        ripples.style.top = `${y}px`

        this.appendChild(ripples)
    })
})