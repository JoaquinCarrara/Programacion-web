// ── 1. Clase Producto ─────────────────────────────────────────
class Producto {
    #stock;

    constructor(id, categoria, nombre, marca, precio, stock, imagen, especificaciones) {
        this.id = id;
        this.categoria = categoria;
        this.nombre = nombre;
        this.marca = marca;
        this.precio = precio;
        this.#stock = stock;
        this.imagen = imagen;
        this.especificaciones = especificaciones;
    }

    get estaDisponible() { return this.#stock > 0; }
    get stock() { return this.#stock; }
    get precioFormateado() { return '$' + this.precio.toLocaleString('es-AR'); }
}

// ── 2. Variables Globales de Estado ─────────────────────────────
let catalogo = [];
let productosFiltradosActuales = [];
let categoriaActual = 'todos';
let marcaActual = 'todas';
let paginaActual = 1;
const productosPorPagina = 12;

// ── Guardar el estado actual en LocalStorage ───────────────────
function guardarEstadoFiltros() {
    const estado = {
        categoria: categoriaActual,
        marca: marcaActual,
        busqueda: document.getElementById('input-buscador')?.value || '',
        pagina: paginaActual
    };
    localStorage.setItem('techHouse_filtros', JSON.stringify(estado));
}

// ── Recuperar el estado desde LocalStorage ─────────────────────
function cargarEstadoFiltros() {
    const estadoGuardado = localStorage.getItem('techHouse_filtros');
    if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado);
        categoriaActual = estado.categoria || 'todos';
        marcaActual = estado.marca || 'todas';
        paginaActual = estado.pagina || 1;

        const inputBuscador = document.getElementById('input-buscador');
        if (inputBuscador) {
            inputBuscador.value = estado.busqueda || '';
        }
    }
}

// ── 3. Consumo de la API ────────────────────────────────────────
async function cargarProductos() {
    try {
        const respuesta = await fetch('http://localhost:8080/productos');
        if (!respuesta.ok) throw new Error('Error al conectar con la base de datos');

        const datosPlanos = await respuesta.json();

        catalogo = datosPlanos.map(prod => {
            const { id, categoria, nombre, marca, precio, stock, imagen, ...specs } = prod;
            return new Producto(id, categoria, nombre, marca, precio, stock, imagen, specs);
        });

        cargarEstadoFiltros();

        const botonesFiltro = document.querySelectorAll('.btn-filtro');
        botonesFiltro.forEach(b => {
            if (b.getAttribute('data-categoria') === categoriaActual) {
                b.classList.add('activo');
            } else {
                b.classList.remove('activo');
            }
        });

        actualizarBotonesMarcas();

        filtrarYRenderizar(true);

        renderizarOfertas();
        configurarBuscador();
        configurarFiltrosCategorias();
        configurarBotonHome();

    } catch (error) {
        console.error("Fallo en la carga de productos: ", error);
        const contenedor = document.querySelector('.contenedor-productos');
        if (contenedor) {
            contenedor.innerHTML = `
                <div style="width: 100%; text-align: center; padding: 50px;">
                    <h3 style="color: #ff5722;">Error de conexión</h3>
                    <p style="color: #666;">No pudimos cargar el catálogo. Verificá que el json-server esté corriendo.</p>
                </div>
            `;
        }
    }
}

// ── 4. Creación de Tarjetas ─────────────────────────────────────
function crearTarjeta(producto) {
    const article = document.createElement('article');
    article.className = producto.estaDisponible ? 'moderna' : 'moderna sin-stock';

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => abrirModal(producto));

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-contenido';

    const marcaProducto = document.createElement('p');
    marcaProducto.textContent = producto.marca;
    marcaProducto.className = 'card-marca';

    const tituloProducto = document.createElement('h3');
    tituloProducto.textContent = producto.nombre;
    tituloProducto.className = 'card-titulo';
    tituloProducto.style.cursor = 'pointer';
    tituloProducto.addEventListener('click', () => abrirModal(producto));

    const precioProducto = document.createElement('p');
    precioProducto.textContent = producto.precioFormateado;
    precioProducto.className = 'card-precio';

    const stockProducto = document.createElement('p');
    stockProducto.textContent = producto.estaDisponible ? `Stock: ${producto.stock}` : 'Agotado';
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

