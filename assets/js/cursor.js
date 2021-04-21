const cursors = document.querySelectorAll('.cursor')
const cursorSmall = document.querySelector('.cursor--small')
const cursorBig = document.querySelector('.cursor--big')

window.onloadstart = cursors.forEach(cursor => cursor.style.opacity = 0)
setTimeout(() => {
    cursors.forEach(cursor => cursor.style.opacity = 1)
}, 700)

document.addEventListener('mousemove', (e) => {
    cursorBig.style.left = cursorSmall.style.left = e.clientX + "px" 
    cursorBig.style.top = cursorSmall.style.top = e.clientY + "px" 
    
    // hiding and showing the cursor accordingly the inner size of the device width
    
    // width, left:
    
    if (e.clientX > 10) {
        cursors.forEach(cursor => {
            cursor.classList.remove('hide--x')
        })
    }

    if (e.clientX / .98 >= window.innerWidth) {
        cursors.forEach(cursor => {
            cursor.classList.add('hide--x')
        })
    }
    
    // height, top:

    if (e.clientY <= 10) {
        cursors.forEach(cursor => {
            cursor.classList.add('hide--y')
        })
    } 
    
    if (e.clientY > 10) {
        cursors.forEach(cursor => {
            cursor.classList.remove('hide--y')
        })
    }

    if (e.clientY / .95 >= window.innerHeight) {
        cursors.forEach(cursor => {
            cursor.classList.add('hide--y')
        })
    }
})

// ENABLE GRAB CURSOR

// DISABLE GRAB CURSOR

// GRAB CURSOR ARROWS

// LINKS:HOVER