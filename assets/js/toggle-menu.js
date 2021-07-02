const toggleMenus = document.querySelectorAll('.toggle-menu')
const toggleMenuButtons = document.querySelectorAll('.toggle-menu__icon-box')
const htmlTag = document.querySelector('html')
const Alllinks = document.querySelectorAll('a.link')
const toggleInputs = document.querySelectorAll('#toggle')

// block scroll when toggle-menu is oppened
// encrease the z-index to hide navigation
toggleMenuButtons.forEach(toggleMenuButton => { 
    toggleMenuButton.addEventListener('click', () => {
        htmlTag.classList.toggle('menu-is-active')
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.toggle('active')
        })
        
        toggleInputs.forEach(toggleInput => {
            toggleInput.classList.toggle('checked')
        })
    }) 
});

Alllinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleInput.classList.remove('checked')
        htmlTag.classList.remove('menu-is-active')
        toggleMenu.classList.remove('active')
    })
})