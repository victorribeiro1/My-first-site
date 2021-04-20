const slider = document.getElementById('slider')

images = [
    image1 = "url('media/images/black-car-4-d.jpg')",
    image2 = "url('media/images/black-car-2-d.jpg')",
    image3 = "url('media/images/white-car-1-d.jpg')",
]


counter = 0
setInterval(() => {
    slider.style.backgroundImage = images[counter]
    counter == 2 ? counter = 0 : counter++
}, 5000)

// setTimeout(() => {
//     image = "url('../../media/images/black-car-4-d.jpg')"
// }, 2000)