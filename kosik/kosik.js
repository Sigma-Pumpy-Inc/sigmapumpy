import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase konfigurace
const firebaseConfig = {
    apiKey: "AIzaSyAbKrnMdiJ0dElO00V37qcrxp8zEg65csI",
    authDomain: "sigmapumpykosik.firebaseapp.com",
    projectId: "sigmapumpykosik",
    storageBucket: "sigmapumpykosik.firebasestorage.app",
    messagingSenderId: "250138471588",
    appId: "1:250138471588:web:81dd8aadf011990ee50a31",
    measurementId: "G-CSWR4DMBXF"
};

// Inicializace Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Načtení košíku z localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Uložení košíku do localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Přidání do košíku
window.addToCart = function(item) {
    let existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1,
            imageUrl: item.imageUrl || "img/12oz Can-2.png"
        });
    }
    saveCart();
    renderCart();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
};

window.updateQuantity = function(index, action) {
    if (cart[index]) {
        if (action === 'increase') {
            cart[index].quantity = (cart[index].quantity || 0) + 1;
        } else if (action === 'decrease' && cart[index].quantity > 1) {
            cart[index].quantity--;
        }
        saveCart();
        renderCart();
    }
};

// Zobrazení košíku
function renderCart() {
    const cartList = document.getElementById("cart");
    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = "<li>Košík je prázdný</li>";
    } else {
        cartList.innerHTML = "";
        cart.forEach((item, index) => {
            const quantity = item.quantity || 1;
            const li = document.createElement("li");
            li.classList.add("cart-item");

            li.innerHTML = `
                <img src="${item.imageUrl || "img/default.jpg"}" alt="${item.name}" class="cart-item-image" onerror="this.src='img/placeholder.jpg'">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-quantity">
                        <button onclick="updateQuantity(${index}, 'decrease')">-</button>
                        ${quantity} ks
                        <button onclick="updateQuantity(${index}, 'increase')">+</button>
                    </span>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">Odebrat</button>
                </div>
            `;
            cartList.appendChild(li);
        });
    }
}

// Po načtení stránky zobrazíme košík
window.onload = renderCart;

// Vlastní alert (modal) funkce
function showCustomAlert(message, redirectTo) {
    // Zkontroluj, jestli už modal existuje
    const existingModal = document.querySelector(".custom-alert");
    if (existingModal) {
        existingModal.remove(); // Pokud modal existuje, smaž ho před zobrazením nového
    }
    
    const modal = document.createElement("div");
    modal.classList.add("custom-alert");
    
    modal.innerHTML = `
        <div class="custom-alert-content">
            <p>${message}</p>
            <button id="okButton">OK</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Po kliknutí na OK přesměrovat
    document.getElementById("okButton").onclick = function() {
        modal.remove();
        if (redirectTo) {
            window.location.href = redirectTo;
        }
    };
}

// Odeslání objednávky do Firebase Firestore
window.submitOrder = async function() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    if (!name || !email || !address || cart.length === 0) {
        showCustomAlert("Vyplňte všechna pole nebo přidejte položky do košíku.");
        return;
    }

    // Získání vybrané platební metody
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        showCustomAlert("Vyberte platební metodu.");
        return;
    }

    // Získání vybrané doručovací metody
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
    if (!deliveryMethod) {
        showCustomAlert("Vyberte metodu doručení.");
        return;
    }

    // Uložení objednávky do Firestore
    try {
        await addDoc(collection(db, "orders"), {
            name,
            email,
            address,
            items: cart,
            paymentMethod: paymentMethod.value,  // Uloží vybranou platební metodu
            deliveryMethod: deliveryMethod.value,  // Uloží vybranou doručovací metodu
            timestamp: new Date()
        });

        // Po odeslání objednávky košík smažeme
        cart = [];
        saveCart();

        // Zobrazí custom alert s potvrzením odeslání objednávky
        showCustomAlert("Objednávka byla úspěšně odeslána!", "index.html");  // Po kliknutí na OK přesměruje na hlavní stránku
    } catch (error) {
        console.error("Error adding document: ", error);
        showCustomAlert("Chyba při odesílání objednávky. Zkuste to prosím znovu.");
    }
};
