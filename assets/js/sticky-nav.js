const navs = document.querySelectorAll('#nav')
const toggleMenuButtons2 = document.querySelectorAll('.toggle-menu__button-box')
let lastScrollTop = 0

function toggleNavVisibility() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if ((scrollTop > lastScrollTop) && (document.documentElement.scrollTop > 60)) {
        navs.forEach(nav => {
            nav.style.top = '-100px'
        })
        
        toggleMenuButtons2.forEach(toggleMenuButton2 => {
            toggleMenuButton2.style.top = '-100px'
        })
        
    } else {
        navs.forEach(nav => {
            nav.style.top = '0'
        })
        
        toggleMenuButtons2.forEach(toggleMenuButton2 => {
            toggleMenuButton2.style.top = '-8px'
        })

    }

    lastScrollTop = scrollTop
}

window.addEventListener('scroll', toggleNavVisibility)