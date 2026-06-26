import React from 'react';

export default function ProductOfferCard({ producto, onOpenModal }) {
    const precioFormateado = '$' + producto.precio.toLocaleString('es-AR');
    const precioViejoNum = Math.round(producto.precio * 1.15);
    const precioViejoFormateado = '$' + precioViejoNum.toLocaleString('es-AR');

    return (
        <article className="moderna-mini">
            <span className="badge-oferta">15% OFF</span>
            <img src={producto.imagen} alt={producto.nombre} />
            <div className="card-contenido">
                <h3 className="card-titulo">{producto.nombre}</h3>
                <span className="precio-viejo">{precioViejoFormateado}</span>
                <p className="card-precio">{precioFormateado}</p>
                <button className="card-btn" onClick={() => onOpenModal(producto)}>
                    Ver Oferta
                </button>
            </div>
        </article>
    );
}