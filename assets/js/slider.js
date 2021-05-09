const slider = document.querySelector('.slider')

const imagesPosition = ['first', 'second', 'tertiary']

let imageIndex = 0
                        
function setNextIndex()  {
    imageIndex++
    imageIndex = imageIndex > imagesPosition.length - 1 ? imageIndex = 0 : imageIndex
}

function loadImage() {
    slider.setAttribute('data-slide', imagesPosition[imageIndex])
}

setInterval(() => {
    setNextIndex()
    loadImage()
}, 2800)