const seeServicesButton = document.getElementById('seeServices')
const descriptionTexts = document.querySelectorAll('.vertical-carousel__text')
const serviceBoxes = document.querySelectorAll('.carousel__services-box')
const services = document.querySelectorAll('.carousel__service')

seeServicesButton.addEventListener('click', () => {
    descriptionTexts.forEach(text => text.classList.toggle('hide'))
    seeServicesButton.classList.toggle('active')
    serviceBoxes.forEach(box => box.classList.toggle('active'))
    services.forEach(service => service.classList.toggle('active'))
})