// ── 5. Lógica de Paginación y Renderizado ───────────────────────
function renderizarCatalogoPaginado() {
    const contenedor = document.querySelector('.contenedor-productos');
    const contenedorPaginacion = document.getElementById('contenedor-paginacion');
    if (!contenedor || !contenedorPaginacion) return;

    contenedor.innerHTML = '';
    contenedorPaginacion.innerHTML = '';

    if (productosFiltradosActuales.length === 0) {
        contenedor.innerHTML = '<p style="width: 100%; text-align: center; color: #666; margin-top: 20px;">No se encontraron productos.</p>';
        return;
    }

    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;
    const productosPagina = productosFiltradosActuales.slice(indiceInicio, indiceFin);

    productosPagina.forEach(producto => {
        contenedor.appendChild(crearTarjeta(producto));
    });

    renderizarBotonesPaginacion();
}

function renderizarBotonesPaginacion() {
    const contenedorPaginacion = document.getElementById('contenedor-paginacion');
    const totalPaginas = Math.ceil(productosFiltradosActuales.length / productosPorPagina);

    if (totalPaginas <= 1) return;

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === paginaActual ? 'btn-pagina activo' : 'btn-pagina';

        btn.addEventListener('click', () => {
            paginaActual = i;
            guardarEstadoFiltros(); // <-- AGREGAR ESTA LÍNEA ACÁ
            renderizarCatalogoPaginado();
            document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
        });
        contenedorPaginacion.appendChild(btn);
    }
}

// ── 6. Lógica de Filtros y Búsqueda ─────────────────────────────
function filtrarYRenderizar(mantenerPagina = false) {
    let productosFiltrados = catalogo;

    if (categoriaActual !== 'todos') {
        productosFiltrados = productosFiltrados.filter(prod => prod.categoria === categoriaActual);
    }

    if (marcaActual !== 'todas') {
        productosFiltrados = productosFiltrados.filter(prod => prod.marca === marcaActual);
    }

    const inputBuscador = document.getElementById('input-buscador');
    const textoBusqueda = inputBuscador ? inputBuscador.value.toLowerCase() : '';
    if (textoBusqueda) {
        productosFiltrados = productosFiltrados.filter(producto => {
            const nombre = producto.nombre.toLowerCase();
            const marca = producto.marca.toLowerCase();
            return nombre.includes(textoBusqueda) || marca.includes(textoBusqueda);
        });
    }

    productosFiltradosActuales = productosFiltrados;

    if (!mantenerPagina) {
        paginaActual = 1;
    }

    guardarEstadoFiltros();
    renderizarFiltrosActivos(); // <--- AGREGAR ESTA LÍNEA ACÁ
    renderizarCatalogoPaginado();
}

function configurarFiltrosCategorias() {
    const botonesFiltro = document.querySelectorAll('.btn-filtro');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            const botonClickeado = evento.target;
            botonClickeado.classList.add('activo');

            categoriaActual = botonClickeado.getAttribute('data-categoria');
            marcaActual = 'todas';

            actualizarBotonesMarcas();
            filtrarYRenderizar();
        });
    });
}

function actualizarBotonesMarcas() {
    const contenedorMarcas = document.getElementById('contenedor-marcas');
    if (!contenedorMarcas) return;

    if (categoriaActual === 'todos') {
        contenedorMarcas.innerHTML = '';
        contenedorMarcas.classList.add('oculto');
        return;
    }

    const productosCategoria = catalogo.filter(prod => prod.categoria === categoriaActual);
    const marcasUnicas = [...new Set(productosCategoria.map(prod => prod.marca))];

    // Condicionamos la clase 'activo' según el estado guardado
    const claseTodas = marcaActual === 'todas' ? 'btn-marca activo' : 'btn-marca';
    let htmlBotones = `<button class="${claseTodas}" data-marca="todas">Todas las marcas</button>`;

    marcasUnicas.forEach(marca => {
        const claseMarca = marcaActual === marca ? 'btn-marca activo' : 'btn-marca';
        htmlBotones += `<button class="${claseMarca}" data-marca="${marca}">${marca}</button>`;
    });

    contenedorMarcas.innerHTML = htmlBotones;
    contenedorMarcas.classList.remove('oculto');

    const botonesMarca = document.querySelectorAll('.btn-marca');
    botonesMarca.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            botonesMarca.forEach(b => b.classList.remove('activo'));
            evento.target.classList.add('activo');

            marcaActual = evento.target.getAttribute('data-marca');
            filtrarYRenderizar();
        });
    });
}

