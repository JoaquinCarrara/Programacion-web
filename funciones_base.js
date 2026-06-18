// PARA VISTA DE TODOS LOS PRODUCTOS

// esta id debe corresponder a un id en el html para mostrar las tarjetas
// ej. <div id="productos-filtrados"></div>
const contenedor_filtrado = document.getElementById('productos-filtrados');

// aca se van a cargar los datos que vengan del back
let catalogo_completo = [];

// ── Armar objeto ───────────────────────────────────────────────────
function crearProducto(d) {
  // definimos atributos base que no cambian por subclase de producto
  const base = [d.nombre, d.marca, d.precio, d.stock, d.imagen];
  let producto;
  switch (d.categoria) {
    case 'notebook':
      producto = new Notebook(...base, d.procesador, d.ramGB, d.almacenamientoGB, d.pantallaPulgadas);
      break;
    case 'celular':
      producto = new Celular(...base, d.pantallaPulgadas, d.bateriaMah, d.camaraMp, d.almacenamientoGB);
      break;
    case 'auricular':
      producto = new Auricular(...base, d.tipo, d.wireless, d.cancelacionRuido);
      break;
    case 'monitor':
      producto = new Monitor(...base, d.pulgadas, d.resolucion, d.panelTipo, d.hz);
      break;
    case 'pc_escritorio':
      producto = new PCEscritorio(...base, d.procesador, d.ramGB, d.almacenamientoGB, d.placaVideo, d.fuenteW);
      break;
    default:
      producto = new Producto(...base);
  }
  // aca definimos que tome el id del producto que viene del back
  producto.id = d.id;
  return producto;
}

// ── Fetch ─────────────────────────────────────────────────────
// async porque va a ser una funcion asincrona
async function cargarProductos() {
  try {
    // la funcion fetch nos permite realizar peticiones al backend
    // await porque al ser cargarProductos una funcion asincrona, debemos esperar
    // a que la respuesta venga
    const respuesta = await fetch('http://localhost:8080/productos');
    if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);

    // convertimos datos a json para poder utilizarlos
    const datos = await respuesta.json();

    // si hacemos un console.log acá y salió todo bien, vamos a obtener los productos
    // que se encuentran en la base de datos
    console.log(datos)

    // convertimos cada uno de los productos obtenidos del backend 
    // a un objeto de su tipo. ej. si la categoria que viene del back es "notebook",
    // entonces en crearProducto debemos crear la instancia de subclase notebook.
    catalogo_completo = datos.map(d => crearProducto(d));

  } catch (error) {
    console.error('No se pudo cargar:', error.message);
    contenedor_filtrado.innerHTML =
      '<p style="color:#C0392B;padding:16px">⚠️ No se pudo conectar con el servidor.</p>';
  }
}

// ── Renderizado ───────────────────────────────────────────────
function crearTarjeta(producto) {
  const article = document.createElement('article');
  article.className = producto.estaDisponible ? 'tarjeta' : 'tarjeta sin-stock';

  const img = document.createElement('img');
  img.src = producto.imagen; img.alt = producto.nombre; img.loading = 'lazy';

  const info = document.createElement('div');
  info.className = 'tarjeta-info';

  const h3 = document.createElement('h3');
  h3.textContent = producto.nombre;

  const precio = document.createElement('p');
  precio.className = 'precio';
  precio.textContent = producto.precioFormateado;

  const ficha = document.createElement('p');
  ficha.className = 'ficha';
  ficha.textContent = producto.fichaTecnica();

  const btn = document.createElement('button');
  btn.textContent = producto.estaDisponible ? 'Agregar al carrito' : 'Sin stock';
  btn.disabled = !producto.estaDisponible;

  const btnDetalle = document.createElement('button');
  btnDetalle.textContent = 'Ver detalle';
  btnDetalle.className = 'btn-detalle';

  // el window.location.href se refiere a la ventana actual. si le asigno un valor distinto,
  // me redirige a ese nuevo valor
  btnDetalle.addEventListener('click', () => {
    window.location.href = `producto.html?id=${producto.id}`;
  });

  info.appendChild(h3);
  info.appendChild(precio);
  info.appendChild(ficha);
  info.appendChild(btn);
  info.appendChild(btnDetalle);

  article.appendChild(img);
  article.appendChild(info);
  return article;
}

// funcion para mostrar los productos
function renderizar(lista) {
  contenedor_filtrado.innerHTML = '';
  if (lista.length === 0) {
    contenedor_filtrado.innerHTML = '<p style="color:#888;padding:16px">No se encontraron productos.</p>';
    return;
  }
  // utilizamos un forEach porque viene una lista de productos, y por cada producto
  // creamos una tarjeta
  lista.forEach(p => contenedor_filtrado.appendChild(crearTarjeta(p)));
}

cargarProductos()

// ---------------------------------------

// PARA VISTA DE PRODUCTO PARTICULAR

const contenedor_producto = document.getElementById('detalle');
const mensaje = document.getElementById('mensaje-error');

// Leer el id de la URL: producto.html?id=1
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function cargarProducto() {
  try {
    const respuesta = await fetch(`http://localhost:8080/productos/${id}`);

    if (respuesta.status === 404) {
      mensaje.textContent = 'Producto no encontrado.';
      return;
    }

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const producto = crearProducto(datos);

    renderizarDetalle(producto);

  } catch (error) {
    console.error(error.message);
    mensaje.textContent = '⚠️ No se pudo cargar el producto. Verificar que el backend está corriendo.';
  }
}


function renderizarDetalle(producto) {
  const img = document.createElement('img');
  img.src = producto.imagen;
  img.alt = producto.nombre;
  img.className = 'detalle-imagen';

  const info = document.createElement('div');
  info.className = 'detalle-info';

  const categoria = document.createElement('span');
  categoria.className = 'detalle-categoria';
  categoria.textContent = producto.constructor.name;

  const nombre = document.createElement('h2');
  nombre.textContent = producto.nombre;

  info.appendChild(categoria);
  info.appendChild(nombre);

  contenedor_producto.appendChild(img);
  contenedor_producto.appendChild(info);
}

cargarProducto();