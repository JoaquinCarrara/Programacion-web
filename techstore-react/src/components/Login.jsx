import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Sumamos esto

export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [recordar, setRecordar] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ usuario, password, recordar });
        navigate('/');
    };

    return (
        <div className="pagina-login">
            <div className="login-container">
                <div className="login-box">
                    <h2>
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Bienvenidos a Tech House</a>
                    </h2>
                    <p>Ingresa a tu cuenta para continuar</p>

                    <form id="form-login" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="usuario">Usuario o Email</label>
                            <input
                                type="text"
                                id="usuario"
                                placeholder="Ej: usuario@correo.com"
                                required
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="opciones">
                            <label className="recordar">
                                <input
                                    type="checkbox"
                                    id="recordar"
                                    checked={recordar}
                                    onChange={(e) => setRecordar(e.target.checked)}
                                /> Guardar contraseña
                            </label>
                            <a href="#" className="olvide">¿Olvidaste tu clave?</a>
                        </div>

                        <button type="submit" className="btn-submit">Iniciar Sesión</button>
                    </form>

                    <div className="volver">
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>← Volver a la tienda</a>
                    </div>
                </div>
            </div>
        </div>
    );
}