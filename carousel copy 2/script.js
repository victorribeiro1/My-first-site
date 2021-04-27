const div = document.querySelector('.div')

// div.addEventListener('mouseenter', (e) => {
//     console.log('scrolled')
// })

function noScroll() {
    return window.scrollTo(0, 0)
}

window.addEventListener('scroll', (e) => noScroll())