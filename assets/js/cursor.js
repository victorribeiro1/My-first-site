const cursor = document.querySelector('.cursor')
const links = document.querySelectorAll('.link')

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
links.forEach(link => {

    if (link.classList.contains('link--1')) {
        link.addEventListener('mousemove', () => {
        cursor.classList.add('encrease--1')
    })

    link.addEventListener('mouseout', () => {
        cursor.classList.remove('encrease--1')
    })
    
    } else if (link.classList.contains('link--4')) {
        link.addEventListener('mousemove', () => {
            cursor.classList.add('encrease--4')
        })
    
        link.addEventListener('mouseout', () => {
            cursor.classList.remove('encrease--4')
        })
    }
})

// DECREASING CURSOR ONCLICK
// document.addEventListener('mousedown', () => {
//     cursor.classList.toggle('decrease')
// })