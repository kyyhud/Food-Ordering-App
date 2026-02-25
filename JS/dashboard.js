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
let checkoutSelection = document.getElementById("checkoutSelection");   
foodSelection.style.display = "grid";
cartSelection.style.display = "none";


function showFoodSelection(){
    foodSelection.style.display = "grid";
    cartSelection.style.display = "none";
    checkoutSelection.style.display = "none";
}
function showCartSelection(){
    foodSelection.style.display = "none";
    cartSelection.style.display = "grid";
    checkoutSelection.style.display = "none";
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
        card.className = "bg-red-300 pt-2 pl-4 m-3 rounded-lg shadow-md max-w-64";
        card.innerHTML = `
            <h3 class="text-lg font-semibold">${meal.strMeal}</h3>
            <h3 class="text-sm text-gray-600 pb-1">Price $${price}.00</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="pr-4 pb-2 max-h-64"/>
            <input type="button" value="Add to Cart" onclick="addToCart(${id},'${meal.strMeal}',${price})"
            class="bg-red-500 hover:bg-red-800 text-white font-semibold py-2 px-4 ml-1 mb-2 rounded cursor-pointer"/>
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
            <div class="bg-gray-100 rounded-lg shadow p-4 mb-4 mt-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
            <h4 class="text-xl font-semibold ml-1">${item.mealName}</h4>
            <p class="text-sm text-gray-600 ml-2">$${item.price}.00</p>
            <p class="text-md ml-1"> Quantity: ${item.quantity}</p>
            <input type="button" value="+" onclick="changeQuantity(${item.id}, 1)"
            class="bg-red-500 hover:bg-red-800 text-white font-bold py-1 px-3 ml-2 rounded cursor-pointer"/>
            <input type="button" value="-" onclick="changeQuantity(${item.id}, -1)"
            class="bg-red-500 hover:bg-red-800 text-white font-bold py-1 px-3 rounded cursor-pointer"/>
            </div>
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

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty. Please add items to your cart before Checkout");
        return false;
    } else {
        
        if (!checkoutSelection) {
            checkoutSelection = document.createElement("div");
            checkoutSelection.id = "checkoutSelection";
            document.body.appendChild(checkoutSelection);
        }

        // Hide food and cart sections, show checkout
        document.getElementById("foodSelection").style.display = "none";
        document.getElementById("cartSelection").style.display = "none";
        checkoutSelection.style.display = "grid";

        // Build order summary rows
        let orderSummaryHTML = "";
        cart.forEach(item => {
            orderSummaryHTML += `
                <div class="flex justify-between text-sm text-gray-700">
                    <span>${item.mealName} x${item.quantity}</span>
                    <span>$${item.price * item.quantity}.00</span>
                </div>`;
        });

        // Checkout screen
        checkoutSelection.innerHTML = `
            <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">

                    <!-- Header -->
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Checkout</h2>
                        <button onclick="cancelCheckout()"
                            class="text-sm text-red-500 hover:text-red-800 font-medium cursor-pointer">
                            ← Back to Cart
                        </button>
                    </div>

                    <!-- Order Summary -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 class="text-md font-semibold text-gray-700 mb-3">Order Summary</h3>
                        ${orderSummaryHTML}
                        <div class="border-t border-gray-300 mt-3 pt-3 flex justify-between font-bold text-gray-800">
                            <span>Total</span>
                            <span>$${cart.reduce((total, item) => total + item.price * item.quantity, 0)}.00</span>
                        </div>
                    </div>

                    <!-- Checkout Form -->
                    <form onsubmit="submitOrder(event)">

                        <!-- Contact Info -->
                        <h3 class="text-md font-semibold text-gray-700 mb-3">Contact Information</h3>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">First Name</label>
                                <input type="text" placeholder="John" required
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            </div>
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">Last Name</label>
                                <input type="text" placeholder="Doe" required
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm text-gray-600 mb-1">Email</label>
                            <input type="email" placeholder="john@example.com" required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        </div>

                        <!-- Payment Info -->
                        <h3 class="text-md font-semibold text-gray-700 mb-3">Payment Information</h3>
                        <div class="mb-4">
                            <label class="block text-sm text-gray-600 mb-1">Card Number</label>
                            <input type="text" placeholder="...for testing purposes only..." maxlength="19" required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        </div>
                        <div class="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">Expiry Date</label>
                                <input type="text" placeholder="MM/YY" maxlength="5" required
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            </div>
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">Billing Zipcode</label>
                                <input type="text" placeholder="63123" maxlength="5" required
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            </div>
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">CVV</label>
                                <input type="text" placeholder="123" maxlength="3" required
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            </div>
                        </div>

                        <!-- Submit -->
                        <button type="submit"
                            class="w-full bg-red-500 hover:bg-red-800 text-white font-bold py-3 rounded-lg cursor-pointer transition duration-200">
                            Place Order
                        </button>
                    </form>
                </div>
            </div>`;
    }
}

function submitOrder(event) {
    event.preventDefault();
    alert("Order Complete! Thank you for your Order!");
    cart = [];
    document.getElementById("cartCount").innerHTML = `${cart.length}`;
    updateCart();
    displayCartTotal();
    // Hide checkout, return to food selection
    document.getElementById("checkoutSelection").style.display = "none";
    document.getElementById("foodSelection").style.display = "grid";
}

function cancelCheckout() {
    document.getElementById("checkoutSelection").style.display = "none";
    document.getElementById("cartSelection").style.display = "grid";
}

// Calculate & display the total price of items in the cart
function displayCartTotal() {
    let total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.getElementById("cartTotal").innerHTML = `Order Total: <p class="text-green-500">$${total}.00</p>`;
}