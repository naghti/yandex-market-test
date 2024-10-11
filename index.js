const products = document.querySelectorAll(".product");
const cart = document.querySelector(".cart");
const cartBox = document.querySelector(".cart__box");

function createClone(product) {
  const clone = product.cloneNode(true);
  clone.classList.add('product-clone');
  document.body.appendChild(clone);
  return clone;
}

function productOnDown(e) {
  e.preventDefault();
  
  const parrent = e.target; 
  const clone = createClone(e.target); 
  
  const productRect = e.target.getBoundingClientRect();
  const offsetX = e.clientX - productRect.left;
  const offsetY = e.clientY - productRect.top;
  
  setVisible(false, parrent)

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
      appendToCart(clone);
    }
    else {
      setVisible(true, parrent)
    }
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

function productTouch (e) {
  let left = e.target.getBoundingClientRect().left;
  let top = e.target.getBoundingClientRect().top;
 
  const clone = createClone(e.target); 
  
  clone.style.left = `${left}px`;
  clone.style.top = `${top}px`;  

  const cartRect = cartBox.getBoundingClientRect();

  const x = cartRect.x + Math.random() * (cartRect.width - clone.offsetWidth)
  const y = cartRect.y + cartRect.height - clone.offsetHeight

  console.log(cartBox.getBoundingClientRect())

  moveToCart(x, y, clone)
}

products.forEach((product) => {
  product.addEventListener("mousedown", productOnDown);
  product.addEventListener("touchstart", productTouch);
});


function moveToCart(x, y, target, duration = 500) {
  const initialX = target.offsetLeft;
  const initialY = target.offsetTop;

  const startTime = Date.now();

  function animate() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / duration, 1);   


    const newX = initialX + (x - initialX) * progress;
    const newY = initialY + (y - initialY) * progress;

    target.style.left = `${newX}px`;
    target.style.top = `${newY}px`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}


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

function setVisible (visible, product) {
  product.style.visibility = visible ? "visible" : "hidden";
}