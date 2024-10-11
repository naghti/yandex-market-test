const products = document.querySelectorAll(".product");
const cart = document.querySelector(".cart");
const cartBox = document.querySelector(".cart__box");
const list = new Set()

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
    
    if (isOverCart(e.clientX, e.clientY)) {
      appendToCart(clone);
    }
    else {
      document.body.removeChild(clone);
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
  
  setVisible(false, e.target)
  appendToCart(clone)
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
  // на пк это будет если в зоне то скрыто добавлять еще один элеменмт
  // в коляску, подовдить видимый элемент к невидимому и потом удалять
  // видимый и делать видимым невидимый
  // на телефонах будет брать элемент который кликался и делать тоже самое
  if (list.has(clone.id)) return;
  else list.add(clone.id)

  const cartRect = cartBox.getBoundingClientRect();
  const x = cartRect.x + Math.random() * (cartRect.width - clone.offsetWidth)
  const y = cartRect.y + cartRect.height - clone.offsetHeight

  const x2 = x - cartRect.x
  const y2 = cartRect.height - clone.offsetHeight

  
  const cloneInCart = createClone(clone)
  cloneInCart.classList.remove("product-clone")
  setVisible(false, cloneInCart)
  cloneInCart.style.position = 'absolute'
  cloneInCart.style.left = x2 + "px"
  cloneInCart.style.top = y2 + "px"

  moveToCart(x, y, clone)
  cartBox.appendChild(cloneInCart)
  
  setTimeout(() => {    
    setVisible(true, cloneInCart)
    document.body.removeChild(clone)
  }, 500)
}

function setVisible (visible, product) {
  product.style.visibility = visible ? "visible" : "hidden";
}