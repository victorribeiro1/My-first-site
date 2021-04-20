const links = document.querySelectorAll('.toggle-menu__link')
console.log(links)
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.classList.remove('go-away')
    })
    link.addEventListener('mouseout', () => {
        link.classList.add('go-away')
    })
})