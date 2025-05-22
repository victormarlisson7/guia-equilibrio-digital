// Arquivo JavaScript principal para o Guia Equilíbrio Digital

// Esperar que o DOM esteja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos os componentes
    initNavigation();
    initModals();
    initForms();
    initNotifications();
    checkAuthentication();
});

// Navegação e Menu Mobile
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Não aplicar para links de modal ou links sem destino
            if (this.getAttribute('href') === '#' || 
                this.id === 'login-btn' || 
                this.id === 'signup-btn' || 
                this.id === 'cta-signup-btn' ||
                this.id === 'show-login' ||
                this.id === 'show-signup') {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para o cabeçalho fixo
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modais de Login e Cadastro
function initModals() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const ctaSignupBtn = document.getElementById('cta-signup-btn');
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const closeButtons = document.querySelectorAll('.close-modal');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    
    // Abrir modal de login
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('login-modal');
        });
    }
    
    // Abrir modal de cadastro
    if (signupBtn && signupModal) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('signup-modal');
        });
    }
    
    // Abrir modal de cadastro pelo CTA
    if (ctaSignupBtn && signupModal) {
        ctaSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('signup-modal');
        });
    }
    
    // Alternar entre modais
    if (showLoginBtn && loginModal && signupModal) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('signup-modal');
            openModal('login-modal');
        });
    }
    
    if (showSignupBtn && loginModal && signupModal) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('login-modal');
            openModal('signup-modal');
        });
    }
    
    // Fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Abrir modal por ID
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impedir rolagem da página
    }
}

// Fechar modal por ID
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar rolagem da página
    }
}

// Formulários de Login e Cadastro
function initForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Validação básica
            if (!email || !password) {
                showNotification('Preencha todos os campos', 'error');
                return;
            }
            
            // Simulação de login (em produção, isso seria uma chamada de API)
            if (email === 'admin@exemplo.com' && password === 'admin123') {
                // Login como admin
                loginUser({
                    id: 1,
                    name: 'Administrador',
                    email: email,
                    role: 'admin'
                });
                
                showNotification('Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = 'admin/dashboard.html';
                }, 1500);
            } else {
                // Verificar usuários no localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Login como membro
                    loginUser({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: 'member'
                    });
                    
                    showNotification('Login realizado com sucesso!', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showNotification('Email ou senha incorretos', 'error');
                }
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // Validação básica
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Preencha todos os campos', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('As senhas não coincidem', 'error');
                return;
            }
            
            // Verificar se o email já está cadastrado
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(user => user.email === email)) {
                showNotification('Este email já está cadastrado', 'error');
                return;
            }
            
            // Criar novo usuário
            const newUser = {
                id: users.length + 1,
                name: name,
                email: email,
                password: password, // Em produção, a senha seria criptografada
                role: 'member',
                registrationDate: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
            
            // Adicionar à lista de usuários
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Login automático
            loginUser({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            });
            
            showNotification('Cadastro realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
}

// Sistema de notificações
function initNotifications() {
    // Criar container de notificações se não existir
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1001';
        document.body.appendChild(container);
    }
}

// Mostrar notificação
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Ícone baseado no tipo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✕';
            break;
        case 'warning':
            icon = '⚠';
            break;
        default:
            icon = 'ℹ';
    }
    
    // Estrutura da notificação
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <h4>${type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : type === 'warning' ? 'Atenção' : 'Informação'}</h4>
            <p>${message}</p>
        </div>
        <span class="notification-close">&times;</span>
    `;
    
    // Adicionar ao container
    container.appendChild(notification);
    
    // Configurar botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Remover automaticamente após a duração
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        // Remover do DOM após a animação
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Autenticação
function loginUser(userData) {
    // Salvar dados do usuário no localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Atualizar último acesso
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userData.id);
    
    if (userIndex !== -1) {
        users[userIndex].lastActive = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', 'false');
    
    showNotification('Logout realizado com sucesso', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function checkAuthentication() {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Elementos que devem ser mostrados apenas para usuários logados
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    // Elementos que devem ser mostrados apenas para usuários não logados
    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    // Elementos que devem ser mostrados apenas para administradores
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    
    if (isLoggedIn && currentUser) {
        // Usuário está logado
        loggedInElements.forEach(el => el.style.display = '');
        loggedOutElements.forEach(el => el.style.display = 'none');
        
        // Verificar se é admin
        if (currentUser.role === 'admin') {
            adminOnlyElements.forEach(el => el.style.display = '');
        } else {
            adminOnlyElements.forEach(el => el.style.display = 'none');
        }
        
        // Atualizar elementos com informações do usuário
        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = currentUser.name;
        });
        
        document.querySelectorAll('.user-email').forEach(el => {
            el.textContent = currentUser.email;
        });
        
        document.querySelectorAll('.user-role').forEach(el => {
            el.textContent = currentUser.role === 'admin' ? 'Administrador' : 'Membro';
        });
        
        // Iniciais do usuário para avatar
        document.querySelectorAll('.user-initial').forEach(el => {
            el.textContent = currentUser.name.charAt(0).toUpperCase();
        });
    } else {
        // Usuário não está logado
        loggedInElements.forEach(el => el.style.display = 'none');
        loggedOutElements.forEach(el => el.style.display = '');
        adminOnlyElements.forEach(el => el.style.display = 'none');
    }
    
    // Configurar botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

// Inicializar dados de demonstração
function initDemoData() {
    // Verificar se já existem usuários
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.length === 0) {
        // Criar usuários de demonstração
        const demoUsers = [
            {
                id: 1,
                name: 'Administrador',
                email: 'admin@exemplo.com',
                password: 'admin123',
                role: 'admin',
                registrationDate: '2025-01-01T00:00:00.000Z',
                lastActive: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Ana Silva',
                email: 'ana@exemplo.com',
                password: 'senha123',
                role: 'member',
                registrationDate: '2025-03-15T00:00:00.000Z',
                lastActive: '2025-05-20T00:00:00.000Z'
            },
            {
                id: 3,
                name: 'João Pereira',
                email: 'joao@exemplo.com',
                password: 'senha123',
                role: 'member',
                registrationDate: '2025-04-10T00:00:00.000Z',
                lastActive: '2025-05-21T00:00:00.000Z'
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
}

// Inicializar dados de demonstração
initDemoData();
