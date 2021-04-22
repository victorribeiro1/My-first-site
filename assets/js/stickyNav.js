const nav = document.getElementById('nav')

let lastScrollTop = 0

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        nav.style.top = '-10rem'
    } else {
        nav.style.top = '0'
    }

    lastScrollTop = scrollTop
})