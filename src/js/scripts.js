const cards = document.querySelectorAll('.content__text--speaking li');

cards.forEach((card) => {
  let down, up, link = card.querySelector('a');
  if (link) {
    card.style.cursor = 'pointer';
    card.onmousedown = () => down = +new Date();
    card.onmouseup = () => {
      up = +new Date();
      if ((up - down) < 200) {
        link.click();
      }
    }
  }
});
