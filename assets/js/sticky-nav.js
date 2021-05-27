const nav = document.getElementById('nav')
const toggleMenuButton2 = document.querySelector('.toggle-menu')
let lastScrollTop = 0

function toggleNavVisibility() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        nav.style.top = '-10rem'
        toggleMenuButton2.style.top = '-10rem'
    } else {
        nav.style.top = '0'
        toggleMenuButton2.style.top = '0'
    }

    lastScrollTop = scrollTop
}

window.addEventListener('scroll', toggleNavVisibility)