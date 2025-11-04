document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await registrar(nome, email, senha);
    console.log('Registro bem sucedido:', response);
    
    // Redirecionar para login após registro
    window.location.href = '/login.html';
  } catch (error) {
    console.error('Falha no registro:', error);
    alert('Erro ao registrar usuário. Por favor tente novamente.');
  }
});