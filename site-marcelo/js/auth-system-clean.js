// ===========================================
// SISTEMA DE AUTENTICAÇÃO SIMPLES
// ===========================================

class AuthSystem {
    constructor() {
        this.apiBaseURL = 'http://localhost:5001';
        
        // Detecta o caminho correto para o dashboard
        const currentPath = window.location.pathname;
        if (currentPath.includes('/html/')) {
            this.dashboardURL = './dashboard.html';
        } else {
            this.dashboardURL = './html/dashboard.html';
        }
        
        console.log('🚀 AuthSystem inicializado');
        console.log('🎯 Dashboard URL:', this.dashboardURL);
        
        this.isLoggedIn = this.checkAuthStatus();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggles();
    }

    checkAuthStatus() {
        const session = localStorage.getItem('user_session');
        const sessionTime = localStorage.getItem('session_time');
        
        if (session && sessionTime) {
            const now = new Date().getTime();
            const sessionStart = parseInt(sessionTime);
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
            
            if (now - sessionStart < sessionDuration) {
                return true;
            } else {
                this.logout();
                return false;
            }
        }
        return false;
    }

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

    openModal() {
        console.log('🔓 Abrindo modal de login');
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.showForm('login');
            console.log('✅ Modal aberto');
        } else {
            console.error('❌ Modal não encontrado');
        }
    }

    closeModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.clearForms();
        }
    }

    showForm(formType) {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${formType}Form`).classList.add('active');
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

        // Credenciais de teste
        const testCredentials = {
            'admin': 'admin123',
            'marcelo': 'marcelo123',
            'teste': '123456'
        };

        // Verifica credenciais de teste
        if (testCredentials[loginData.username] === loginData.senha) {
            console.log('✅ Login local bem-sucedido');
            this.handleLoginSuccess(loginData.username);
            this.setLoading(submitBtn, false);
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                this.handleLoginSuccess(loginData.username);
            } else {
                this.showMessage('error', data.erro || 'Erro no login', 'loginForm');
            }
        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            this.showMessage('error', 'Credenciais inválidas. Teste: admin/admin123', 'loginForm');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    handleLoginSuccess(username) {
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAuthenticated: true
        };

        localStorage.setItem('user_session', JSON.stringify(sessionData));
        localStorage.setItem('session_time', new Date().getTime().toString());

        this.isLoggedIn = true;
        this.showMessage('success', 'Login realizado com sucesso! Redirecionando...', 'loginForm');

        console.log('🔄 Redirecionando para:', this.dashboardURL);

        setTimeout(() => {
            window.location.href = this.dashboardURL;
        }, 1500);
    }

    logout() {
        localStorage.removeItem('user_session');
        localStorage.removeItem('session_time');
        this.isLoggedIn = false;
    }

    setLoading(button, loading) {
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('span');
        
        if (loading) {
            spinner.style.display = 'inline-block';
            text.style.display = 'none';
            button.disabled = true;
        } else {
            spinner.style.display = 'none';
            text.style.display = 'inline';
            button.disabled = false;
        }
    }

    showMessage(type, message, formId) {
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            margin: 10px 0;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
            color: white;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
        `;
        
        const form = document.getElementById(formId);
        form.appendChild(messageDiv);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado - inicializando AuthSystem');
    window.authSystem = new AuthSystem();
    
    // Botão de login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔘 Botão de login clicado');
            window.authSystem.openModal();
        });
        console.log('✅ Event listener do login configurado');
    }
    
    // Função de debug
    window.testModal = () => {
        console.log('🧪 Teste manual do modal');
        window.authSystem.openModal();
    };
    
    console.log('💡 Para testar modal: testModal()');
});
