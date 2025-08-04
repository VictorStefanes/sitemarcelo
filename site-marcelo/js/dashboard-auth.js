// ===========================================
// PROTEÇÃO DE AUTENTICAÇÃO PARA DASHBOARD
// ===========================================

class DashboardAuth {
    constructor() {
        this.init();
    }

    init() {
        // Verifica autenticação ao carregar a página
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }

        // Configura logout automático quando a sessão expira
        this.setupSessionCheck();
        
        // Adiciona informações do usuário no header
        this.displayUserInfo();
        
        // Adiciona botão de logout
        this.addLogoutButton();
    }

    isAuthenticated() {
        const session = localStorage.getItem('user_session');
        const sessionTime = localStorage.getItem('session_time');
        
        if (session && sessionTime) {
            const now = new Date().getTime();
            const sessionStart = parseInt(sessionTime);
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
            
            return (now - sessionStart) < sessionDuration;
        }
        
        return false;
    }

    getUserData() {
        const session = localStorage.getItem('user_session');
        return session ? JSON.parse(session) : null;
    }

    redirectToLogin() {
        // Limpa dados de sessão inválidos
        localStorage.removeItem('user_session');
        localStorage.removeItem('session_time');
        
        // Redireciona para a página principal
        window.location.href = 'index.html';
    }

    setupSessionCheck() {
        // Verifica a sessão a cada 5 minutos
        setInterval(() => {
            if (!this.isAuthenticated()) {
                this.showSessionExpiredMessage();
            }
        }, 5 * 60 * 1000);
    }

    displayUserInfo() {
        const userData = this.getUserData();
        if (!userData) return;

        // Atualiza o header com informações do usuário
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <div class="user-welcome">
                    <i class="fas fa-user-circle"></i>
                    <span>Olá, ${userData.username}!</span>
                </div>
            `;
            
            headerRight.insertBefore(userInfo, headerRight.firstChild);
        }
    }

    addLogoutButton() {
        const sidebar = document.querySelector('.sidebar-nav ul');
        if (sidebar) {
            const logoutItem = document.createElement('li');
            logoutItem.className = 'nav-item logout-item';
            logoutItem.innerHTML = `
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
            `;
            
            logoutItem.addEventListener('click', () => {
                this.logout();
            });
            
            sidebar.appendChild(logoutItem);
        }
    }

    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('user_session');
            localStorage.removeItem('session_time');
            window.location.href = 'index.html';
        }
    }

    showSessionExpiredMessage() {
        const modal = document.createElement('div');
        modal.className = 'session-expired-modal';
        modal.innerHTML = `
            <div class="session-expired-content">
                <i class="fas fa-clock"></i>
                <h3>Sessão Expirada</h3>
                <p>Sua sessão expirou por segurança. Faça login novamente para continuar.</p>
                <button onclick="window.location.href='index.html'" class="btn-primary">
                    Fazer Login
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            this.redirectToLogin();
        }, 5000);
    }
}

// ===========================================
// ESTILOS PARA AUTENTICAÇÃO DO DASHBOARD
// ===========================================

const dashboardAuthStyles = `
<style>
.user-info {
    display: flex;
    align-items: center;
    margin-right: 20px;
}

.user-welcome {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    font-weight: 500;
}

.user-welcome i {
    font-size: 1.2rem;
    color: var(--primary-gold);
}

.logout-item {
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 15px;
    color: #ff6b6b !important;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-item:hover {
    background: rgba(255, 107, 107, 0.1);
    color: #ff5252 !important;
}

.session-expired-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
}

.session-expired-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.session-expired-content i {
    font-size: 3rem;
    color: #f39c12;
    margin-bottom: 20px;
}

.session-expired-content h3 {
    margin-bottom: 15px;
    color: #2c3e50;
    font-family: 'Space Grotesk', sans-serif;
}

.session-expired-content p {
    margin-bottom: 25px;
    color: #666;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .user-info {
        margin-right: 10px;
    }
    
    .user-welcome {
        font-size: 0.8rem;
    }
    
    .user-welcome span {
        display: none;
    }
}
</style>
`;

// Adiciona os estilos
document.head.insertAdjacentHTML('beforeend', dashboardAuthStyles);

// Inicializa a proteção de autenticação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardAuth = new DashboardAuth();
});
