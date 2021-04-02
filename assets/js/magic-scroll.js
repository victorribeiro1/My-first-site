function showOrHideOnScroll() {
    const introElements = document.querySelectorAll('.fade')
    introElements.forEach(element => {
        const top = element.getBoundingClientRect().top
        const screenPosition = window.innerHeight

        if (top < screenPosition / 1.1) {
            if (element.classList.contains('alreadyAnimated')) {
                
            } else {
                if (element.classList.contains('benefits-section')) {
                    const benefits = document.querySelectorAll('.benefits-section__benefits')
                    console.log(benefits)

                    benefits.forEach(benefit => {
                            benefit.classList.add('in')
                    })
                }

                element.classList.add('in')
                element.classList.add('alreadyAnimated')

            }
        }
    })

}

window.addEventListener('scroll', showOrHideOnScroll)