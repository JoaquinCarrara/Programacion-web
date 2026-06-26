import React from 'react';

export default function ServiceSection() {
    return (
        <section id="servicio-tecnico" className="seccion-oscura">
            <div className="servicio-contenedor">
                <div className="servicio-texto">
                    <span className="etiqueta-naranja">Soporte Especializado</span>
                    <h2>Reparación y Optimización de Equipos</h2>
                    <p>No solo te ofrecemos los mejores componentes del mercado, también contamos con un laboratorio técnico para darle una segunda vida a tu computadora o armar tu setup desde cero.</p>
                    <ul className="lista-servicios">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Solución a fallos de inicio de Windows y pantallas azules (errores de registro).
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Análisis de rendimiento, testeo de memoria RAM y optimización de sistema.
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Armado de PCs a medida, limpieza profunda y cambio de pasta térmica.
                        </li>
                    </ul>
                    <a href="#contacto" className="btn-primario">Consultar por WhatsApp</a>
                </div>
                <div className="servicio-imagen">
                    <img src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800" alt="Técnico reparando una computadora" />
                </div>
            </div>
        </section>
    );
}