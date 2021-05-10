const toggleMenu = document.querySelector('.toggle-menu')
const toggleMenuButton = document.querySelector('.toggle-menu__button')
const body = document.querySelector('body')

// block scroll when toggle-menu is oppened
// encrease the z-index to hide navigation
toggleMenuButton.addEventListener('click', () => {
    body.classList.toggle('menu-is-active')
    toggleMenu.classList.toggle('active')
})