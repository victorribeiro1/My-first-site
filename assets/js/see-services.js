// This file is response for the menegement of the display at services inside the carousel

const seeServicesButton = document.getElementById('seeServices')
const descriptionTexts = document.querySelectorAll('.vertical-carousel__text')
const serviceBoxes = document.querySelectorAll('.carousel__services-box')
const services = document.querySelectorAll('.carousel__service')

function toggleClasses() {
    descriptionTexts.forEach(text => text.classList.toggle('hide')) // Opacity of the text
    seeServicesButton.classList.toggle('active') // Animation of the button
    serviceBoxes.forEach(box => box.classList.toggle('active')) // Background blur
    services.forEach(service => service.classList.toggle('active')) // Animation of the services -> translateX and Opacity
}

function addClasses() {
    descriptionTexts.forEach(text => text.classList.add('hide'))
    seeServicesButton.classList.add('active')
    serviceBoxes.forEach(box => box.classList.add('active'))
    services.forEach(service => service.classList.add('active'))
}

function removeClasses() {
    descriptionTexts.forEach(text => text.classList.remove('hide'))
    seeServicesButton.classList.remove('active')
    serviceBoxes.forEach(box => box.classList.remove('active'))
    services.forEach(service => service.classList.remove('active'))
}

// seeServicesButton.addEventListener('click', () => toggleClasses())
seeServicesButton.addEventListener('mouseenter', toggleClasses)
serviceBoxes.forEach(box => box.addEventListener('mouseenter', addClasses))
services.forEach(service => service.addEventListener('mouseout',  removeClasses))
services.forEach(service => service.addEventListener('mousemove', addClasses))