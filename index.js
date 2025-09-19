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
                    <p class="item-price">$${price}</p>
                </div>
                <button data-add="${id}" class="add-btn">+</button>
            </div>`
    }).join("")
}

document.getElementById("catalog").innerHTML = getCatalogFeedHtml(inventoryArray)

/* RENDER CART  */

document.addEventListener("click", function(e) {
    if (e.target.dataset.add){
        addItemCart(e.target.dataset.add)
    }
})

let cartItems = []

function addItemCart(itemId) {
    const targetItem = inventoryArray.filter(item => item.id === itemId)[0]
    const cart = document.getElementById("cart")
    cart.style.display = "block"

    if (!cartItems.some(obj => obj.id === itemId)) {
        cartItems.push(targetItem)
        targetItem.quantity = 1

    } else {
        targetItem.quantity++
    }

    const totalPrice = cartItems.reduce((total, currentItem) => total + (currentItem.price * currentItem.quantity),0)
    console.log(totalPrice)


    const orderFeed = cartItems.map(targetItem =>`
        <div>
            <span class="item-cart">${targetItem.name}</span>
            <span class="remove">remove</span>
            <span class="item-cart-quantity">x ${targetItem.quantity}</span>
            <span class="item-cart-total-price">$${targetItem.price * targetItem.quantity}</span>
        </div>`
    ).join("")

    document.getElementById("order").innerHTML = orderFeed

    document.getElementById("amount").innerHTML = totalPrice

}