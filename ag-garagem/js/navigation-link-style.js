const links = document.querySelectorAll('.navigation__link')
links.forEach(
    link => {
        link.addEventListener('mouseenter', (event) => {
            if (event.target.classList.contains('navigation__number')) {
            } else {
                event.target.style.border = '2px solid white';
                console.log('in')
            }
        })
        
        link.addEventListener('mouseout', (event) => {
            if (event.target.classList.contains('navigation__number')) {
            } else {
                console.log('out')
                event.target.style.border = '2px solid white';
                setTimeout(() => {
                    event.target.style.border = '2px solid transparent';
                }, 800)
            }
        })
    })