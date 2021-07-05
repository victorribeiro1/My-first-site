const toggleMenuMobile = document.querySelector('.toggle-menu-mobile')
const toggleMenuMobileButton = document.querySelector('.toggle-menu-mobile__button')

toggleMenuMobileButton.addEventListener('click', () => {
    toggleMenuMobile.classList.toggle('active')
})