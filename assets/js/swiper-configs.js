var swiper = new Swiper('.swiper-container', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 20,
    stretch: 0,
    depth: 150,
    modifier: 1,
    slideShadows: true,
    freeMode: true,
  },
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
});