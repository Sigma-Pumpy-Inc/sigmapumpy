// Inicializace košíku
window.cart = JSON.parse(localStorage.getItem("cart")) || [];

// Funkce pro přidání Dact Fuel do košíku
window.addDactFuelToCart = function() {
    const item = {
        id: "dact_energy",  // Unikátní ID produktu Dact Fuel
        name: "Dact Energy",  // Název produktu
        imageUrl: "/img/12oz Can-2.png",  // Obrázek produktu
        price: 40.00,  // Cena produktu Dact Fuel
        quantity: 1  // Výchozí množství
    };

    let existingItem = window.cart.find(product => product.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity;  // Zvýšení množství, pokud již produkt v košíku existuje
    } else {
        window.cart.push(item);  // Přidání produktu do košíku, pokud není přítomen
    }

    localStorage.setItem("cart", JSON.stringify(window.cart));  // Uložení do localStorage
    console.log("Dact Fuel přidán:", item);
    window.location.href = "/kosik/index.html";  // Přesměrování do košíku
};

// Funkce pro přidání Dact Energy do košíku
window.addDactEnergyToCart = function() {
    const item = {
        id: "dact_energy",  // Unikátní ID produktu Dact Energy
        name: "Dact Energy",  // Název produktu
        imageUrl: "/img/12oz Can-2.png",  // Obrázek produktu
        price: 40.00,  // Cena produktu Dact Energy
        quantity: 1  // Výchozí množství
    };

    let existingItem = window.cart.find(product => product.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity;  // Zvýšení množství, pokud již produkt v košíku existuje
    } else {
        window.cart.push(item);  // Přidání produktu do košíku, pokud není přítomen
    }

    localStorage.setItem("cart", JSON.stringify(window.cart));  // Uložení do localStorage
    console.log("Dact Energy přidán:", item);
    window.location.href = "/kosik/index.html";  // Přesměrování do košíku
};
