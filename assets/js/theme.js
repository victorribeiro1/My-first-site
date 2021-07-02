const swipeButtons = document.querySelectorAll('#swipeButton')
const html = document.querySelector('html')


swipeButtons.forEach(swipeButton => {
    swipeButton.addEventListener('click', () => {
        swipeButton.classList.toggle('active')
        html.getAttribute('current-theme') === 'dark' ? 
        html.setAttribute('current-theme', 'light') : 
        html.setAttribute('current-theme', 'dark')
    })
})