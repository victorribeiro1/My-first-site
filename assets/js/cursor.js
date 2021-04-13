const cursorSmall = document.querySelector('.cursor--small')
const cursorBig = document.querySelector('.cursor--big')

document.addEventListener('mousemove', (e) => {
    cursorBig.style.left = cursorSmall.style.left = e.clientX + "px" 
    cursorBig.style.top = cursorSmall.style.top = e.clientY + "px" 
})

// ENABLE GRAB CURSOR

// DISABLE GRAB CURSOR

// GRAB CURSOR ARROWS

// LINKS:HOVER