// ── Lógica para Renderizar Filtros Activos ─────────────────────
function renderizarFiltrosActivos() {
    const contenedor = document.getElementById('contenedor-filtros-activos');
    if (!contenedor) return;

    contenedor.innerHTML = ''; // Limpiamos etiquetas viejas

    const inputBuscador = document.getElementById('input-buscador');
    const textoBusqueda = inputBuscador ? inputBuscador.value.trim() : '';

    // Si no hay ningún filtro aplicado, ocultamos la barra por completo
    if (categoriaActual === 'todos' && marcaActual === 'todas' && !textoBusqueda) {
        contenedor.style.display = 'none';
        return;
    }

    contenedor.style.display = 'flex'; // Mostramos la barra si hay filtros

    // 1. Etiqueta para Categoría
    if (categoriaActual !== 'todos') {
        crearEtiquetaFiltro(contenedor, `Categoría: ${categoriaActual}`, () => {
            categoriaActual = 'todos';
            marcaActual = 'todas'; // Al remover categoría, reiniciamos la marca por lógica

            // Re-pintamos visualmente el botón "Todos" de las categorías
            const botonesFiltro = document.querySelectorAll('.btn-filtro');
            botonesFiltro.forEach(b => {
                if (b.getAttribute('data-categoria') === 'todos') b.classList.add('activo');
                else b.classList.remove('activo');
            });

            actualizarBotonesMarcas();
            filtrarYRenderizar();
        });
    }

    // 2. Etiqueta para Marca
    if (marcaActual !== 'todas') {
        crearEtiquetaFiltro(contenedor, `Marca: ${marcaActual}`, () => {
            marcaActual = 'todas';
            filtrarYRenderizar();
            actualizarBotonesMarcas(); // Actualiza para pintar "Todas las marcas" de nuevo
        });
    }

    // 3. Etiqueta para el Buscador de texto
    if (textoBusqueda) {
        crearEtiquetaFiltro(contenedor, `Búsqueda: "${textoBusqueda}"`, () => {
            if (inputBuscador) inputBuscador.value = ''; // Vaciamos el input text
            filtrarYRenderizar();
        });
    }
}

function crearEtiquetaFiltro(contenedor, texto, funcionQuitar) {
    const badge = document.createElement('div');
    badge.className = 'badge-filtro-activo';
    badge.innerHTML = `<span>${texto}</span>`;

    const btnQuitar = document.createElement('button');
    btnQuitar.className = 'btn-quitar-filtro';
    btnQuitar.innerHTML = '&times;';
    btnQuitar.addEventListener('click', funcionQuitar);

    badge.appendChild(btnQuitar);
    contenedor.appendChild(badge);
}

function configurarBuscador() {
    const inputBuscador = document.getElementById('input-buscador');
    if (!inputBuscador) return;

    inputBuscador.addEventListener('input', () => {
        filtrarYRenderizar(); // La función centralizada hace todo el trabajo
    });
}

// ── 7. Ofertas y Modal ──────────────────────────────────────────
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
        trackOfertas.appendChild(crearTarjetaMini(prod));
    });
}

function configurarBotonesCarrusel() {
    const track = document.getElementById('carrusel-ofertas');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (!track || !btnPrev || !btnNext) return;

    btnNext.addEventListener('click', () => track.scrollBy({ left: 240, behavior: 'smooth' }));
    btnPrev.addEventListener('click', () => track.scrollBy({ left: -240, behavior: 'smooth' }));
}

function abrirModal(producto) {
    document.getElementById('modal-img').src = producto.imagen;
    document.getElementById('modal-categoria').textContent = producto.categoria;
    document.getElementById('modal-titulo').textContent = producto.nombre;
    document.getElementById('modal-precio').textContent = producto.precioFormateado;

    const listaSpecs = document.getElementById('lista-especificaciones');
    listaSpecs.innerHTML = '';
    for (const [clave, valor] of Object.entries(producto.especificaciones)) {

        if (valor !== null && valor !== undefined && valor !== "") {

            let nombreAmigable = clave.replace(/([A-Z])/g, ' $1').trim();
            nombreAmigable = nombreAmigable.charAt(0).toUpperCase() + nombreAmigable.slice(1);

            const li = document.createElement('li');
            li.innerHTML = `<strong>${nombreAmigable}:</strong> ${valor}`;
            listaSpecs.appendChild(li);
        }
    }

    document.getElementById('modal-producto').classList.add('modal-activo');
}

function cerrarModal() {
    document.getElementById('modal-producto').classList.remove('modal-activo');
}

// ── 8. ÚNICA INICIALIZACIÓN DE LA PÁGINA ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    configurarBotonesCarrusel();

    const btnCerrar = document.getElementById('cerrar-modal');
    const modal = document.getElementById('modal-producto');
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
    if (modal) {
        modal.addEventListener('click', (evento) => {
            if (evento.target === modal) cerrarModal();
        });
    }
});

function configurarBotonHome() {
    const botonHome = document.getElementById('btn-home') || document.querySelector('.logo');

    if (botonHome) {
        botonHome.addEventListener('click', () => {
            localStorage.removeItem('techHouse_filtros');
        });
    }
}