document.getElementById('form-login').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.querySelector('.btn-submit');
    btn.textContent = 'Verificando...';
    btn.style.backgroundColor = '#4CAF50';

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});