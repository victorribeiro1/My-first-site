const links = document.querySelectorAll('.link')
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.classList.remove('go-away')
    })
    link.addEventListener('mouseout', () => {
        link.classList.add('go-away')
    })
})

links.forEach(link => {
    const text = link.innerHTML

    let letters = text.split('')

    for (letter in letters) {
        if (letters[letter] == " ") {
            letters[letter] = `&nbsp;`
        } else {
            letters[letter] = `<span class="link__letter">${letters[letter]}</span>`
        }
    }

    const newText = letters.join('')

    link.innerHTML = newText
})