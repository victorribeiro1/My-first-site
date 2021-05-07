const swiper = new Swiper('.swiper-container', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 30,
  coverflowEffect: {
      rotate: 10,
      stretch: 0,
      depth: 30,
      modifier: 1,
      slideShadows: false,
      freeMode: true,
  },
  loop: true,
  autoplay: {
      delay: 2000,
      disableOnInteraction: false,
  },
  freeMode: true,
});