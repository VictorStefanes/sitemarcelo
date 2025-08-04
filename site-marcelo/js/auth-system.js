// ===========================================
// SISTEMA DE AUTENTICAÇÃO COMPLETO
// ===========================================

class AuthSystem {
    constructor() {
        this.apiBaseURL = 'http://localhost:5001'; // Backend Flask properties_api.py
        this.dashboardURL = 'dashboard.html';
        
        // Limpa qualquer sessão anterior para garantir que sempre comece com modal
        this.logout();
        
        this.isLoggedIn = this.checkAuthStatus();
        
        console.log('🚀 AuthSystem inicializado');
        console.log('🌐 API URL:', this.apiBaseURL);
        console.log('👤 Status inicial:', this.isLoggedIn ? 'Logado' : 'Não logado');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateLoginButton();
        this.setupPasswordToggles();
    }

    // ===========================================
    // VERIFICAÇÃO DE AUTENTICAÇÃO
    // ===========================================
    checkAuthStatus() {
        const session = localStorage.getItem('user_session');
        const sessionTime = localStorage.getItem('session_time');
        
        if (session && sessionTime) {
            // Verifica se a sessão não expirou (24 horas)
            const now = new Date().getTime();
            const sessionStart = parseInt(sessionTime);
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
            
            if (now - sessionStart < sessionDuration) {
                console.log('✅ Sessão válida encontrada');
                return true;
            } else {
                // Sessão expirada
                console.log('⏰ Sessão expirada - fazendo logout');
                this.logout();
                return false;
            }
        }
        
        console.log('❌ Nenhuma sessão encontrada');
        return false;
    }

    updateLoginButton() {
        const loginBtn = document.getElementById('login-btn');
        const icon = loginBtn.querySelector('i');
        
        if (this.isLoggedIn) {
            // Usuário logado - botão de dashboard
            icon.className = 'fas fa-tachometer-alt';
            loginBtn.setAttribute('aria-label', 'Dashboard');
            loginBtn.title = 'Ir para o Dashboard';
        } else {
            // Usuário não logado - botão de login
            icon.className = 'fas fa-user';
            loginBtn.setAttribute('aria-label', 'Login');
            loginBtn.title = 'Fazer Login';
        }
    }

