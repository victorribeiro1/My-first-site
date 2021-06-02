const toggleMenu = document.querySelector('.toggle-menu')
const toggleMenuButton = document.querySelector('.toggle-menu__icon-box')
const htmlTag = document.querySelector('html')
const Alllinks = document.querySelectorAll('a.link')

// block scroll when toggle-menu is oppened
// encrease the z-index to hide navigation
toggleMenuButton.addEventListener('click', () => {
    htmlTag.classList.toggle('menu-is-active')
    toggleMenu.classList.toggle('active')
}) 

Alllinks.forEach(link => {
    link.addEventListener('click', () => {
        console.log('clicked')
        htmlTag.classList.remove('menu-is-active')
        toggleMenu.classList.remove('active')
        document.getElementById('toggle').checked = false
    })
})