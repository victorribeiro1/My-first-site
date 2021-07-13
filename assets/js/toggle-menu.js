const toggleMenus = document.querySelectorAll('.toggle-menu')
const toggleMenuButtons = document.querySelectorAll('.toggle-menu__icon-box')
const htmlTag = document.querySelector('html')
const AllLinks = document.querySelectorAll('a.link')
const toggleInputs = document.querySelectorAll('#toggle')

// block scroll when toggle-menu is oppened
// encrease the z-index to hide navigation
toggleMenuButtons.forEach(toggleMenuButton => { 
    toggleMenuButton.addEventListener('click', () => {
        htmlTag.classList.toggle('menu-is-active')
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.toggle('active')
        })
        document.querySelector('.toggle-menu-mobile').classList.toggle('active')
        
        toggleInputs.forEach(toggleInput => {
            toggleInput.classList.toggle('checked')
        })
    }) 
});

AllLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleInputs.forEach(toggleInput => {
            toggleInput.classList.remove('checked')
        })
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.remove('active')
        })
        htmlTag.classList.remove('menu-is-active')
        document.querySelector('.toggle-menu-mobile').classList.remove('active')
    })
})