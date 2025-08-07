    let totalItems = 0;
    const cartCount = document.getElementById('cart-count');
    const cartItems = {}; 
    let checkOutButtonAdded = false;
    let orderTotal;

    fetch('data.json')
    .then(res => res.json())
    .then(data => {
    const mainContainer = document.getElementById('products-container');
    const itemsContainer = document.querySelector('.items');
    const empImage = document.querySelector('.empty-image');

    data.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product');
        card.innerHTML = `
        <div class="image">
            <img src="${product.image.desktop}" alt="">
            <div class="btn">
            <button class="add"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
            </div>
        </div>
        <h5 class="sm-word">${product.category}</h5>
        <h4 class="bg-word">${product.name}</h4>
        <span class="price">$${product.price.toFixed(2)}</span>
        `;
        mainContainer.appendChild(card);
        const button = card.querySelector('.add');
        const btnContainer = card.querySelector('.btn');

        button.onclick = () => {
            if(cartCount!=0){
                empImage.style.display = "none";
            }
            if (!cartItems[product.name]) {
            cartItems[product.name] = {
            quantity: 1,
            price: product.price
            };
            

            const img = button.parentElement.parentElement.querySelector('img');
            img.style.border = "3px solid hsl(14, 86%, 42%)";

            itemsContainer.insertAdjacentHTML("beforeend", `
            <div class="item-info" data-name="${product.name}">
                <div class="item-name">
                <span class="name">${product.name}</span>
                <span class="x-mark"><i class="fa-regular fa-circle-xmark"></i></span>
                </div>
                <div class="number-items">
                <span class="amount"><span class="nums">1</span>x </span>
                <span class="fact-price">@ $${product.price.toFixed(2)}</span>
                <span class="calc">$${product.price.toFixed(2)}</span>
                </div>
                <hr>
            </div>
            `);
            const itemsFooterTotal = document.querySelector('.items-total');
            const itemsFooterButton = document.querySelector('.items-btn');

            const checkOutButton = document.createElement('button');
            const carbon = document.createElement('div');
            
            if(!checkOutButtonAdded){
                orderTotal = document.createElement('div');
                checkOutButton.textContent = "Confirm Order";
                orderTotal.innerHTML = `Order Total  <span class="total-money">$${calculateOrderTotal().toFixed(2)} </span>`;
                carbon.innerHTML = `<span class="carbon-icon"><img src="./assets/images/icon-carbon-neutral.svg" alt=""></span> This is a <span class="carbon-neutral"> carbon-neutral </span> delivery`
                checkOutButton.classList.add("checkout-btn");
                orderTotal.classList.add("order-total");
                carbon.classList.add("carbon");
                itemsFooterButton.appendChild(checkOutButton);
                itemsFooterTotal.appendChild(orderTotal);
                itemsFooterTotal.appendChild(carbon);
                checkOutButtonAdded = true;    
            }
            checkOutButton.onclick = () => {
            Swal.fire({
            title: 'Order Placed!',
            text: 'Thank you for your purchase ❤️',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
            background: '#f0f9ff',
            color: '#333'
            }).then(() => {
            location.reload();
            });
        };


            const allItems = itemsContainer.querySelectorAll('.item-info');
            const lastItem = allItems[allItems.length - 1]; // آخر item-info اتضاف
            const xMark = lastItem.querySelector(".x-mark");

            xMark.onclick = () => {
                lastItem.remove(); // يمسح العنصر كله
                totalItems -= cartItems[product.name].quantity;
                cartCount.textContent = totalItems;
                delete cartItems[product.name];
                cartCount.textContent = totalItems;
            };

            btnContainer.innerHTML = `
            <div class="new-button">
                <span><i class="fa-solid fa-circle-minus decrease"></i></span>
                <span class="num">1</span>
                <span><i class="fa-solid fa-circle-plus increase"></i></span>
            </div>
            `;
            const decreaseBtn = btnContainer.querySelector(".decrease");
            const increaseBtn = btnContainer.querySelector(".increase");
            const quantityInput = btnContainer.querySelector(".num");

            decreaseBtn.onclick = () => {
            if (cartItems[product.name].quantity > 1) {
                cartItems[product.name].quantity -= 1;
                quantityInput.textContent = cartItems[product.name].quantity;
                updateCartItemDisplay(product.name);
                updateTotalItems(-1);
                orderTotal.innerHTML = `Order Total  <span class="total-money">$${calculateOrderTotal().toFixed(2)} </span>`;

            }
            };

            increaseBtn.onclick = () => {
            cartItems[product.name].quantity += 1;
            quantityInput.textContent = cartItems[product.name].quantity;
            updateCartItemDisplay(product.name);
            updateTotalItems(1);
            orderTotal.innerHTML = `Order Total  <span class="total-money">$${calculateOrderTotal().toFixed(2)} </span>`;

            };

        } else {
            // المنتج مضاف قبل كدا
            cartItems[product.name].quantity += 1;
            updateCartItemDisplay(product.name);
            const currentInput = btnContainer.querySelector('.num');
            if (currentInput) currentInput.textContent = cartItems[product.name].quantity;
            orderTotal.innerHTML = `Order Total  <span class="total-money">$${calculateOrderTotal().toFixed(2)} </span>`;

        }

        updateTotalItems(1);
        updateOrderTotalDisplay();
        };
    });

    function updateCartItemDisplay(name) {
        const itemDiv = document.querySelector(`.item-info[data-name="${name}"]`);
        if (itemDiv) {
        itemDiv.querySelector('.nums').textContent = cartItems[name].quantity;
        itemDiv.querySelector('.calc').textContent = `$${(cartItems[name].quantity * cartItems[name].price).toFixed(2)}`;
        }
    }

    function updateTotalItems(change) {
        totalItems += change;
        cartCount.textContent = totalItems;
    }

    function calculateOrderTotal() {
    let total = 0;
    for (const item in cartItems) {
        total += cartItems[item].price * cartItems[item].quantity;
    }
    return total;
    }

    function updateOrderTotalDisplay() {
        if (orderTotal) {
            orderTotal.innerHTML = `Order Total  <span class="total-money">$${calculateOrderTotal().toFixed(2)} </span>`;
        }
        }

    });

