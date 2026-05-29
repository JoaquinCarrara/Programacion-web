
class Producto {
    #stock
    #precio
    constructor(nombre, marca, precio, stock, imagen) {
        this.nombre = nombre;
        this.marca = marca;
        this.#precio = precio;
        this.#stock = stock;
        this.imagen = imagen;
    }

    descripcion() {
        return `${this.nombre} — ${this.marca}`;
    }

    get estaDisponible() {
        return this.#stock > 0;
    }

    get precioFormateado() {
        return `$${this.#precio.toLocaleString('es-AR')}`;
    }

    get disponibilidad() {
        return this.#stock > 0
    }

    set precio(valor) {
        if (valor <= 0) console.log(`Stock invalido ${valor}`);
    }

    resumen() {
        const disponible = this.disponibilidad ? `${this.#stock} en stock` : 'Sin stock';
        return `${this.descripcion()} | ${this.precioFormateado} | ${disponible}`;
    }
}

// ── Catálogo de productos ────────────────────────────────────
// Array global — definido fuera de cualquier función o clase
const catalogo = [
    new Producto(
        'MacBook Air M2', 'Apple', 2100000, 4,
        'https://lidernotebooks.com.ar/wp-content/uploads/2023/07/Apple-MacBook-Air-M2-MLY33LL-A-8GB-256GB-Midnight-3.666.jpg'
    ),
    new Producto(
        'iPhone 15', 'Apple', 1650000, 12,
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'
    ),
    new Producto(
        'Sony WH-1000XM5', 'Sony', 420000, 0,
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'
    ),
    new Producto(
        'LG UltraGear 27GP850', 'LG', 480000, 6,
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
    ),
    new Producto(
        'PC Gamer Entry Level', 'Armada', 1200000, 5,
        'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400'
    ),
];

// agregar get (get precio() y get stock())
// agregar set y validar algo (precio() y stock())
// ficha tecnica 
// catalogo.forEach(p => p.stock > 0 ){
//     console.log();
//     }

class Notebook extends Producto {
    constructor(nombre, marca, precio, stock, memoria, pantalla, bateria) {
        super(nombre, marca, precio, stock);
        this.memoria = memoria;
        this.pantalla = pantalla;
        this.bateria = bateria;
    }

    fichaTecnica() {
        return `${this.nombre} - ${this.pantalla} - ${this.memoria}`
    }
}

class Celular extends Producto {
    constructor(nombre, marca, precio, stock, memoria, pantalla, bateria, color) {
        super(nombre, marca, precio, stock)
        this.memoria = memoria;
        this.pantalla = pantalla;
        this.bateria = bateria;
        this.color = color;
    }
    fichaTecnica() {
        return `${this.marca} - ${this.pantalla}" - ${this.memoria}GB`
    }
}



const compu = new Notebook("notebook", "HP", 20000, 20, "16GB", "22", "2500hz")
const compu2 = new Notebook("notebook", "lenovo", 18000, 10, "16GB", "24", "3000hz")
const celu = new Celular("Telefono", "Samsung", 120000, 5, 256, 12, "1500hz", "Azul")
const celu2 = new Celular("Telefono", "Motorola", 120000, 5, 256, 12, "1500hz", "Blanco")

console.log(compu);
console.log(compu2);
console.log(compu2.resumen());
console.log(compu.resumen());


console.log(celu.fichaTecnica());



// ---------------------- VER ---------------------


// ---------------------- RENDERIZADO DEL DOM ---------------------

function crearTarjeta(producto) {
    const article = document.createElement('article');
    article.className = producto.estaDisponible ? 'moderna' : 'moderna sin-stock';

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-contenido';

    const tituloProducto = document.createElement('h3');
    tituloProducto.textContent = producto.nombre;
    tituloProducto.className = 'card-titulo'; // Tu clase de CSS

    const precioProducto = document.createElement('p');
    precioProducto.textContent = producto.precioFormateado;
    precioProducto.className = 'card-precio'; // Tu clase de CSS

    const btn = document.createElement('button');
    btn.textContent = producto.estaDisponible ? "Comprar" : "Sin Stock";
    btn.disabled = !producto.estaDisponible;
    btn.className = 'card-btn'; // Tu clase de CSS

    cardInfo.appendChild(tituloProducto);
    cardInfo.appendChild(precioProducto);
    cardInfo.appendChild(btn);

    article.appendChild(img);
    article.appendChild(cardInfo);

    return article;
}

function renderizarProductos() {
    const contenedor = document.getElementById('productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    catalogo.forEach(prod => {
        const tarjetaTerminada = crearTarjeta(prod);
        contenedor.appendChild(tarjetaTerminada);
    });
}

renderizarProductos();