const toggleMenu = document.querySelector('.toggle-menu')
const toggleMenuButton = document.querySelector('.toggle-menu__icon-box')
const htmlTag = document.querySelector('html')
const Alllinks = document.querySelectorAll('a.link')
const toggleInput = document.getElementById('toggle')

// block scroll when toggle-menu is oppened
// encrease the z-index to hide navigation
toggleMenuButton.addEventListener('click', () => {
    htmlTag.classList.toggle('menu-is-active')
    toggleMenu.classList.toggle('active')
    toggleInput.classList.toggle('checked')
}) 

Alllinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleInput.classList.remove('checked')
        htmlTag.classList.remove('menu-is-active')
        toggleMenu.classList.remove('active')
    })
})