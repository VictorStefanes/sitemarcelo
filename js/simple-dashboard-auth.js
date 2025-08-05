/**
 * SISTEMA DE AUTENTICAÇÃO SIMPLIFICADO PARA DASHBOARD
 * Login direto com credenciais hardcoded para o corretor
 */

class SimpleDashboardAuth {
    constructor() {
        this.sessionKey = 'dashboardSession';
        this.sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
        this.validCredentials = {
            username: 'marcelo',
            password: 'marcelo123!'
        };
        
        this.init();
    }

    init() {
        // Verifica se está na página de dashboard
        if (!this.isDashboardPage()) {
            console.log('📍 Não é página de dashboard, auth não inicializada');
            return;
        }
        
        // Evita loops de inicialização
        if (this.isInitializing) {
            console.log('⚠️ Auth já inicializando, ignorando...');
            return;
        }
        this.isInitializing = true;
        
        console.log('🔐 Inicializando autenticação do dashboard...');
        
        // Aguarda um breve momento para garantir que o DOM carregou
        setTimeout(() => {
            // Verifica se já está autenticado
            if (this.isAuthenticated()) {
                this.showDashboard();
            } else {
                this.showLoginForm();
            }
            this.isInitializing = false;
        }, 100);
    }

    isDashboardPage() {
        const path = window.location.pathname.toLowerCase();
        const filename = path.split('/').pop();
        
        return filename === 'dashboard.html' || 
               path.includes('/dashboard') || 
               path.includes('admin') ||
               filename === 'dashboard';
    }

    isAuthenticated() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            // Verifica se a sessão não expirou
            if (now > sessionData.expiresAt) {
                this.logout();
                return false;
            }
            
