import { useState } from "react";
import { Navigate, Link } from "react-router-dom";

function Header() {
    return (
        <header>
            <section className="banner-principal">

                <div className="banner-principal" style={{ position: 'relative' }}>
                    <img src="." alt="Portada de Tech House" className="banner-img" />

                    <a href="login.html" className="btn-login-banner">Iniciar Sesión</a>
                </div>
            </section>
        </header>
    )
}

export default Header;