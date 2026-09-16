const carouselContainers = document.querySelectorAll('.carousel-container');

carouselContainers.forEach(container => {
  const track = container.querySelector('.carousel-track');
  const items = container.querySelectorAll('.shadow');
  const prevButton = container.querySelector('.prev');
  const nextButton = container.querySelector('.next');

  let position = 0;

  function updateButtons() {
    const maxScroll = track.scrollWidth - container.offsetWidth;

    prevButton.disabled = position <= 0;
    nextButton.disabled = position >= maxScroll - 5; // small buffer for rounding errors
  }

  nextButton.addEventListener('click', () => {
    const itemWidth = items[0].offsetWidth + 15;
    position += itemWidth;
    track.style.transform = `translateX(-${position}px)`;
    updateButtons();
  });

  prevButton.addEventListener('click', () => {
    const itemWidth = items[0].offsetWidth + 15;
    position -= itemWidth;
    if (position < 0) position = 0;
    track.style.transform = `translateX(-${position}px)`;
    updateButtons();
  });

  window.addEventListener('resize', updateButtons);

  updateButtons();
});

  

