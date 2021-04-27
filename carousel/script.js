const container = document.querySelector('.container')
const items = document.getElementById('items')


// function slide(e) {
//     if (e.deltaY > 0) {
//         return items.scrollBy(300, 0)
//     }
//     else {
//         return items.scrollBy(-300, 0)
//     }
// }

container.addEventListener('wheel', (e) => slide(e))

let lastScrollTop = 0

function slide() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        items.scrollBy(300, 0)
    } else {
        items.scrollBy(-300, 0)
    }

    lastScrollTop = scrollTop
}