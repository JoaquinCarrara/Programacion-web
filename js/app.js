// ── 1. Clase Producto ───────────────────────────────────────────
class Producto {
    #stock;

    constructor(nombre, marca, precio, stock, imagen) {
        this.nombre = nombre;
        this.marca = marca;
        this.precio = precio;
        this.#stock = stock;
        this.imagen = imagen;
    }

    get estaDisponible() {
        return this.#stock > 0;
    }

    get stock() {
        return this.#stock;
    }

    get precioFormateado() {
        return '$' + this.precio.toLocaleString('es-AR');
    }
}

// ── 2. Catálogo de productos ────────────────────────────────────
const catalogo = [
    new Producto('MacBook Air M2', 'Apple', 2100000, 4, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
    new Producto('iPhone 15', 'Apple', 1650000, 12, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400'),
    new Producto('Sony WH-1000XM5', 'Sony', 420000, 0, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'),
    new Producto('LG UltraGear 27GP850', 'LG', 480000, 6, 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400'),
    new Producto('PC Gamer Entry Level', 'Armada', 1200000, 5, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400'),
    new Producto('Samsung Galaxy S24 Ultra', 'Samsung', 1850000, 8, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400'),
    new Producto('iPad Pro 11"', 'Apple', 1400000, 5, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400'),
    new Producto('Teclado Mecánico Keychron K2', 'Keychron', 180000, 15, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400'),
    new Producto('Mouse Logitech MX Master 3S', 'Logitech', 145000, 20, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
    new Producto('Monitor Samsung Odyssey G5', 'Samsung', 520000, 0, 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=400'),
    new Producto('Apple AirPods Pro 2', 'Apple', 380000, 25, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400'),
    new Producto('Micrófono HyperX QuadCast', 'HyperX', 190000, 12, 'https://m.media-amazon.com/images/I/61MHMfB37iL._AC_SY400_.jpg'),
    new Producto('PlayStation 5', 'Sony', 1100000, 3, 'https://m.media-amazon.com/images/I/619BkvKW35L._AC_SY400_.jpg'),
    new Producto('Xbox Series X', 'Microsoft', 1050000, 0, 'https://m.media-amazon.com/images/I/51ojzJk77qL._AC_SY400_.jpg'),
    new Producto('Placa de Video RTX 4060', 'NVIDIA', 650000, 7, 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=400'),
    new Producto('Disco SSD 1TB WD Black', 'Western Digital', 120000, 30, 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=400'),
    new Producto('Memoria RAM 16GB DDR5', 'Corsair', 95000, 40, 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400'),
    new Producto('Silla Gamer AKRacing', 'AKRacing', 450000, 4, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400'),
    new Producto('Tablet Galaxy Tab S9', 'Samsung', 1150000, 6, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'),
    new Producto('Apple Watch Series 9', 'Apple', 650000, 10, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400')
];

// ── 3. Funciones del Catálogo Principal y Buscador ─────────────
function crearTarjeta(producto) {
    const article = document.createElement('article');
    article.className = producto.estaDisponible ? 'moderna' : 'moderna sin-stock';

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-contenido';

    const marcaProducto = document.createElement('p');
    marcaProducto.textContent = producto.marca;
    marcaProducto.className = 'card-marca';

    const tituloProducto = document.createElement('h3');
    tituloProducto.textContent = producto.nombre;
    tituloProducto.className = 'card-titulo';

    const precioProducto = document.createElement('p');
    precioProducto.textContent = producto.precioFormateado;
    precioProducto.className = 'card-precio';

    const stockProducto = document.createElement('p');
    stockProducto.textContent = producto.estaDisponible ? `Stock disponible: ${producto.stock}` : 'Agotado';
    stockProducto.className = producto.estaDisponible ? 'card-stock' : 'card-stock agotado';

    const controlesCompra = document.createElement('div');
    controlesCompra.className = 'controles-compra';

    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.min = 1;
    inputCantidad.max = producto.stock;
    inputCantidad.value = 1;
    inputCantidad.className = 'card-input';
    inputCantidad.disabled = !producto.estaDisponible;

    const btn = document.createElement('button');
    btn.textContent = producto.estaDisponible ? "Comprar" : "Sin Stock";
    btn.disabled = !producto.estaDisponible;
    btn.className = 'card-btn';

    cardInfo.appendChild(marcaProducto);
    cardInfo.appendChild(tituloProducto);
    cardInfo.appendChild(precioProducto);
    cardInfo.appendChild(stockProducto);

    controlesCompra.appendChild(inputCantidad);
    controlesCompra.appendChild(btn);

    cardInfo.appendChild(controlesCompra);
    article.appendChild(img);
    article.appendChild(cardInfo);

    return article;
}

// IMPORTANTE: Ahora recibe "listaProductos". Si no le pasamos nada, usa "catalogo" por defecto.
function renderizarCatalogo(listaProductos = catalogo) {
    const contenedor = document.querySelector('.contenedor-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (listaProductos.length === 0) {
        contenedor.innerHTML = '<p style="width: 100%; text-align: center; font-size: 1.2rem; color: #666; margin-top: 20px;">No se encontraron productos que coincidan con tu búsqueda.</p>';
        return;
    }

    listaProductos.forEach(producto => {
        const tarjeta = crearTarjeta(producto);
        contenedor.appendChild(tarjeta);
    });
}

function configurarBuscador() {
    const inputBuscador = document.getElementById('input-buscador');
    if (!inputBuscador) return;

    inputBuscador.addEventListener('input', (evento) => {
        const textoBusqueda = evento.target.value.toLowerCase();

        const productosFiltrados = catalogo.filter(producto => {
            const nombre = producto.nombre.toLowerCase();
            const marca = producto.marca.toLowerCase();
            return nombre.includes(textoBusqueda) || marca.includes(textoBusqueda);
        });

        renderizarCatalogo(productosFiltrados);
    });
}

// ── 4. Funciones del Carrusel de Ofertas ───────────────────────
function crearTarjetaMini(producto) {
    const article = document.createElement('article');
    article.className = 'moderna-mini';

    const badge = document.createElement('span');
    badge.className = 'badge-oferta';
    badge.textContent = '15% OFF';
    article.appendChild(badge);

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-contenido';

    const tituloProducto = document.createElement('h3');
    tituloProducto.textContent = producto.nombre;
    tituloProducto.className = 'card-titulo';

    const precioViejoNum = Math.round(producto.precio * 1.15);
    const precioViejo = document.createElement('span');
    precioViejo.className = 'precio-viejo';
    precioViejo.textContent = '$' + precioViejoNum.toLocaleString('es-AR');

    const precioProducto = document.createElement('p');
    precioProducto.textContent = producto.precioFormateado;
    precioProducto.className = 'card-precio';

    const btn = document.createElement('button');
    btn.textContent = "Ver Oferta";
    btn.className = 'card-btn';

    cardInfo.appendChild(tituloProducto);
    cardInfo.appendChild(precioViejo);
    cardInfo.appendChild(precioProducto);
    cardInfo.appendChild(btn);

    article.appendChild(img);
    article.appendChild(cardInfo);

    return article;
}

function renderizarOfertas() {
    const trackOfertas = document.getElementById('carrusel-ofertas');
    if (!trackOfertas) return;

    trackOfertas.innerHTML = '';

    const productosEnOferta = catalogo.slice(-8).reverse();

    productosEnOferta.forEach(prod => {
        const tarjetaMini = crearTarjetaMini(prod);
        trackOfertas.appendChild(tarjetaMini);
    });
}

function configurarBotonesCarrusel() {
    const track = document.getElementById('carrusel-ofertas');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (!track || !btnPrev || !btnNext) return;

    btnNext.addEventListener('click', () => {
        track.scrollBy({ left: 240, behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -240, behavior: 'smooth' });
    });
}

// ── 5. Inicialización (Cuando carga la página) ────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    renderizarOfertas();
    configurarBotonesCarrusel();
    configurarBuscador(); // Activamos el buscador
});