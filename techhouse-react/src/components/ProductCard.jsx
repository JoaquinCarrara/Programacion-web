import React, { useState } from 'react';

export default function ProductCard({ producto, onOpenModal }) {
    const [cantidad, setCantidad] = useState(1);
    const estaDisponible = producto.stock > 0;
    const precioFormateado = '$' + producto.precio.toLocaleString('es-AR');

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
            </div>
        </article>
    );
}