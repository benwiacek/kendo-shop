import inventoryArray from "./inventoryArray.js"

const cart = document.getElementById("cart")
let cartItems = []
const discountDiv = document.getElementById("discount")
let subTotal = 0
let discount = 0
let totalPrice = 0
const modal = document.getElementById("modal")
const paymentForm = document.getElementById("payment-form")
const confirmationMsg = document.getElementById("confirmation-msg")

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
                <div class="quantities">
                    <button id="reduce-${id}" data-reduce="${id}" class="reduce-btn">-</button>
                    <span id="${id}-quantity" class="item-quantity">1</span>
                    <button data-add="${id}" class="add-btn">+</button>
                </div>
            </div>`
    }).join("")
}

document.getElementById("catalog").innerHTML = getCatalogFeedHtml(inventoryArray)

/* RENDER CART */

function renderCart() {
    if(cartItems.length > 0) {
        cart.style.display = "flex"
        const orderFeed = cartItems.map(targetItem =>`
            <div class="item-cart">
                <span class="item-cart-name">${targetItem.name}</span>
                <button class="remove-btn" data-remove="${targetItem.id}">remove</button>
                <span class="item-cart-quantity">x ${targetItem.quantity}</span>
                <span class="item-cart-total-price">$${(targetItem.price * targetItem.quantity).toFixed(2)}</span>
            </div>`
        ).join("")
    document.getElementById("order").innerHTML = orderFeed
    subTotal = cartItems.reduce((total, currentItem) => total + (currentItem.price * currentItem.quantity),0)
    addDiscount()
    getTotalPrice()
    } else {
        cart.style.display = "none"
    }
}

/* ADD ITEM TO CART  */

document.addEventListener("click", function(e) {
    if (e.target.dataset.add){
        addItemCart(e.target.dataset.add)
    }
})

function addItemCart(itemId) {
    const targetItem = inventoryArray.filter(item => item.id === itemId)[0]
    const itemQuantity = document.getElementById(`${itemId}-quantity`)
    const reduceBtn = document.getElementById(`reduce-${itemId}`)

    if (!cartItems.some(obj => obj.id === itemId)) {
        cartItems.push(targetItem)
        itemQuantity.style.display = "block"
        reduceBtn.style.display = "block"       
    }

    targetItem.quantity++
    itemQuantity.innerHTML = targetItem.quantity
    renderCart()
}

/* DECREASE ITEM QUANTITY */

document.addEventListener("click", function(e) {
    if (e.target.dataset.reduce) {
        reduceItemCart(e.target.dataset.reduce)
    }
})

function reduceItemCart(itemId) {
    const targetItem = inventoryArray.filter(item => item.id === itemId)[0]
    const itemQuantity = document.getElementById(`${itemId}-quantity`)
    const reduceBtn = document.getElementById(`reduce-${itemId}`)
    
    targetItem.quantity--

    if (targetItem.quantity === 0) {
        reduceBtn.style.display = "none"
        itemQuantity.style.display = "none"
        let index = cartItems.indexOf(targetItem)
            if(index > -1) {
                cartItems.splice(index, 1)
            }
    } else {
        itemQuantity.innerHTML = targetItem.quantity
    }
    renderCart ()
}

/* ADD DISCOUNT */

function addDiscount() {

    if(cartItems.length === 4) {
        discount = subTotal*0.15
        discountDiv.style.display = "block"
        document.getElementById("sub-total").innerHTML = `$${subTotal.toFixed(2)}`
        document.getElementById("discount-amount").innerHTML = `- $${discount.toFixed(2)}`
    } else {
        discountDiv.style.display = "none"
        discount = 0
    }
}

/* GET TOTAL PRICE */

function getTotalPrice() {
    totalPrice = subTotal - discount
    document.getElementById("price").innerHTML = `$${totalPrice.toFixed(2)}`
}

/* REMOVE ITEM FROM CART */

document.addEventListener("click", function (e) {
    if (e.target.dataset.remove) {
        removeItem(e.target.dataset.remove)
    }
})

function removeItem(itemId) {
    const targetItem = cartItems.filter(item => item.id === itemId)[0]
    const itemQuantity = document.getElementById(`${itemId}-quantity`)
    const reduceBtn = document.getElementById(`reduce-${itemId}`)
    let index = cartItems.indexOf(targetItem)

    if(index > -1) {
        targetItem.quantity = 0
        cartItems.splice(index, 1)
        itemQuantity.style.display = "none"
        reduceBtn.style.display = "none"      
    }

    if(cartItems.length === 0) {
        cart.style.display = "none";
    }
    else {
        renderCart()
    }
}

/* COMPLETE ORDER MODAL*/


document.getElementById("complete-btn").addEventListener("click", () => modal.style.display = "block")

document.getElementById("modal-close-btn").addEventListener("click", () => modal.style.display = "none")

/* CONFIRMATION */

paymentForm.addEventListener("submit", function(e) {
    e.preventDefault()
    confirmation()
})

function confirmation() {
    modal.style.display = "none"
    cart.style.display = "none"
    confirmationMsg.style.display = "block"

    const paymentFormData = new FormData(paymentForm)
    const name = paymentFormData.get("cardholder-name")

    let confirmation = 
        `<div class="message">
            <p class="msg-title">Thank you ${name}!</p>
            <p class="msg-text">Your order of $${totalPrice} is on the way.<br/>
            You can expect delivery in 66 years!</p>
        </div>
        <div class="rating">
            <p class="rating-title">Rate your experience with us:</p>
            <div class="stars" id="star-list">
                <i class="fa-regular fa-star fa-xl" data-rating="1"></i>
                <i class="fa-regular fa-star fa-xl" data-rating="2"></i>
                <i class="fa-regular fa-star fa-xl" data-rating="3"></i>
                <i class="fa-regular fa-star fa-xl" data-rating="4"></i>
                <i class="fa-regular fa-star fa-xl" data-rating="5"></i>
            </div>
            <p class="comment" id="comment"></p>
        </div>`
    
    confirmationMsg.innerHTML = confirmation

    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
        button.disabled = true;
    }
    
    setupRating()
}

/* RATING FEATURE */

function setupRating() {

    const starList = document.getElementById("star-list")
    let selectedRating = 0

    const ratingComments = [
        "That's no moon... that's a terrible review! Prepare for Order 66! 😱",
        "Your review skills are as weak as your suburi form. More training you need! 🥱",
        "Adequate your review may be, but room for improvement you have! 😒",
        "The Force is strong with this one! Almost Jedi-level satisfaction! 😌",
        "You're our only hope! Thanks for bringing balance to our reviews! ⭐"
    ]

    function yellowStar(rating) { 
        const stars = starList.querySelectorAll(".fa-star")

        stars.forEach((star, index) => {
            star.classList.toggle('fa-solid', index < rating)
            star.classList.toggle('fa-regular', index >= rating)
        })

    }

    starList.addEventListener("mouseover", e => {
        if(e.target.classList.contains("fa-star")) {
            const rating = parseInt(e.target.dataset.rating)
            yellowStar(rating)
        }
    })

    starList.addEventListener("mouseleave", () => yellowStar(selectedRating))

    starList.addEventListener("click", e => {
        if(e.target.classList.contains("fa-star")) {
            const clickedRating = parseInt(e.target.dataset.rating)

            if(clickedRating !== selectedRating) {
                selectedRating = clickedRating
                yellowStar(selectedRating)
                const ratingMessage = ratingComments[selectedRating-1]
                document.getElementById("comment").textContent = ratingMessage
            } else {
                selectedRating = 0
                yellowStar(selectedRating)
                document.getElementById("comment").textContent = ""
            }
        }     
    })
}