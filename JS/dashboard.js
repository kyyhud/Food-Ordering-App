let user = localStorage.getItem("email")
if (!user){
    window.location.href = "login.html";    //open Login page
}
document.getElementById("userEmail").innerHTML= user;    //display email id on dashboard page

function logout(){
    localStorage.removeItem("email");
    window.location.href = "login.html";    //open Login page
}

//open with food section > show/hide cart/food section
let foodSelection = document.getElementById("foodSelection");
let cartSelection = document.getElementById("cartSelection");   
foodSelection.style.display = "grid";
cartSelection.style.display = "none";

function showFoodSelection(){
    foodSelection.style.display = "grid";
    cartSelection.style.display = "none";
}
function showCartSelection(){
    foodSelection.style.display = "none";
    cartSelection.style.display = "grid";
}


let FOOD_URL ="https://www.themealdb.com/api/json/v1/1/search.php?s=c";
fetch(FOOD_URL).then(response=>response.json())
    .then(data=>{ 
        //console.log(data.meals)
        displayFood(data.meals)
    })  
    .catch(error=> {
        console.log(error)
})

function displayFood(meals){
meals.forEach(meal=> {
    // let price = the total of the digits of idMeal
    let id = meal.idMeal;
    let price = id.split("").reduce((total, digit) => total + Number(digit), 0);                
    //below is menu items UI display
        const card = document.createElement('div');
        card.className = "bg-red-200 pt-2 pl-4 m-1 rounded-lg shadow-md";
        card.innerHTML = `
            <h3 class="text-lg font-semibold">${meal.strMeal}</h3>
            <h3 class="text-sm text-gray-600 pb-1">Price $${price}.00</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="pr-4 pb-2"/>
            <input type="button" value="Add to Cart" onclick="addToCart(${id},'${meal.strMeal}',${price})"
            id="button"/>
        `;
        foodSelection.appendChild(card);
    });
}

let cart = [];  //empty array to store cart items

function addToCart(id,mealName,price){
    let item = cart.find(c=>c.id === id);   //check if item already exists in cart, if so increase quantity by 1
        if (item) {
            item.quantity += 1;
        } else {
            cart.push({ id, mealName, price, quantity: 1 });
        }
        updateCart();
    }

function updateCart(){
    let cartItem = document.getElementById("cartItem");
    cartItem.innerHTML = "";    //clear previous cart items before changeQuantity to updateCart
        cart.forEach(item => {
            cartItem.innerHTML += `
            <div>
            <h4>${item.mealName}</h4>
            <p>$${item.price}.00</p>
            <p>Quantity: ${item.quantity}</p>
            <input type="button" value="+" id="button" onclick="changeQuantity(${item.id}, 1)"/>
            <input type="button" value="-" id="button" onclick="changeQuantity(${item.id}, -1)"/>
            </div>`;
        });
        document.getElementById("cartCount").innerHTML = `${cart.reduce((total, item) => total + item.quantity, 0)}`;   // display cart item count in dashboard page
        displayCartTotal();
}
//change quantity of cart items
function changeQuantity(id,change){
    cart = cart.map(item=> {
        if(item.id === id){
            item.quantity += change;
        }
        return item;
    }).filter(item=> item.quantity > 0);
    updateCart();
}

function checkout(){
    if(cart.length === 0){
        alert("Cart is empty. Please add items to your cart before Checkout");
        return false;
    }else {
        alert("Order Complete! Thank you for your Order!");
        cart = [];  //clear cart after successful checkout
        document.getElementById("cartCount").innerHTML = `Cart Items: ${cart.length}`;  //update cart item count on dashboard page
        updateCart();   //update cart section on dashboard page after checkout
            displayCartTotal();
        }
}

// Calculate & display the total price of items in the cart
function displayCartTotal() {
    let total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.getElementById("cartTotal").innerHTML = `Total: $${total}.00`;
}