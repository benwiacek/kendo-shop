import inventoryArray from "./inventoryArray.js"

/* RENDER INVENTORY */

function getCatalogFeedHtml(arr) {
    return arr.map(item => {
        const { 
            name,
            materials,
            id,
            price,
            image
        } = item
        return `
            <div id="${id}" class="item">
                <img class="item-img" src="${image}" alt="${name}-img">
                <div class="item-details">
                    <h3 class="item-name">${name}</h3>
                    <p class="item-materials">${materials.join(", ")}</p>
                    <p class="item-price">$${price.toFixed(2)}</p>
                </div>
                <button data-add="${id}" class="add-btn">+</button>
            </div>`
    }).join("")
}

document.getElementById("catalog").innerHTML = getCatalogFeedHtml(inventoryArray)

/* ADD ITEM TO CART  */

document.addEventListener("click", function(e) {
    if (e.target.dataset.add){
        addItemCart(e.target.dataset.add)
    }
})

const cart = document.getElementById("cart")
let cartItems = []

function addItemCart(itemId) {
    const targetItem = inventoryArray.filter(item => item.id === itemId)[0]
    cart.style.display = "flex"

    if (!cartItems.some(obj => obj.id === itemId)) {
        cartItems.push(targetItem)
        targetItem.quantity = 1

    } else {
        targetItem.quantity++
    }

    renderCart()
}

/* RENDER CART */

function renderCart() {

    const orderFeed = cartItems.map(targetItem =>`
        <div class="item-cart">
            <span class="item-cart-name">${targetItem.name}</span>
            <button class="remove-btn" data-remove="${targetItem.id}">remove</button>
            <span class="item-cart-quantity">x ${targetItem.quantity}</span>
            <span class="item-cart-total-price">$${(targetItem.price * targetItem.quantity).toFixed(2)}</span>
        </div>`
    ).join("")

    const totalPrice = cartItems.reduce((total, currentItem) => total + (currentItem.price * currentItem.quantity),0)
    document.getElementById("order").innerHTML = orderFeed
    document.getElementById("amount").innerHTML = `$${totalPrice.toFixed(2)}`
}

/* REMOVE ITEM FROM CART */

document.addEventListener("click", function (e) {
    if (e.target.dataset.remove) {
        removeItem(e.target.dataset.remove)
    }
})

function removeItem(itemId) {
    const targetItem = cartItems.filter(item => item.id === itemId)[0]
    let index = cartItems.indexOf(targetItem)

    if(index > -1) {
        cartItems.splice(index, 1)
    }

    if(cartItems.length === 0) {
        cart.style.display = "none";
    }
    else {
        renderCart()
    }
}