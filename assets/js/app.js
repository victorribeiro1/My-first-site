gsap.registerPlugin(ScrollTrigger);

gsap.to(".about__img", {
    y: -200,
    duration: 9,
    scrollTrigger: {
        trigger: ".about__text-area",
        start: "top 50%",
        // end: "bottom 50%",
        toggleActions: "play reverse play resume",
        // markers: "true",
        toggleClass: "red",
        scrub: true
    } 
})

gsap.to(".about__text-box", {
    y: 100,
    duration: 9,
    scrollTrigger: {
        trigger: ".about__text-area",
        start: "top 50%",
        // end: "bottom 50%",
        toggleActions: "play reverse play resume",
        // markers: "true",
        toggleClass: "red",
        scrub: true
    } 
})

gsap.to(".header", {
    borderRadius: 10,
    scaleX: .97,
    duration: 2,
    scrollTrigger: {
        trigger: ".header",
        start: "bottom 100%",
        end: "bottom 20%",
        toggleActions: "play play play resume",
        scrub: true
    } 
})