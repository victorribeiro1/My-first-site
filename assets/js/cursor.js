const cursor = document.querySelector('.cursor')
const encreaseCursorElements = document.querySelectorAll('.link')

const sliderArea = document.querySelector('.swiper-container')

const grabCursorDot = document.createElement('div')

document.addEventListener('mousemove', (e) => {
    // console.log('clientX: ' + e.clientX)
    // console.log('clientY: ' + e.clientY)
    cursor.style.left = e.clientX + 'px'
    cursor.style.top = e.clientY + 'px'
})

// ENABLE GRAB CURSOR
sliderArea.addEventListener('mousemove', () => {
    cursor.classList.add('grab')
    cursor.appendChild(grabCursorDot).classList.add('dot')
})

// DISABLE GRAB CURSOR
sliderArea.addEventListener('mouseout', () => {
    cursor.classList.remove('grab')
})

// GRAB CURSOR ARROWS
sliderArea.addEventListener('mousedown', () => {
    cursor.classList.add('expands')
})
sliderArea.addEventListener('mouseup', () => {
    cursor.classList.remove('expands')
})

// LINKS:HOVER
encreaseCursorElements.forEach(element => {
    element.addEventListener('mousemove', () => {
        cursor.classList.add('encrease')
    })

    element.addEventListener('mouseout', () => {
        cursor.classList.remove('encrease')
    })
})

// DECREASING CURSOR ONCLICK
// document.addEventListener('mousedown', () => {
//     cursor.classList.toggle('decrease')
// })