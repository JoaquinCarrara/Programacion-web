import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [esModoLogin, setEsModoLogin] = useState(true);

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [recordar, setRecordar] = useState(false);

    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setExito('');
        setCargando(true);

        const usuariosRegistrados = JSON.parse(localStorage.getItem('techHouse_lista_usuarios')) || [];

        setTimeout(() => {
            if (!esModoLogin) {
                if (password !== confirmPassword) {
                    setError('⚠️ Las contraseñas no coinciden.');
                    setCargando(false);
                    return;
                }

                const usuarioExiste = usuariosRegistrados.some(u => u.email.toLowerCase() === usuario.trim().toLowerCase());
                if (usuarioExiste || usuario.trim().toLowerCase() === 'admin@techhouse.com') {
                    setError('⚠️ Este correo electrónico ya está registrado.');
                    setCargando(false);
                    return;
                }

                const nuevoUsuario = { email: usuario.trim(), password: password };
                usuariosRegistrados.push(nuevoUsuario);
                localStorage.setItem('techHouse_lista_usuarios', JSON.stringify(usuariosRegistrados));

                setExito('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
                setCargando(false);
                setEsModoLogin(true);
                setPassword('');
                setConfirmPassword('');
            } else {
                const usuarioValido = usuariosRegistrados.find(
                    u => u.email.toLowerCase() === usuario.trim().toLowerCase() && u.password === password
                );

                if ((usuario.trim().toLowerCase() === 'admin@techhouse.com' && password === '123456') || usuarioValido) {
                    const userData = {
                        email: usuario.trim(),
                        loggedAt: new Date().toISOString()
                    };

                    if (recordar) {
                        localStorage.setItem('techHouse_user', JSON.stringify(userData));
                    } else {
                        sessionStorage.setItem('techHouse_user', JSON.stringify(userData));
                    }

                    setCargando(false);
                    navigate('/');
                } else {
                    setCargando(false);
                    setError('⚠️ Usuario o contraseña incorrectos.');
                }
            }
        }, 1200);
    };

    const cambiarModo = () => {
        setEsModoLogin(!esModoLogin);
        setError('');
        setExito('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="pagina-login">
            <div className="login-container">
                <div className="login-box">
                    <h2>
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                            Bienvenidos a Tech House
                        </a>
                    </h2>
                    <p>{esModoLogin ? 'Ingresa a tu cuenta para continuar' : 'Completa los datos para registrarte'}</p>

                    {error && <p style={{ color: '#ff5722', fontWeight: '600', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}
                    {exito && <p style={{ color: '#25D366', fontWeight: '600', marginBottom: '15px', fontSize: '0.9rem' }}>{exito}</p>}

                    <form id="form-login" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="usuario">Usuario o Email</label>
                            <input
                                type="email"
                                id="usuario"
                                placeholder="Ej: usuario@correo.com"
                                required
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                disabled={cargando}
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
                                disabled={cargando}
                            />
                        </div>

                        {!esModoLogin && (
                            <div className="input-group" style={{ animation: 'aparecerFiltro 0.3s ease-out' }}>
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={cargando}
                                />
                            </div>
                        )}

                        {esModoLogin && (
                            <div className="opciones">
                                <label className="recordar">
                                    <input
                                        type="checkbox"
                                        id="recordar"
                                        checked={recordar}
                                        onChange={(e) => setRecordar(e.target.checked)}
                                        disabled={cargando}
                                    /> Guardar sesión
                                </label>
                                <a href="#" className="olvide" onClick={(e) => e.preventDefault()}>¿Olvidaste tu clave?</a>
                            </div>
                        )}

                        <button type="submit" className="btn-submit" style={{ marginTop: esModoLogin ? '0px' : '15px' }} disabled={cargando}>
                            {cargando ? 'Procesando...' : esModoLogin ? 'Iniciar Sesión' : 'Registrarse'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#ccc' }}>
                        {esModoLogin ? (
                            <span>¿No tienes cuenta? <a href="#registro" onClick={(e) => { e.preventDefault(); cambiarModo(); }} style={{ color: '#ff5722', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</a></span>
                        ) : (
                            <span>¿Ya tienes cuenta? <a href="#login" onClick={(e) => { e.preventDefault(); cambiarModo(); }} style={{ color: '#ff5722', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión</a></span>
                        )}
                    </div>

                    <div className="volver">
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                            ← Volver a la tienda
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}