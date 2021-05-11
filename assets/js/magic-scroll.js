const introElements = document.querySelectorAll('.fade')

function showOrHideOnScroll() {
    introElements.forEach(element => {
        const top = element.getBoundingClientRect().top
        const screenPosition = window.innerHeight

        if (top < screenPosition / 1.1) {
            if (element.classList.contains('alreadyAnimated')) {
                
            } else {
                
                
                if (element.classList.contains('performance__counter')) {
                    console.log('true')
                    if (element.classList.contains('alreadyAnimated')) {
                        console.log('has')
                    } else {
                        animateCounter()
                    }

                }
                element.classList.add('in')
                element.classList.add('alreadyAnimated')
            }
        }
    })
}
window.addEventListener('scroll', showOrHideOnScroll)