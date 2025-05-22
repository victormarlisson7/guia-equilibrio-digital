// Arquivo JavaScript principal para o Guia Equilíbrio Digital com integração de API

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

// API URL - Ajuste para o ambiente de produção
const API_URL = '/api';

// Formulários de Login e Cadastro
function initForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Validação básica
            if (!email || !password) {
                showNotification('Preencha todos os campos', 'error');
                return;
            }
            
            try {
                // Mostrar indicador de carregamento
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processando...';
                
                // Fazer requisição para a API
                const response = await fetch(`${API_URL}/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'login',
                        email,
                        password
                    })
                });
                
                const data = await response.json();
                
                // Restaurar botão
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                
                if (!response.ok) {
                    showNotification(data.message || 'Erro ao fazer login', 'error');
                    return;
                }
                
                // Login bem-sucedido
                showNotification('Login realizado com sucesso!', 'success');
                
                // Salvar token e dados do usuário
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirecionar com base no papel do usuário
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1500);
                
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                showNotification('Erro ao conectar com o servidor', 'error');
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
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
            
            try {
                // Mostrar indicador de carregamento
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processando...';
                
                // Fazer requisição para a API
                const response = await fetch(`${API_URL}/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'register',
                        name,
                        email,
                        password
                    })
                });
                
                const data = await response.json();
                
                // Restaurar botão
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                
                if (!response.ok) {
                    showNotification(data.message || 'Erro ao fazer cadastro', 'error');
                    return;
                }
                
                // Cadastro bem-sucedido
                showNotification('Cadastro realizado com sucesso!', 'success');
                
                // Salvar token e dados do usuário
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirecionar para o dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } catch (error) {
                console.error('Erro ao fazer cadastro:', error);
                showNotification('Erro ao conectar com o servidor', 'error');
            }
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

// Verificar autenticação
async function checkAuthentication() {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const token = localStorage.getItem('authToken');
    
    if (isLoggedIn && token) {
        try {
            // Verificar token com a API
            const response = await fetch(`${API_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'verify',
                    token
                })
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                // Token inválido, fazer logout
                logoutUser();
                return;
            }
            
            // Token válido, atualizar dados do usuário
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Atualizar elementos da UI
            updateUIForLoggedInUser(data.user);
            
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            // Em caso de erro, manter o estado atual
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (currentUser) {
                updateUIForLoggedInUser(currentUser);
            }
        }
    } else {
        // Usuário não está logado
        updateUIForLoggedOutUser();
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

// Atualizar UI para usuário logado
function updateUIForLoggedInUser(user) {
    // Elementos que devem ser mostrados apenas para usuários logados
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    // Elementos que devem ser mostrados apenas para usuários não logados
    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    // Elementos que devem ser mostrados apenas para administradores
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    
    // Usuário está logado
    loggedInElements.forEach(el => el.style.display = '');
    loggedOutElements.forEach(el => el.style.display = 'none');
    
    // Verificar se é admin
    if (user.role === 'admin') {
        adminOnlyElements.forEach(el => el.style.display = '');
    } else {
        adminOnlyElements.forEach(el => el.style.display = 'none');
    }
    
    // Atualizar elementos com informações do usuário
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = user.name;
    });
    
    document.querySelectorAll('.user-email').forEach(el => {
        el.textContent = user.email;
    });
    
    document.querySelectorAll('.user-role').forEach(el => {
        el.textContent = user.role === 'admin' ? 'Administrador' : 'Membro';
    });
    
    // Iniciais do usuário para avatar
    document.querySelectorAll('.user-initial').forEach(el => {
        el.textContent = user.name.charAt(0).toUpperCase();
    });
}

// Atualizar UI para usuário não logado
function updateUIForLoggedOutUser() {
    // Elementos que devem ser mostrados apenas para usuários logados
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    // Elementos que devem ser mostrados apenas para usuários não logados
    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    // Elementos que devem ser mostrados apenas para administradores
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    
    // Usuário não está logado
    loggedInElements.forEach(el => el.style.display = 'none');
    loggedOutElements.forEach(el => el.style.display = '');
    adminOnlyElements.forEach(el => el.style.display = 'none');
}

// Logout
function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', 'false');
    
    showNotification('Logout realizado com sucesso', 'success');
    
    // Redirecionar para a página inicial
    setTimeout(() => {
        window.location.href = window.location.pathname.includes('/admin/') ? '../index.html' : 'index.html';
    }, 1500);
}
