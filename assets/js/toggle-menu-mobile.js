const toggleMenuMobile = document.querySelector('.toggle-menu-mobile')
const toggleMenuMobileButton = document.querySelector('.toggle-menu-mobile__button')

toggleMenuMobileButton.addEventListener('click', () => {
    toggleMenuMobile.classList.toggle('active')
    document.querySelector('.toggle-menu').classList.toggle('active')
    document.querySelector('#toggle').classList.toggle('checked')

    htmlTag.classList.toggle('menu-is-active')
})

// BEFORE POSITION 

const TMBheadings = document.querySelectorAll('.toggle-menu-mobile__heading')
const TMBheadingBox = document.querySelector('.toggle-menu-mobile__headings-box')
const TMBlists = document.querySelectorAll('.toggle-menu-mobile__list')

TMBheadings.forEach(TMBheading => {
    TMBheading.addEventListener('click', e => {
        if (e.target.classList.contains('right')) {
            TMBheadings[0].classList.remove('active')
            e.target.classList.add('active')
            TMBheadingBox.classList.add('right')

            TMBlists[0].classList.remove('active')
            TMBlists[1].classList.add('active')
            
        }
        else {
            e.target.classList.add('active')
            TMBheadings[1].classList.remove('active')
            TMBheadingBox.classList.remove('right')

            TMBlists[0].classList.add('active')
            TMBlists[1].classList.remove('active')
        }
    })
})