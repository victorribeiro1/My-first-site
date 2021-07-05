const toggleMenuMobile = document.querySelector('.toggle-menu-mobile')
const toggleMenuMobileButton = document.querySelector('.toggle-menu-mobile__button')

toggleMenuMobileButton.addEventListener('click', () => {
    toggleMenuMobile.classList.toggle('active')
})

// BEFORE POSITION 

const TMBheadings = document.querySelectorAll('.toggle-menu-mobile__heading')
const TMBheadingBox = document.querySelector('.toggle-menu-mobile__headings-box')

TMBheadings.forEach(TMBheading => {
    TMBheading.addEventListener('click', e => {
        if (e.target.classList.contains('right')) {
            TMBheadingBox.classList.add('right')
        }
        else {
            TMBheadingBox.classList.remove('right')
        }
    })
})