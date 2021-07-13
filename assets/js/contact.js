const contactButton = document.querySelector('.contact__form__button')
const servicesSelect = document.querySelector('.contact__form__select--services')
const mediasSelect = document.querySelector('.contact__form__select--medias')

contactButton.addEventListener('click', e => {
    e.preventDefault()

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
        case "freio-para-carreta":
            number = "(+55) 11 93006-3018"
            break;
        default:
            break;
    }

    directUser()

})

function getSelectedMedia() {
    return mediasSelect.value
}

function directUser() {
    switch (getSelectedMedia()) {
        case "whatsapp":
            number = "(+55) 11 95306-5563"
            break;
            case "e-mail":
                window.location.href = `http://api.whatsapp.com/send?phone=${number}`;
            break;
            case "messenger":
                window.location.href = `http://api.whatsapp.com/send?phone=${number}`;
            break;
            case "direct":
                window.location.href = "https://www.instagram.com/direct/t/340282366841710300949128354136017563099";
            break;
        default:
            break;
    }
}



"(+55) 11 99002-7420"
"(+55) 11 95306-5563"
"(+55) 11 99002-7420"
"(+55) 11 95306-5563"
"(+55) 11 93006-3018"