const cursor = document.querySelector('.cursor')
const encreaseCursorElements = document.querySelectorAll('.scale-cursor')

const faq = document.querySelector('.faq')
const evaluations = document.querySelector('.evaluations')
const sliderArea = document.querySelector('.swiper-container')
const swiperWrapper = document.querySelector('.swiper-wrapper')
const swiperSlider = document.querySelector('.swiper-slide')
const card = document.querySelector('.card')
const content = document.querySelector('.content')
const layer = document.querySelector('.layer')
const text = document.querySelector('.evaluation-text')

const grabCursorDot = document.createElement('div')


console.log(sliderArea)

console.log(cursor)

document.addEventListener('mousemove', (e) => {
    // console.log('clientX: ' + e.clientX)
    // console.log('clientY: ' + e.clientY)
    cursor.style.left = e.clientX + 'px'
    cursor.style.top = e.clientY + 'px'
})

encreaseCursorElements.forEach(element => {
    element.addEventListener('mousemove', () => {
        cursor.classList.add('encrease')
    })

    element.addEventListener('mouseout', () => {
        cursor.classList.remove('encrease')
    })
})

sliderArea.addEventListener('mousemove', (e) => {
    console.log('in')
    cursor.classList.add('grab')
    cursor.appendChild(grabCursorDot).classList.add('dot')
})

sliderArea.addEventListener('mousedown', (e) => {
    cursor.classList.add('expands')
})
sliderArea.addEventListener('mouseup', (e) => {
    cursor.classList.remove('expands')
})

faq.addEventListener('mouseenter', () => {
    console.log('in')
    cursor.classList.remove('grab')
    // cursor.removeChild(grabCursorDot)
})