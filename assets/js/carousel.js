document.querySelector('.carousel__items')
.addEventListener('wheel', (e) => slide(e))

function slide(e) {
    console.log('scrolled')
    if (e.deltaY > 0) {
        return e.target.scrollBy(300, 0)
    }
    else {
        return e.target.scrollBy(-300, 0)
    }
}