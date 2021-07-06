const homePosition = document.getElementById('home').getBoundingClientRect().top
const aboutPosition = document.getElementById('about').getBoundingClientRect().top
const evaluationsPosition = document.getElementById('evaluations').getBoundingClientRect().top + 0
const faqPosition = document.getElementById('faq').getBoundingClientRect().top + 0
const linesPosition = document.getElementById('lines').getBoundingClientRect().top + 0

const linksHome = document.querySelectorAll('.link--home')
const linksAbout = document.querySelectorAll('.link--about')
const linksFaq = document.querySelectorAll('.link--faq')
const linksEvaluations = document.querySelectorAll('.link--evaluations')
const linksLines = document.querySelectorAll('.link--lines')

linksHome.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.toggle('active')
        })
        document.querySelector('.toggle-menu-mobile').classList.toggle('active')
        scrollto(homePosition)
    })
})

linksAbout.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.toggle('active')
        })
        document.querySelector('.toggle-menu-mobile').classList.toggle('active')
        scrollto(aboutPosition)
    })
})

linksFaq.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.toggle('active')
        })
        document.querySelector('.toggle-menu-mobile').classList.toggle('active')
        scrollto(faqPosition)
    })
})

linksLines.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.toggle('active')
        })
        document.querySelector('.toggle-menu-mobile').classList.toggle('active')
        scrollto(linesPosition)
    })
})

linksEvaluations.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenus.forEach(toggleMenu => {
            toggleMenu.classList.toggle('active')
        })
        document.querySelector('.toggle-menu-mobile').classList.toggle('active')
        scrollto(evaluationsPosition)
    })
})

function scrollto(position = 0) {
    console.log(position)
    window.scroll({
        top: position,
        left: 0,
        behavior: 'smooth'
    })
}