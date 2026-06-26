import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import ServiceSection from './ServiceSection';
import Footer from './Footer';
import ProductCard from './ProductCard';
import ProductOfferCard from './ProductOfferCard';
import ProductModal from './ProductModal';
import AddProductModal from './AddProductModal';

export default function TiendaHome() {
    const [catalogo, setCatalogo] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaActual, setCategoriaActual] = useState('todos');
    const [marcaActual, setMarcaActual] = useState('todas');
    const [paginaActual, setPaginaActual] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mostrarModalAlta, setMostrarModalAlta] = useState(false);
    const [errorConexion, setErrorConexion] = useState(false);

    const carruselRef = useRef(null);
    const productosPorPagina = 12;

    const usuarioGuardado = localStorage.getItem('techHouse_user') || sessionStorage.getItem('techHouse_user');
    const usuarioLogueado = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    const esAdmin = usuarioLogueado?.email.toLowerCase() === 'admin@techhouse.com';

    const manejarCerrarSesion = (e) => {
        e.preventDefault();
        localStorage.removeItem('techHouse_user');
        sessionStorage.removeItem('techHouse_user');
        window.location.reload();
    };

    const refrescarCatalogo = () => {
        fetch('http://localhost:8080/productos')
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                const productosFormateados = data.map(prod => {
                    const { id, categoria, nombre, marca, precio, stock, imagen, ...specs } = prod;
                    return { id, categoria, nombre, marca, precio, stock, imagen, especificaciones: specs };
                });
                setCatalogo(productosFormateados);
                setErrorConexion(false);
            })
            .catch(() => setErrorConexion(true));
    };

    useEffect(() => {
        const estadoGuardado = localStorage.getItem('techHouse_filtros');
        if (estadoGuardado) {
            const estado = JSON.parse(estadoGuardado);
            setCategoriaActual(estado.categoria || 'todos');
            setMarcaActual(estado.marca || 'todas');
            setBusqueda(estado.busqueda || '');
            setPaginaActual(estado.pagina || 1);
        }
        refrescarCatalogo();
    }, []);

    useEffect(() => {
        if (catalogo.length > 0) {
            const estado = { categoria: categoriaActual, marca: marcaActual, busqueda, pagina: paginaActual };
            localStorage.setItem('techHouse_filtros', JSON.stringify(estado));
        }
    }, [categoriaActual, marcaActual, busqueda, paginaActual, catalogo]);

    const productosFiltrados = catalogo.filter(prod => {
        const cumpleCategoria = categoriaActual === 'todos' || prod.categoria === categoriaActual;
        const cumpleMarca = marcaActual === 'todas' || prod.marca === marcaActual;
        const cumpleBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            prod.marca.toLowerCase().includes(busqueda.toLowerCase());
        return cumpleCategoria && cumpleMarca && cumpleBusqueda;
    });

    const marcasDisponibles = [
        ...new Set(catalogo.filter(p => p.categoria === categoriaActual).map(p => p.marca))
    ];

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const productosPaginados = productosFiltrados.slice(indiceInicio, indiceInicio + productosPorPagina);

    return (
        <div>
            <header>
                <section className="banner-principal">
                    <div className="banner-principal" style={{ position: 'relative' }}>
                        <img src="./imagenes/imgpng.png" alt="Portada de Tech House" className="banner-img" />

                        {usuarioLogueado ? (
                            <div style={{ position: 'absolute', top: '30px', right: '40px', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 10 }}>
                                <span style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', fontWeight: '600', textShadow: '0 2px 5px rgba(0,0,0,0.6)' }}>
                                    ¡Hola, {usuarioLogueado.email.split('@')[0]}!
                                </span>
                                <a href="#logout" className="btn-login-banner" onClick={manejarCerrarSesion} style={{ position: 'static' }}>
                                    Cerrar Sesión
                                </a>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-login-banner">
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </section>
                <Navbar />
            </header>

            <main>
                <section id="catalogo">
                    <div className="catalogo-cabecera">
                        <div className="balance-vacio"></div>
                        <h2 style={{ cursor: 'pointer' }} onClick={() => {
                            localStorage.removeItem('techHouse_filtros');
                            setCategoriaActual('todos'); setMarcaActual('todas'); setBusqueda(''); setPaginaActual(1);
                        }}>Catálogo de productos</h2>
                        <div className="buscador-contenedor">
                            <input
                                type="text"
                                id="input-buscador"
                                placeholder="Buscar por nombre o marca..."
                                value={busqueda}
                                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                            />
                        </div>
                    </div>

                    <div className="filtros-categorias">
                        {['todos', 'notebook', 'celular', 'auricular', 'monitor', 'pc_escritorio'].map(cat => (
                            <button
                                key={cat}
                                className={`btn-filtro ${categoriaActual === cat ? 'activo' : ''}`}
                                onClick={() => { setCategoriaActual(cat); setMarcaActual('todas'); setPaginaActual(1); }}
                            >
                                {cat === 'todos' ? 'Todos' : cat === 'pc_escritorio' ? 'PCs de Escritorio' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}
                            </button>
                        ))}
                    </div>

                    {categoriaActual !== 'todos' && (
                        <div className="filtros-marcas">
                            <button
                                className={`btn-marca ${marcaActual === 'todas' ? 'activo' : ''}`}
                                onClick={() => { setMarcaActual('todas'); setPaginaActual(1); }}
                            >
                                Todas las marcas
                            </button>
                            {marcasDisponibles.map(marca => (
                                <button
                                    key={marca}
                                    className={`btn-marca ${marcaActual === marca ? 'activo' : ''}`}
                                    onClick={() => { setMarcaActual(marca); setPaginaActual(1); }}
                                >
                                    {marca}
                                </button>
                            ))}
                        </div>
                    )}

                    {(categoriaActual !== 'todos' || marcaActual !== 'todas' || busqueda) && (
                        <div className="filtros-activos-barra">
                            {categoriaActual !== 'todos' && (
                                <div className="badge-filtro-activo">
                                    <span>Categoría: {categoriaActual}</span>
                                    <button className="btn-quitar-filtro" onClick={() => { setCategoriaActual('todos'); setMarcaActual('todas'); setPaginaActual(1); }}>&times;</button>
                                </div>
                            )}
                            {marcaActual !== 'todas' && (
                                <div className="badge-filtro-activo">
                                    <span>Marca: {marcaActual}</span>
                                    <button className="btn-quitar-filtro" onClick={() => { setMarcaActual('todas'); setPaginaActual(1); }}>&times;</button>
                                </div>
                            )}
                            {busqueda && (
                                <div className="badge-filtro-activo">
                                    <span>Búsqueda: "{busqueda}"</span>
                                    <button className="btn-quitar-filtro" onClick={() => setBusqueda('')}>&times;</button>
                                </div>
                            )}
                        </div>
                    )}

                    {esAdmin && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                            <button
                                className="btn-filtro"
                                style={{ backgroundColor: '#25D366', color: '#fff', borderColor: '#25D366', boxShadow: '0 4px 10px rgba(37, 211, 102, 0.25)' }}
                                onClick={() => setMostrarModalAlta(true)}
                            >
                                ➕ Agregar Nuevo Producto
                            </button>
                        </div>
                    )}

                    {errorConexion ? (
                        <div style={{ width: '100%', textAlign: 'center', padding: '50px' }}>
                            <h3 style={{ color: '#ff5722' }}>Error de conexión</h3>
                            <p style={{ color: '#666' }}>No pudimos cargar el catálogo. Verificá que el json-server esté corriendo.</p>
                        </div>
                    ) : (
                        <div className="contenedor-productos">
                            {productosPaginados.length === 0 ? (
                                <p style={{ width: '100%', textAlign: 'center', color: '#666', marginTop: '20px' }}>No se encontraron productos.</p>
                            ) : (
                                productosPaginados.map(prod => (
                                    <ProductCard
                                        key={prod.id}
                                        producto={prod}
                                        onOpenModal={(p) => setSelectedProduct(p)}
                                        esAdmin={esAdmin}
                                        onProductDeleted={refrescarCatalogo}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {totalPaginas > 1 && (
                        <div className="paginacion-estilos">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                                <button
                                    key={num}
                                    className={`btn-pagina ${num === paginaActual ? 'activo' : ''}`}
                                    onClick={() => {
                                        setPaginaActual(num);
                                        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                <ServiceSection />

                <section id="ofertas">
                    <h2>Ofertas y novedades</h2>
                    <div className="carrusel-contenedor">
                        <button className="carrusel-btn" id="btn-prev" onClick={() => carruselRef.current?.scrollBy({ left: -240, behavior: 'smooth' })}>&lt;</button>
                        <div className="carrusel-track" ref={carruselRef}>
                            {catalogo.slice(-8).reverse().map(prod => (
                                <ProductOfferCard key={`oferta-${prod.id}`} producto={prod} onOpenModal={(p) => setSelectedProduct(p)} />
                            ))}
                        </div>
                        <button className="carrusel-btn" id="btn-next" onClick={() => carruselRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}>&gt;</button>
                    </div>
                </section>
            </main>

            <Footer />

            {selectedProduct && (
                <ProductModal producto={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}

            {mostrarModalAlta && (
                <AddProductModal onClose={() => setMostrarModalAlta(false)} onProductAdded={refrescarCatalogo} />
            )}
        </div>
    );
}