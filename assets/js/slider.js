const slider = document.querySelector('.slider')

let counter = 1
setInterval(() => {
    slider.classList.remove(`image--${counter}`)
    slider.classList.remove(`image--3`)

    slider.classList.add(`image--${++counter}`)
    counter = counter >= 3 ? counter = 0 : counter

}, 3000)