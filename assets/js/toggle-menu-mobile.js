const toggleMenuMobile = document.querySelector('.toggle-menu-mobile')
const toggleMenuMobileButton = document.querySelector('.toggle-menu-mobile__button')

toggleMenuMobileButton.addEventListener('click', () => {
    toggleMenuMobile.classList.toggle('active')
    htmlTag.classList.toggle('menu-is-active')
})

// BEFORE POSITION 

const TMBheadings = document.querySelectorAll('.toggle-menu-mobile__heading')
const TMBheadingBox = document.querySelector('.toggle-menu-mobile__headings-box')

TMBheadings.forEach(TMBheading => {
    TMBheading.addEventListener('click', e => {
        if (e.target.classList.contains('right')) {
            TMBheadings[0].classList.remove('active')
            e.target.classList.add('active')
            TMBheadingBox.classList.add('right')
            
        }
        else {
            e.target.classList.add('active')
            TMBheadings[1].classList.remove('active')
            TMBheadingBox.classList.remove('right')
        }
    })
})