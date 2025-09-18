import inventoryArray from "./inventoryArray.js"

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
                <button class="add-btn">+</button>
            </div>`
    }).join("")
}

console.log(inventoryArray)

document.getElementById("catalog").innerHTML = getCatalogFeedHtml(inventoryArray)