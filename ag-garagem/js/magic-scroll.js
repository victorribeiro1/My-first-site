function showOrHideOnScroll() {
    const introElements = document.querySelectorAll('.fade')
    introElements.forEach(element => {
        const top = element.getBoundingClientRect().top
        const bottom = element.getBoundingClientRect().bottom
        const screenPosition = window.innerHeight

        if (top < screenPosition / 1.1) {
            element.classList.add('in')
            // if (element.classList.contains('alreadyAnimated')) {
            //     element.style.transitionDelay = '.2s'
            //     console.log('funciona')
            // } else {
                element.classList.add('alreadyAnimated')
            //}
        } else {
            if (element.classList.contains('alreadyAnimated')) {
                element.style.transitionDelay = '0s'
            }
            element.classList.remove('in')
        }
    })

}

window.addEventListener('scroll', showOrHideOnScroll)