var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 20,
      stretch: 00,
      depth: 0,
      modifier: 1,
      slideShadows: true,
    },
    loop: true
  });