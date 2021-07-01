const linksBox = document.querySelectorAll('.footer-mobile__links-box')

linksBox.forEach(boxLink => {
    boxLink.addEventListener('click', () => boxLink.classList.toggle('active'))
})