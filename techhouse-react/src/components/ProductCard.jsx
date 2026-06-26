import React, { useState } from 'react';

export default function ProductCard({ producto, onOpenModal, esAdmin, onProductDeleted }) {
    const [cantidad, setCantidad] = useState(1);
    const estaDisponible = producto.stock > 0;
    const precioFormateado = '$' + producto.precio.toLocaleString('es-AR');

    const manejarBorrado = () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}" del catálogo?`)) {
            fetch(`http://localhost:8080/productos/${producto.id}`, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error();
                    alert('Producto eliminado correctamente.');
                    onProductDeleted(); // Notifica a TiendaHome para refrescar la lista
                })
                .catch(() => alert('⚠️ No se pudo eliminar el producto del servidor.'));
        }
    };

    return (
        <article className={estaDisponible ? 'moderna' : 'moderna sin-stock'}>
            <img src={producto.imagen} alt={producto.nombre} style={{ cursor: 'pointer' }} onClick={() => onOpenModal(producto)} />
            <div className="card-contenido">
                <p className="card-marca">{producto.marca}</p>
                <h3 className="card-titulo" style={{ cursor: 'pointer' }} onClick={() => onOpenModal(producto)}>{producto.nombre}</h3>
                <p className="card-precio">{precioFormateado}</p>
                <p className={estaDisponible ? 'card-stock' : 'card-stock agotado'}>
                    {estaDisponible ? `Stock: ${producto.stock}` : 'Agotado'}
                </p>

                {!esAdmin && (
                    <div className="controles-compra">
                        <input
                            type="number" min="1" max={producto.stock} value={cantidad}
                            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                            className="card-input" disabled={!estaDisponible}
                        />
                        <button className="card-btn" disabled={!estaDisponible}>
                            {estaDisponible ? "Comprar" : "Sin Stock"}
                        </button>
                    </div>
                )}

                {esAdmin && (
                    <button
                        onClick={manejarBorrado}
                        className="card-btn"
                        style={{ backgroundColor: '#d9534f', marginTop: '10px' }}
                    >
                        🗑️ Eliminar Producto
                    </button>
                )}
            </div>
        </article>
    );
}
