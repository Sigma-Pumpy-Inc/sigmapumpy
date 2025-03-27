// Inicializace košíku (localStorage pro uchování mezi stránkami)
window.cart = JSON.parse(localStorage.getItem("cart")) || [];

// Přidání do košíku
window.addToCart = function(item) {
    window.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(window.cart)); // Uložíme do localStorage
    console.log("Produkt přidán:", item);
    window.location.href = "/kosik/index.html"; // Přesměrování do košíku
};