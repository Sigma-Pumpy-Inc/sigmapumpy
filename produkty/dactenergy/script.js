window.cart = JSON.parse(localStorage.getItem("cart")) || [];

// Přidání do košíku
window.addToCart = function(item) {
    let existingItem = window.cart.find(product => product.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity || 1; // Zvýší množství, pokud není uvedeno, přičte 1
    } else {
        item.quantity = item.quantity || 1; // Nastaví výchozí množství na 1
        window.cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(window.cart)); // Uložíme do localStorage
    console.log("Produkt přidán:", item);
    window.location.href = "/kosik/index.html"; // Přesměrování do košíku
};
