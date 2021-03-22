const whatsappCall = document.getElementById('whatsapp-call')

const checkWhatsappCallPosition = () => {

    const windowHeight = window.innerHeight;
    const windowHWidth = window.innerWidth;

    if (windowHeight <= 260) {
        whatsappCall.style.display = 'none'
    }

    if (windowHeight >= 260 && whatsappCall.style.display == 'none') {
        whatsappCall.style.display = 'block'
    }
}

window.addEventListener('resize', checkWhatsappCallPosition)
window.addEventListener('load', checkWhatsappCallPosition)