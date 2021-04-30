const allItems = document.querySelectorAll('.carousel__item')
const allServices = document.querySelectorAll('.carousel__service')
const servicesSection = document.querySelector('.services')
const items = document.querySelector('.carousel__items')

// lembre-se de usar o magic scroll para usar 
// a funcionalidade do slide apenas quando a section estiver no meio da tela

// const firstItem = allItems[0]

console.log(items)

//counter has already been decleared before
let counter2 = 0

function slide(e) {
    if (e.deltaY > 0) {
        // console.log('scrol up')
        
        allItems.forEach(item => item.classList.add(`slideTo${++counter2}`))
        servicesSection.classList.add('noScroll')
        // items.scrollBy(900, 0)
        
        
        // return e.target.scrollBy(900, 0)
    }
    else {
        console.log('scrol down')
        items.scrollBy(-900, 0)

        // allItems.forEach(item => item.classList.remove(`slideTo${++counter2}`))
    }
}

servicesSection.addEventListener('wheel', (e) => slide(e))