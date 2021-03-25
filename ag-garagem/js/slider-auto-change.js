const btn1 = document.getElementById('btn1')

btn1.style.backgroundColor = '#FA5C5C'

setTimeout(() => {
    btn1.style.backgroundColor = 'transparent'
}, 9000)

let counter = 1

setInterval(() => {

    document.getElementById('radio' + counter).checked = true
    counter++

    if (counter > 3) {
        counter = 1
    }
}, 9000)