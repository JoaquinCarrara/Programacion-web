import React, { useState } from 'react';

export default function AddProductModal({ onClose, onProductAdded }) {
    const [nombre, setNombre] = useState('');
    const [marca, setMarca] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('notebook');
    const [imagen, setImagen] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Estructuramos el objeto PLANO con todas las columnas que espera tu base de datos relacional
        const nuevoProducto = {
            categoria: categoria,
            nombre: nombre,
            marca: marca,
            precio: parseInt(precio) || 0,
            stock: parseInt(stock) || 0,
            imagen: imagen || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&q=80',

            // Enviamos campos como nulos para que coincidan con la estructura de las columnas SQL
            procesador: null,
            ram: null,
            almacenamiento: null,
            pantalla: null,
            bateria: null,
            camara: null,
            tipo_auricular: null,
            bluetooth: null,
            anc: null
        };

        fetch('http://localhost:8080/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('La base de datos rechazó la inserción.');
                }
                return res.json();
            })
            .then(data => {
                alert('¡Producto agregado con éxito a la base de datos!');
                onProductAdded();
                onClose();
            })
            .catch((error) => {
                console.error("Error en la petición:", error);
                alert('⚠️ Error al guardar el producto en el servidor.');
            });
    };

    return (
        <div className="modal-activo" onClick={(e) => e.target.className === 'modal-activo' && onClose()}>
            <div className="modal-contenido" style={{ maxWidth: '500px', padding: '30px' }}>
                <button className="btn-cerrar" onClick={onClose}>&times;</button>
                <h3 style={{ marginBottom: '20px', color: '#2D3238' }}>Agregar Nuevo Producto</h3>

                <form onSubmit={handleSubmit} className="login-box" style={{ background: 'none', border: 'none', padding: 0, boxShadow: 'none', maxWidth: '100%', color: '#333' }}>
                    <div className="input-group">
                        <label style={{ color: '#333' }}>Categoría</label>
                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', marginBottom: '15px' }}>
                            <option value="notebook">Notebook</option>
                            <option value="celular">Celular</option>
                            <option value="auricular">Auricular</option>
                            <option value="monitor">Monitor</option>
                            <option value="pc_escritorio">PC de Escritorio</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label style={{ color: '#333' }}>Nombre del Producto</label>
                        <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ color: '#000', background: '#fff', borderColor: '#ccc' }} />
                    </div>

                    <div className="input-group">
                        <label style={{ color: '#333' }}>Marca</label>
                        <input type="text" required value={marca} onChange={(e) => setMarca(e.target.value)} style={{ color: '#000', background: '#fff', borderColor: '#ccc' }} />
                    </div>

                    <div className="input-group">
                        <label style={{ color: '#333' }}>Precio ($)</label>
                        <input type="number" required min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} style={{ color: '#000', background: '#fff', borderColor: '#ccc' }} />
                    </div>

                    <div className="input-group">
                        <label style={{ color: '#333' }}>Stock Inicial</label>
                        <input type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)} style={{ color: '#000', background: '#fff', borderColor: '#ccc' }} />
                    </div>

                    <div className="input-group">
                        <label style={{ color: '#333' }}>URL de la Imagen</label>
                        <input type="url" placeholder="https://..." value={imagen} onChange={(e) => setImagen(e.target.value)} style={{ color: '#000', background: '#fff', borderColor: '#ccc' }} />
                    </div>

                    <button type="submit" className="btn-submit" style={{ marginTop: '15px' }}>Guardar Producto</button>
                </form>
            </div>
        </div>
    );
}