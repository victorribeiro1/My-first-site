const swiper = new Swiper('.swiper-container', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 10,
  coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 0,
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