document.getElementById('form-login').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que la página recargue al hacer clic

    const btn = document.querySelector('.btn-submit');
    btn.textContent = 'Verificando...';
    btn.style.backgroundColor = '#4CAF50'; // Se pone verde para dar feedback

    // Simula una carga estática y vuelve al inicio
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});