//Arrays
let stock = [];
let fullProducts = [];
let cart = [];


let loadProducts = () => {
    fetch('./data.json')
    .then((res) => res.json())
    .then((json) => {
        fullProducts = json;
        stock = fullProducts;
        renderProducts();
        SearchProducts();
})
    .catch((e) => {
        console.log(e);
    });
}


// LocalStorage
window.onload = function(){
    loadProducts();
    const storage = JSON.parse(localStorage.getItem('cart'));
    storage && cartEject();
    
    function cartEject() {
        cart = storage;
        renderCart();
    }
}

let addTotal = () => {
    localStorage.setItem('total', JSON.stringify(total));
}

function addLocalStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}


// Index:
// Navbar responsive:
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
};

// Muestro productos en index:
let renderProducts = () => {
    let html = '';

    const uploadProducts = (stock) => {
        for(const product of stock){
            let {id, model, colour, price, img} = product;
            html = html + `
                <div class="box">
                    <img src="${img}" alt="">
                    <p>${id}</p>
                    <h3>${model} ${colour}</h3>
                    <div class="price">$${price}</div>
                    <a href="#" class="btn" onclick='addToCart(${id});'>Agregar al carrito</a>
                </div>`
        document.getElementById('products').innerHTML = html;
        }    
    }
    uploadProducts(stock);
}

// Carrito
let shoppingCart = document.querySelector('.shopping-cart');

document.querySelector('#cart-btn').onclick = () =>{
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    navbar.classList.remove('active');
}


let addToCart = (id) => {
    const foundProduct = stock.find((item) => item.id == id);
    const index = cart.findIndex(e => e?.productsInCart?.id == id);
    if (index != -1){
      cart[index].quantity += 1;
    }
    else {
        const element = {productsInCart: foundProduct, quantity : 1}
        cart.push(element);
    }
    renderCart();

    Toastify({
        text: "Agregado al carrito",
        duration: 2000,
        offset: {
            x: 30,
            y: 70,
        },
        style: {
            background: '#000000',
            color: '#ffff',
        },
    }).showToast();
}


let renderCart = () => {
    cart.length == 0 ? noAddedProducts() : addedProducts();
  
    function noAddedProducts() {
        document.getElementById('cart').innerHTML = 
        `<h3 class="title-cart">No tenés productos agregados</h3>`;
    }
  
    function addedProducts() {
        let html = '';

        for (let i = 0; i < cart.length; i++){
        html = html + `
        <div class="box">
            <i class="fas fa-trash" onclick='removeFromCart(${cart[i].productsInCart.id});'></i>
            <img src="${cart[i].productsInCart.img}" alt="">
            <div class="content">
                <h3>${cart[i].productsInCart.model} ${cart[i].productsInCart.colour}</h3>
                <p>${cart[i].productsInCart.id}</p>
                <span class="price">$${cart[i].productsInCart.price}</span>
                <span class="quantity">Cant: ${cart[i].quantity}</span>
            </div>
        </div> `
        ;
        document.getElementById('cart').innerHTML = html;
        }
        
        total = cart.reduce((acc, e) => acc += e.productsInCart.price * e.quantity, 0);
        document.getElementById('cart').innerHTML = html += `
        <div class="total">Total : $${total.toFixed(3)} </div>
        <a href="#" onclick="checkout();" class="btn">Checkout</a> `
        
        addLocalStorage();
        addTotal();
    }
}


let checkout = () => {
    swal({
        title: "Desea finalizar su compra?",
        text: "Será dirigido al pago",
        buttons: true,
        dangerMode: false,
      })
      .then((willDelete) => {
        if (willDelete) {
            location.href='./pages/form.html';
            localStorage.removeItem('cart');
        } else {
          swal("Puede seguir agregando productos al carrito");
        }
      });
}


let removeFromCart = (id) => {
    const index = cart.findIndex(e => e.productsInCart.id === id);
    if (index != -1){
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1
        }
        else {
            cart.splice(index,1);
        }
    }
    renderCart();

    Toastify({
        text: "Se elimino correctamente",
        duration: 1000,
        offset: {
            x: 30,
            y: 70,
        },
        style: {
            background: '#000000',
            color: '#ffff',
        },
    }).showToast();
}


//Filtrado y Spread
let setCategoryFilter = (category) => {
    stock = [...fullProducts];
    if(category == 'smartphone' || category == 'auriculares' || category == 'cargadores' || category == 'smartwatch'){
        stock = stock.filter((item) => item.category == category);
    }
    renderProducts();
}


let SearchProducts = () => {
    let products = stock;
    const searchBox = document.querySelector('#search-box');
    const results = document.querySelector('#products');

    const filter = () => {
        results.innerHTML = '';
        const text = searchBox.value.toLowerCase();

        for(const product of products){

            let detailsOfProducts = (product.model.toLowerCase() + product.category.toLowerCase() + product.colour.toLowerCase());

            if(detailsOfProducts.indexOf(text) !== -1){
                results.innerHTML += `
                <div class="box">
                    <img src="${product.img}" alt="">
                    <p>${product.id}</p>
                    <h3>${product.model} ${product.colour}</h3>
                    <div class="price">$${product.price}</div>
                    <a href="#" class="btn" onclick='addToCart(${product.id});'>Agregar al carrito</a>
                </div>
                `
            }
        }
        if(results.innerHTML === ''){
            results.innerHTML += `
            <div class="box">
                    <p>Producto no encontrado...</p>
                </div>
                `
        }
    }
    searchBox.addEventListener('keyup', filter);
    filter();
}


//formulario de busqueda:
let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
}