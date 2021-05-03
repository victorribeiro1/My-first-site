const allItems = document.querySelectorAll('.carousel-item')
const buttons = document.querySelectorAll('.carousel-button')

let counter2 = 1

function toggleSlideClasses(event) {
    if (event.target.classList.contains('right')) {
        counter2 < 3 ? counter2++ : counter2
        document.querySelectorAll(`.s${counter2}`).forEach(item => item.classList.add('current'))
        document.querySelectorAll(`.s${counter2 - 1}`).forEach(item => item.classList.remove('current'))
        allItems.forEach(item => item.classList.add(`slide${counter2}`))
        allItems.forEach(item => item.classList.remove(`slide${counter2 - 1}`))
    } else {
        counter2 > 1 ? counter2-- : counter2
        document.querySelectorAll(`.s${counter2}`).forEach(item => item.classList.add('current'))
        document.querySelectorAll(`.s${counter2 + 1}`).forEach(item => item.classList.remove('current'))
        allItems.forEach(item => item.classList.add(`slide${counter2}`))
        allItems.forEach(item => item.classList.remove(`slide${counter2 + 1}`))
    }
}

buttons.forEach(button => {
    button.addEventListener('click', (event) => toggleSlideClasses(event))
})