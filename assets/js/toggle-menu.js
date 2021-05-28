const toggleMenu = document.querySelector('.toggle-menu')
const toggleMenuButton = document.querySelector('.toggle-menu__icon-box')
const htmlTag = document.querySelector('html')

// block scroll when toggle-menu is oppened
// encrease the z-index to hide navigation
toggleMenuButton.addEventListener('click', () => {
    htmlTag.classList.toggle('menu-is-active')
    toggleMenu.classList.toggle('active')
}) 