    // ===========================================
    // EVENT LISTENERS
    // ===========================================
    setupEventListeners() {
        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Click fora do modal para fechar
        document.getElementById('loginModal').addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                this.closeModal();
            }
        });

        // Navegação entre formulários
        document.getElementById('showRegisterForm').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('register');
        });

        document.getElementById('showLoginForm').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        document.getElementById('showForgotForm').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('forgot');
        });

        document.getElementById('backToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        // Formulários
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        document.getElementById('forgotFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword(e);
        });

        // ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetId = button.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = button.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    // ===========================================
    // MODAL MANAGEMENT
    // ===========================================
    openModal() {
        document.getElementById('loginModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('loginModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.clearForms();
    }

    showForm(formType) {
        // Esconde todos os formulários
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        // Mostra o formulário solicitado
        document.getElementById(`${formType}Form`).classList.add('active');
        
        // Limpa mensagens de erro
        this.clearMessages();
    }

    clearForms() {
        document.querySelectorAll('.auth-form form').forEach(form => {
            form.reset();
        });
        this.clearMessages();
    }

    clearMessages() {
        document.querySelectorAll('.error-message, .success-message').forEach(msg => {
            msg.remove();
        });
    }

    // ===========================================
    // AUTENTICAÇÃO - LOGIN
    // ===========================================
    async handleLogin(e) {
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = document.getElementById('loginSubmit');
        
        this.setLoading(submitBtn, true);
        this.clearMessages();

        const loginData = {
            username: formData.get('username').trim(),
            senha: formData.get('senha')
        };

        console.log('🔐 Tentando login:', loginData);
        console.log('🌐 URL da API:', `${this.apiBaseURL}/auth/login`);

        try {
            const response = await fetch(`${this.apiBaseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            console.log('📥 Resposta do servidor:', data);

            if (response.ok) {
                // Login bem-sucedido
                this.handleLoginSuccess(loginData.username);
            } else {
                // Erro no login
                this.showMessage('error', data.erro || 'Erro no login', 'loginForm');
            }
        } catch (error) {
            console.error('❌ Erro na requisição de login:', error);
            this.showMessage('error', 'Erro de conexão. Verifique se o servidor está rodando.', 'loginForm');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    handleLoginSuccess(username) {
        // Salva dados da sessão
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAuthenticated: true
        };

        localStorage.setItem('user_session', JSON.stringify(sessionData));
        localStorage.setItem('session_time', new Date().getTime().toString());

        // Atualiza estado
        this.isLoggedIn = true;
        this.updateLoginButton();

        // Mostra mensagem de sucesso
        this.showMessage('success', 'Login realizado com sucesso! Redirecionando...', 'loginForm');

        // Redireciona para o dashboard após 1.5 segundos
        setTimeout(() => {
            window.location.href = this.dashboardURL;
        }, 1500);
    }

    // ===========================================
    // AUTENTICAÇÃO - CADASTRO
    // ===========================================
    async handleRegister(e) {
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = document.getElementById('registerSubmit');
        
        this.setLoading(submitBtn, true);
        this.clearMessages();

        // Validação de senhas
        const senha = formData.get('senha');
        const confirmaSenha = formData.get('confirma_senha');

        if (senha !== confirmaSenha) {
            this.showMessage('error', 'As senhas não coincidem!', 'registerForm');
            this.setLoading(submitBtn, false);
            return;
        }

        const registerData = {
            username: formData.get('username').trim(),
            email: formData.get('email').trim(),
            senha: senha,
            confirma_senha: confirmaSenha
        };

        try {
            const response = await fetch(`${this.apiBaseURL}/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (response.ok) {
                // Cadastro bem-sucedido
                this.showMessage('success', data.mensagem + ' Você pode fazer login agora!', 'registerForm');
                
                // Volta para o formulário de login após 2 segundos
                setTimeout(() => {
                    this.showForm('login');
                    
                    // Pré-preenche o username
                    document.getElementById('loginUsername').value = registerData.username;
                }, 2000);
            } else {
                // Erro no cadastro
                this.showMessage('error', data.erro || 'Erro no cadastro', 'registerForm');
            }
        } catch (error) {
            console.error('Erro na requisição de cadastro:', error);
            this.showMessage('error', 'Erro de conexão. Verifique se o servidor está rodando.', 'registerForm');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    // ===========================================
    // RECUPERAÇÃO DE SENHA
    // ===========================================
    async handleForgotPassword(e) {
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = document.getElementById('forgotSubmit');
        
        this.setLoading(submitBtn, true);
        this.clearMessages();

        const email = formData.get('email').trim();

        // Simulação - você pode implementar a funcionalidade real no backend
        setTimeout(() => {
            this.showMessage('success', 
                'Se este e-mail estiver cadastrado, você receberá instruções para recuperar sua senha.', 
                'forgotForm'
            );
            this.setLoading(submitBtn, false);
            
            // Volta para o login após 3 segundos
            setTimeout(() => {
                this.showForm('login');
            }, 3000);
        }, 1500);
    }

    // ===========================================
    // LOGOUT
    // ===========================================
    logout() {
        localStorage.removeItem('user_session');
        localStorage.removeItem('session_time');
        this.isLoggedIn = false;
        this.updateLoginButton();
        
        // Se estiver no dashboard, redireciona para home
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }

    // ===========================================
    // UI HELPERS
    // ===========================================
    setLoading(button, loading) {
        const span = button.querySelector('span');
        const spinner = button.querySelector('.loading-spinner');
        
        if (loading) {
            span.style.display = 'none';
            spinner.style.display = 'inline-block';
            button.disabled = true;
        } else {
            span.style.display = 'inline';
            spinner.style.display = 'none';
            button.disabled = false;
        }
    }

    showMessage(type, message, formId) {
        // Remove mensagens anteriores
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        const form = document.getElementById(formId);
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto-remove após 5 segundos se for erro
        if (type === 'error') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    // ===========================================
    // PUBLIC METHODS
    // ===========================================
    getUserData() {
        const session = localStorage.getItem('user_session');
        return session ? JSON.parse(session) : null;
    }

    redirectToDashboard() {
        console.log('🔍 Verificando status de login:', this.isLoggedIn);
        console.log('📦 Dados da sessão:', {
            session: localStorage.getItem('user_session'),
            sessionTime: localStorage.getItem('session_time')
        });
        
        if (this.isLoggedIn) {
            console.log('✅ Usuário logado - redirecionando para dashboard');
            window.location.href = this.dashboardURL;
        } else {
            console.log('❌ Usuário não logado - abrindo modal de login');
            this.openModal();
        }
    }
}

// ===========================================
// INICIALIZAÇÃO E ESTILO DO MODAL
// ===========================================

// Estilos CSS para o sistema de autenticação
const authStyles = `
<style>
/* Modal Styles */
.modal {
    display: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: #ffffff;
    margin: 5% auto;
    border-radius: 20px;
    width: 90%;
    max-width: 450px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-header {
    background: linear-gradient(135deg, #d4af37, #f4e4a6);
    color: #2c3e50;
    padding: 20px 25px;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.close {
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close:hover {
    background: rgba(44, 62, 80, 0.1);
    transform: scale(1.1);
}

.modal-body {
    padding: 30px 25px;
}

/* Form Styles */
.auth-form {
    display: none;
}

.auth-form.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.auth-form h3 {
    margin: 0 0 25px 0;
    color: #2c3e50;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-group input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    transition: all 0.3s ease;
    background: #f8f9fa;
}

.form-group input:focus {
    outline: none;
    border-color: #d4af37;
    background: white;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-group small {
    color: #666;
    font-size: 0.8rem;
    margin-top: 5px;
    display: block;
}

.password-container {
    position: relative;
}

.toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 5px;
    transition: color 0.3s ease;
}

.toggle-password:hover {
    color: #d4af37;
}

/* Button Styles */
.btn-auth {
    width: 100%;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.btn-login {
    background: linear-gradient(135deg, #d4af37, #f4e4a6);
    color: #2c3e50;
}

.btn-register {
    background: linear-gradient(135deg, #3498db, #5dade2);
    color: white;
}

.btn-forgot {
    background: linear-gradient(135deg, #e67e22, #f39c12);
    color: white;
}

.btn-auth:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-auth:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

/* Loading Spinner */
.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Auth Links */
.auth-links {
    text-align: center;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.auth-links a {
    color: #d4af37;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.auth-links a:hover {
    color: #b8941f;
    text-decoration: underline;
}

/* Message Styles */
.error-message, .success-message {
    padding: 12px 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
}

.error-message {
    background: #fee;
    color: #c53030;
    border: 1px solid #feb2b2;
}

.success-message {
    background: #f0fff4;
    color: #2f855a;
    border: 1px solid #9ae6b4;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-content {
        margin: 2% auto;
        width: 95%;
        max-width: none;
    }
    
    .modal-body {
        padding: 20px 15px;
    }
    
    .modal-header {
        padding: 15px 20px;
    }
    
    .modal-header h2 {
        font-size: 1.1rem;
    }
}
</style>
`;

// Adiciona os estilos ao documento
document.head.insertAdjacentHTML('beforeend', authStyles);

// Inicializa o sistema de autenticação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    
    // Adiciona funcionalidade ao botão de login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.authSystem.redirectToDashboard();
        });
    }
});
