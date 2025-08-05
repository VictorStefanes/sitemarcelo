// ===========================================
// SISTEMA DE AUTENTICAÇÃO SIMPLES
// ===========================================

class AuthSystem {
    constructor() {
        // Usa configuração dinâmica se disponível, senão fallback
        this.apiBaseURL = window.Config ? window.Config.apiBaseURL : 'http://localhost:5001';
        
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
        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Click fora do modal para fechar
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target.id === 'loginModal') {
                    this.closeModal();
                }
            });
        }

        // Navegação entre formulários
        const showRegisterForm = document.getElementById('showRegisterForm');
        if (showRegisterForm) {
            showRegisterForm.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForm('register');
            });
        }

        const showLoginForm = document.getElementById('showLoginForm');
        if (showLoginForm) {
            showLoginForm.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForm('login');
            });
        }

        const showForgotForm = document.getElementById('showForgotForm');
        if (showForgotForm) {
            showForgotForm.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForm('forgot');
            });
        }

        const backToLogin = document.getElementById('backToLogin');
        if (backToLogin) {
            backToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForm('login');
            });
        }

        // Formulário de Login
        const loginFormElement = document.getElementById('loginFormElement');
        if (loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📝 Formulário de login submetido');
                this.handleLogin(e);
            });
            console.log('✅ Event listener do formulário de login configurado');
        } else {
            console.error('❌ Formulário de login não encontrado');
        }

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
        console.log('🔐 handleLogin chamado');
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = document.getElementById('loginSubmit');
        
        this.setLoading(submitBtn, true);
        this.clearMessages();

        const loginData = {
            username: formData.get('username').trim(),
            senha: formData.get('senha')
        };

        console.log('🔐 Dados de login:', { username: loginData.username, senha: '***' });

        // Credenciais fixas - apenas Marcelo pode acessar
        const validCredentials = {
            username: 'marcelo',
            password: 'marcelo123!'
        };

        // Verifica se as credenciais são exatamente as do Marcelo
        if (loginData.username === validCredentials.username && loginData.senha === validCredentials.password) {
            console.log('✅ Login autorizado para Marcelo');
            this.handleLoginSuccess(loginData.username);
            this.setLoading(submitBtn, false);
            return;
        } else {
            console.log('❌ Credenciais inválidas - acesso negado');
            this.showMessage('error', 'Acesso restrito. Use: marcelo / marcelo123', 'loginForm');
            this.setLoading(submitBtn, false);
            return;
        }
    }

    handleLoginSuccess(username) {
        console.log('🎉 handleLoginSuccess chamado para:', username);
        
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAuthenticated: true
        };

        localStorage.setItem('user_session', JSON.stringify(sessionData));
        localStorage.setItem('session_time', new Date().getTime().toString());

        this.isLoggedIn = true;
        this.showMessage('success', 'Login realizado com sucesso! Redirecionando...', 'loginForm');

        console.log('� URL atual:', window.location.href);
        console.log('🎯 Dashboard URL configurado:', this.dashboardURL);

        // Tenta diferentes caminhos para o dashboard
        const possiblePaths = [
            './dashboard.html',
            '../dashboard.html', 
            '/html/dashboard.html',
            'dashboard.html'
        ];

        let finalDashboardURL = this.dashboardURL;
        
        // Se estamos em /html/, usa caminho relativo simples
        if (window.location.pathname.includes('/html/')) {
            finalDashboardURL = './dashboard.html';
        }

        console.log('🔄 Redirecionando para:', finalDashboardURL);

        setTimeout(() => {
            try {
                window.location.href = finalDashboardURL;
                console.log('✅ Redirecionamento executado');
            } catch (error) {
                console.error('❌ Erro no redirecionamento:', error);
                // Fallback
                window.location.href = './dashboard.html';
            }
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
    } else {
        console.error('❌ Botão de login não encontrado');
    }
    
    // Função de debug
    window.testModal = () => {
        console.log('🧪 Teste manual do modal');
        window.authSystem.openModal();
    };
    
    // Função de teste de login
    window.testLogin = () => {
        console.log('🧪 Teste de login com credenciais admin/admin123');
        const loginData = { username: 'admin', senha: 'admin123' };
        
        const testCredentials = {
            'admin': 'admin123',
            'marcelo': 'marcelo123',
            'teste': '123456'
        };
        
        if (testCredentials[loginData.username] === loginData.senha) {
            console.log('✅ Credenciais válidas');
            window.authSystem.handleLoginSuccess(loginData.username);
        } else {
            console.log('❌ Credenciais inválidas');
        }
    };
    
    console.log('💡 Funções de teste disponíveis:');
    console.log('   - testModal() - Abre o modal');
    console.log('   - testLogin() - Testa login direto');
});