            return sessionData.authenticated === true;
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
            this.logout();
            return false;
        }
    }

    login(username, password) {
        if (username === this.validCredentials.username && 
            password === this.validCredentials.password) {
            
            // Cria sessão
            const sessionData = {
                authenticated: true,
                username: username,
                loginTime: new Date().getTime(),
                expiresAt: new Date().getTime() + this.sessionDuration
            };
            
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            
            console.log('✅ Login realizado com sucesso');
            this.showDashboard();
            return true;
        } else {
            console.log('❌ Credenciais inválidas');
            this.showError('Usuário ou senha incorretos');
            return false;
        }
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        console.log('🚪 Logout realizado');
        this.showLoginForm();
    }

    showLoginForm() {
        // Se não estiver na página dashboard, redireciona
        if (!this.isDashboardPage()) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Remove qualquer conteúdo do dashboard
        document.body.innerHTML = '';
        document.body.className = 'login-page';
        
        document.body.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <div class="login-header">
                        <div class="logo">
                            <i class="fas fa-building"></i>
                            <h1>Marcelo Imóveis</h1>
                        </div>
                        <p>Acesso ao Dashboard Administrativo</p>
                    </div>
                    
                    <form class="login-form" id="loginForm">
                        <div class="form-group">
                            <label for="username">Usuário:</label>
                            <input type="text" id="username" name="username" required 
                                   placeholder="Digite seu usuário" autocomplete="username">
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Senha:</label>
                            <input type="password" id="password" name="password" required 
                                   placeholder="Digite sua senha" autocomplete="current-password">
                        </div>
                        
                        <button type="submit" class="login-btn">
                            <i class="fas fa-sign-in-alt"></i>
                            Entrar
                        </button>
                        
                        <div class="login-info">
                            <p><i class="fas fa-info-circle"></i> Acesso restrito ao corretor</p>
                        </div>
                        
                        <div class="error-message" id="errorMessage" style="display: none;"></div>
                    </form>
                    
                    <div class="login-footer">
                        <p>&copy; 2025 Marcelo Imóveis - Sistema Administrativo</p>
                    </div>
                </div>
            </div>
            
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                .login-page {
                    font-family: 'Space Grotesk', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .login-container {
                    width: 100%;
                    max-width: 400px;
                    padding: 20px;
                }
                
                .login-box {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                    animation: slideUp 0.6s ease-out;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .login-header {
                    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .logo {
                    margin-bottom: 10px;
                }
                
                .logo i {
                    font-size: 48px;
                    margin-bottom: 10px;
                    display: block;
                }
                
                .logo h1 {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .login-header p {
                    opacity: 0.9;
                    font-size: 14px;
                }
                
                .login-form {
                    padding: 30px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #e1e5e9;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.3s ease;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: #d4af37;
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                }
                
                .login-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                    margin-bottom: 20px;
                }
                
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
                }
                
                .login-btn i {
                    margin-right: 10px;
                }
                
                .login-info {
                    text-align: center;
                    color: #666;
                    font-size: 13px;
                }
                
                .login-info i {
                    color: #d4af37;
                    margin-right: 5px;
                }
                
                .error-message {
                    background: #ffe6e6;
                    color: #d63384;
                    padding: 12px;
                    border-radius: 8px;
                    margin-top: 15px;
                    border-left: 4px solid #d63384;
                    font-size: 14px;
                }
                
                .login-footer {
                    background: #f8f9fa;
                    padding: 15px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                
                @media (max-width: 480px) {
                    .login-container {
                        padding: 10px;
                    }
                    
                    .login-form {
                        padding: 20px;
                    }
                    
                    .login-header {
                        padding: 20px;
                    }
                }
            </style>
        `;
        
        // Adiciona event listeners
        this.setupLoginForm();
    }

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        // Focus automático no campo de usuário
        setTimeout(() => usernameInput.focus(), 100);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            
            if (!username || !password) {
                this.showError('Por favor, preencha todos os campos');
                return;
            }
            
            this.login(username, password);
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            // Remove erro após 5 segundos
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    showDashboard() {
        // Se a página está no estado de login, restaura o conteúdo original
        if (document.body.className === 'login-page') {
            // Remove a classe de login
            document.body.className = '';
            
            // Redireciona para o dashboard original apenas se necessário
            if (!document.querySelector('.dashboard-sidebar')) {
                window.location.href = 'dashboard.html';
                return;
            }
        }
        
        // Adiciona botão de logout no dashboard se existir
        this.addLogoutButton();
    }

    addLogoutButton() {
        // Procura por uma sidebar ou header para adicionar logout
        const sidebar = document.querySelector('.dashboard-sidebar, .sidebar-nav, .nav');
        
        if (sidebar) {
            const logoutBtn = document.createElement('li');
            logoutBtn.className = 'nav-item logout-item';
            logoutBtn.innerHTML = `
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
            `;
            logoutBtn.style.cursor = 'pointer';
            logoutBtn.style.color = '#dc3545';
            
            logoutBtn.addEventListener('click', () => {
                if (confirm('Deseja realmente sair do dashboard?')) {
                    this.logout();
                }
            });
            
            sidebar.appendChild(logoutBtn);
        }
    }

    getSessionInfo() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (!session) return null;
        
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            const timeLeft = sessionData.expiresAt - now;
            
            return {
                username: sessionData.username,
                loginTime: new Date(sessionData.loginTime).toLocaleString('pt-BR'),
                expiresAt: new Date(sessionData.expiresAt).toLocaleString('pt-BR'),
                timeLeft: Math.max(0, Math.floor(timeLeft / (1000 * 60))), // minutos restantes
                isValid: timeLeft > 0
            };
        } catch (error) {
            return null;
        }
    }
}

// Auto-inicializa a autenticação
if (typeof window !== 'undefined') {
    window.dashboardAuth = new SimpleDashboardAuth();
    
    // Expõe métodos úteis globalmente
    window.getDashboardSession = () => window.dashboardAuth.getSessionInfo();
    window.logoutDashboard = () => window.dashboardAuth.logout();
    
    console.log('🔐 Sistema de autenticação do dashboard ativo');
}
