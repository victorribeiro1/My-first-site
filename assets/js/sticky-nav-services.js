const nav = document.getElementById('nav')
const toggleMenuButton2 = document.querySelector('.toggle-menu__button-box')
let lastScrollTop = 0

function toggleNavVisibility() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if ((scrollTop > lastScrollTop) && (document.documentElement.scrollTop > 95)) {
        nav.style.top = '-10rem'
        toggleMenuButton2.style.top = '-10rem'
    } else {
        nav.style.top = '0'
        toggleMenuButton2.style.top = '-1.2rem'
    }

    lastScrollTop = scrollTop
}

window.addEventListener('scroll', toggleNavVisibility)