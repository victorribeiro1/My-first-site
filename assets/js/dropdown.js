const dropdown = document.querySelector('.dropdown')
const dropdownMenu = document.querySelector('.dropdown__menu')
const dropdownItems = document.querySelectorAll('.dropdown__link')

dropdown.addEventListener('mousemove', () => dropdown.classList.add('active'))
dropdown.addEventListener('mouseout', () => dropdown.classList.remove('active'))

dropdownItems.forEach(item => {
    item.addEventListener('mouseout', () => dropdown.classList.remove('active'))
    item.addEventListener('mousemove', () => dropdown.classList.add('active'))
})

