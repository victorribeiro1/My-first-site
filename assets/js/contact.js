const contactButton = document.querySelector('.contact__form__button')
const servicesSelect = document.querySelector('.contact__form__select--services')
const mediasSelect = document.querySelector('.contact__form__select--medias')

contactButton.addEventListener('click', e => {
    e.preventDefault()
    redirectUser()
})

function getSelectedMedia() {
    return mediasSelect.value
}

function getPhoneNumber() {
    const service = servicesSelect.value
    let number

    switch (service) {
        case "alinhamento-e-geometria":
            number = "(+55) 11 99002-7420"
            break;
        case "ar-condicionado-e-climatizacao":
            number = "(+55) 11 95306-5563"
            break;
        case "borracharia-movel":
            number = "(+55) 11 99002-7420"
            break;
        case "higienizacao-interna":
            number = "(+55) 11 95306-5563"
            break;
        case "freios-para-carreta":
            number = "(+55) 11 93006-3018"
            break;
        default:
            break;
    }

    return number
}

function getVW() { //Viewport Width
    return window.innerWidth
}

function redirectUser() {
    switch (getSelectedMedia()) {
        case "whatsapp":
            whatsAppRedirectionerManager()
            break;

        case "e-mail":
            window.open("https://mail.google.com/mail/u/0/#inbox?compose=CllgCJNqskDXdrLVHxQwTtGLxrdpvrckhhFLVgNXJfjVvvpXphcTXJBDwZKRFxLPpzXlZTNZRjq", "_blank");
            break;

        case "messenger":
            window.open("https://www.messenger.com/t/100109504772290/?messaging_source=source%3Apages%3Amessage_shortlink", "_blank");
            break;

        case "direct":
            window.open("https://www.instagram.com/aggaragemsp/", "_blank");
            break;

        case "tell":
            const phoneNumber = getPhoneNumber()
            window.location.href = `tel:${phoneNumber}`;
            break;
            
        default:
            break;
    }
}

function mobileRedirect() {
    const phoneNumber = getPhoneNumber()
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
}

function desktopRedirect() {
    const phoneNumber = getPhoneNumber()
    window.open(`http://api.whatsapp.com/send?phone=${phoneNumber}`, "_blank");
}

function whatsAppRedirectionerManager() {
    getVW() < 500 ? mobileRedirect() : desktopRedirect()
}