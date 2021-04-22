const dropdown = document.querySelector('.dropdown')
const dropdownItems = document.querySelectorAll('.dropdown__content-box')

dropdown.addEventListener('mousemove', () => dropdown.classList.add('active'))
dropdown.addEventListener('mouseout', () => dropdown.classList.remove('active'))

dropdownItems.forEach(item => {
    item.addEventListener('mouseout', () => dropdown.classList.remove('active'))
    item.addEventListener('mouseenter', () => dropdown.classList.add('active'))
})

