const cartBtn = document.querySelector(".cart-btn");

// console.log(cartBtn);

const clearCartBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");

const productsDOM = document.querySelector("#products-dom");
// console.log(productsDOM);

// mackapi use to get data: https://mockapi.io/projects
// json formatter chrome extension kullanmis olacagiz

let cart = [];
let buttonsDom = [];


class Products{
    // Normally javascript works syncron but we want they set in orde 
    async getProducts(){
        try {
            // promise structure: One work is finish then start this, fetch
            let result = await fetch("https://64b59516f3dbab5a95c78086.mockapi.io/products");
            let data = await result.json();
            // console.log(data);
            let products = data;
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

class UI{
    displayProducts(products){
        // console.log(products);
        let result = "";
        products.forEach(item => {
            result += `
            <div class="col-lg-4 col-md-6" >
            <div class="product">
                <div class="product-image">
                    <img src="${item.image}" alt="product">
                </div>
                <div class="product-hover">
                    <span class="product-title">${item.title}</span>
                    <span class="product-price">$ ${item.price}</span>
                    <button class="btn-add-to-cart" data-id = ${item.id}>
                        <i class="fas fa-shopping-cart"></i> </button>
                </div>
            </div>
        </div>
            `; });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        // array results of buttons
        const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
        // node list results of buttons
        // const buttonsNodeList = document.querySelectorAll(".btn-add-to-cart");
        // console.log(buttons);
        buttonsDom = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            // console.log(id);
            let inCart= cart.find(item => item.id === id);
            if (inCart) {
                button.setAttribute("disabled", "disabled");
                button.style.opacity = ".3";
            } else {
                button.addEventListener("click", event => {
                    event.target.disabled = true;
                    event.target.style.opacity = ".3";
                    // * get product from products
                    let cartItem = {...Storage.getProduct(id), amount: 1};
                    // console.log(cartItem);
                    // * add product to the cart
                    cart = [...cart, cartItem];
                    // console.log(cart);
                    // * save cart in local storage
                    Storage.saveCart(cart);
                    // console.log(cart);
                    // * save cart values
                    this.saveCartValues(cart);
                    // * display cart item
                    this.addCartItem(cartItem);

                })
            }
        })

    }
    setCartValues(cart){
        let tempTotal   = 0;
        let itemsTotal  = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const li = document.createElement("li");
        li.classList.add("cart-list-item");
        li.innerHTML = ` 
        <div class="cart-left">
                <div class="cart-left-image">
                    <img src="${item.image}" alt="product" class="img-fluid" />
                </div>
                <div class="cart-left-info">
                    <a class="cart-left-info-title" href="#">${item.title}</a>
                    <span class="cart-left-info-price">$ ${item.price}</span>
                </div>
            </div>
            <div class="cart-right">
                <div class="cart-right-quantity">
                    <button class="quantity-minus" data-id=${item.id}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.amount}</span>
                    <button class="quantity-plus" data-id=${item.id}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-right-remove">
                    <button class="cart-remove-btn" data-id=${item.id}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartContent.appendChild(li);
    }
}

class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));

    }
    static getProduct(id){
        // * JSON parse to javascript
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify("cart"));

    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    // when it upload then this events works / yuklendiginde gerceklesecek olaylar
    const ui = new UI();
    const products = new Products();

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons()
    })
});


