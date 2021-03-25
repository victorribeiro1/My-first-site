const links = document.querySelectorAll('.navigation__link')
const checkbox = document.querySelector('.checkbox-js')

links.forEach(link => {
    link.addEventListener('click', () => {
        checkbox.checked = false
    })
})