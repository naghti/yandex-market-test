const products = document.querySelectorAll(".product");
const cart = document.querySelector(".cart");
const cartBox = document.querySelector(".cart__box");

products.forEach((product) => {
  function productOnDown(e) {
    e.preventDefault();

    const clone = product.cloneNode(true);
    clone.classList.add('product-clone');
    document.body.appendChild(clone);

    const productRect = product.getBoundingClientRect();
    const offsetX = e.clientX - productRect.left;
    const offsetY = e.clientY - productRect.top;

    function onMove(e) {
      let left = e.clientX - offsetX;
      let top = e.clientY - offsetY;

      left = Math.min(window.innerWidth - clone.offsetWidth - 10, Math.max(10, left));
      top = Math.min(window.innerHeight - clone.offsetHeight - 10, Math.max(10, top));

      clone.style.left = left + 'px';
      clone.style.top = top + 'px';
    }

    function onUp(e) {
      document.removeEventListener('mousemove', onMove);
      document.body.removeChild(clone);

      if (isOverCart(e.clientX, e.clientY)) {
        appendToCart(clone)
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  product.addEventListener("mousedown", productOnDown);
});

function isOverCart(x, y) {
  const cartRect = cart.getBoundingClientRect();
  return (x >= cartRect.left && x <= cartRect.right &&
          y >= cartRect.top && y <= cartRect.bottom);
}

function appendToCart (clone) {
  cartBox.appendChild(clone); 
  clone.classList.remove('product-clone');

  clone.style.position = 'absolute';
  const cartRect = cartBox.getBoundingClientRect();
  const X = Math.random() * (cartRect.width - clone.offsetWidth);
  const Y = cartRect.height - clone.offsetHeight;

  clone.style.left = X + 'px';
  clone.style.top = Y + 'px';
}