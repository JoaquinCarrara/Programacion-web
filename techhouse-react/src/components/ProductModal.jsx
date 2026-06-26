import React from 'react';

export default function ProductModal({ producto, onClose }) {
    if (!producto) return null;
    const precioFormateado = '$' + producto.precio.toLocaleString('es-AR');

    return (
        <div className="modal-activo" onClick={(e) => e.target.className === 'modal-activo' && onClose()}>
            <div className="modal-contenido">
                <button className="btn-cerrar" onClick={onClose}>&times;</button>
                <div className="modal-grid">
                    <div className="modal-imagen-contenedor">
                        <img src={producto.imagen} alt={producto.nombre} />
                    </div>
                    <div className="modal-info">
                        <span className="etiqueta-naranja" style={{ display: 'inline-block', marginBottom: '10px', fontSize: '0.8rem' }}>
                            {producto.categoria}
                        </span>
                        <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>{producto.nombre}</h3>
                        <p className="card-precio" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{precioFormateado}</p>
                        <div style={{ borderTop: '1px solid #eee', margin: '20px 0' }}></div>
                        <h4 style={{ marginBottom: '15px', color: '#333' }}>Especificaciones Técnicas</h4>
                        <ul className="lista-specs">
                            {Object.entries(producto.especificaciones || {}).map(([clave, valor]) => {
                                if (valor === null || valor === undefined || valor === "") return null;
                                let nombreAmigable = clave.replace(/([A-Z])/g, ' $1').trim();
                                nombreAmigable = nombreAmigable.charAt(0).toUpperCase() + nombreAmigable.slice(1);
                                return (
                                    <li key={clave}>
                                        <strong>{nombreAmigable}:</strong> {String(valor)}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}