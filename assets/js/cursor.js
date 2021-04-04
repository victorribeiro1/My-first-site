const cursor = document.querySelector('.cursor')
const content = document.querySelector('.evaluation-text')
const encreaseCursorElements = document.querySelectorAll('.scale-cursor')

console.log(cursor)

document.addEventListener('mousemove', (e) => {
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

window.addEventListener('mousemove', (e) => {
    console.log('clientX: ' + e.clientX)
    console.log('clientY: ' + e.clientY)
    console.log('')
    console.log('pageX: ' + e.pageX)
    console.log('pageY: ' + e.pageY)
    console.log('')
})