let counter = 1

setInterval(() => {
    document.getElementById('radio' + counter).checked = true
    counter++

    if (counter > 3) {
        counter = 1
    }
}, 6000)