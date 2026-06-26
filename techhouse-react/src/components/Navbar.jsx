import React from 'react';

export default function Navbar({ carritoContador = 0 }) {
    return (
        <nav className="navbar">
            <div className="logo">TechHouse</div>
            <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#catalogo">Productos</a></li>
                <li><a href="#ofertas">Ofertas</a></li>
                <li><a href="#contacto">Contacto</a></li>
            </ul>
            <div className="carrito-nav" title="Ver carrito">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="carrito-contador">{carritoContador}</span>
            </div>
        </nav>
    );
}