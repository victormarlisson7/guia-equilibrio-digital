// Guia Equilíbrio Digital - Scripts de Autenticação

document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});

function initAuth() {
    setupAuthTabs();
    setupLoginForm();
    setupRegisterForm();
    setupPasswordReset();
}

// Configuração das abas de login/cadastro
function setupAuthTabs() {
    const tabs = document.querySelectorAll('.login-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe ativa de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adicionar classe ativa à aba clicada
            this.classList.add('active');
            
            // Esconder todos os conteúdos
            contents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Mostrar o conteúdo correspondente
            const target = this.getAttribute('data-tab');
            document.getElementById(`${target}-content`).style.display = 'block';
        });
    });
}

// Configuração do formulário de login
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validar campos
            if (!email || !password) {
                showAuthNotification('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            // Simular autenticação (para demonstração)
            if (email === 'admin@exemplo.com' && password === 'admin123') {
                // Login como administrador
                loginUser({
                    id: 1,
                    name: 'Administrador',
                    email: email,
                    role: 'admin'
                }, rememberMe);
                
                // Redirecionar para o painel admin
                window.location.href = 'admin/dashboard.html';
            } else {
                // Verificar se o usuário existe no localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email);
                
                if (user && user.password === password) {
                    // Login como membro
                    loginUser({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: 'member'
                    }, rememberMe);
                    
                    // Redirecionar para o dashboard de membros
                    window.location.href = 'dashboard.html';
                } else {
                    showAuthNotification('E-mail ou senha incorretos.', 'error');
                }
            }
        });
    }
}

// Configuração do formulário de cadastro
function setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const termsAgree = document.getElementById('terms-agree').checked;
            
            // Validar campos
            if (!name || !email || !password || !passwordConfirm) {
                showAuthNotification('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (password !== passwordConfirm) {
                showAuthNotification('As senhas não coincidem.', 'error');
                return;
            }
            
            if (!termsAgree) {
                showAuthNotification('Você precisa concordar com os termos de uso.', 'error');
                return;
            }
            
            // Verificar se o e-mail já está cadastrado
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(user => user.email === email)) {
                showAuthNotification('Este e-mail já está cadastrado.', 'error');
                return;
            }
            
            // Criar novo usuário
            const newUser = {
                id: users.length + 1,
                name: name,
                email: email,
                password: password, // Em um ambiente real, a senha seria criptografada
                role: 'member',
                registrationDate: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
            
            // Adicionar à lista de usuários
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Login automático após cadastro
            loginUser({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }, false);
            
            showAuthNotification('Cadastro realizado com sucesso!', 'success');
            
            // Redirecionar para o dashboard após um breve delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
}

// Configuração da recuperação de senha
function setupPasswordReset() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = prompt('Digite seu e-mail para recuperar a senha:');
            
            if (email) {
                // Verificar se o e-mail existe
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email);
                
                if (user) {
                    // Simular envio de e-mail de recuperação
                    showAuthNotification('Um e-mail de recuperação foi enviado para ' + email, 'success');
                } else {
                    showAuthNotification('E-mail não encontrado.', 'error');
                }
            }
        });
    }
}

// Função para realizar login
function loginUser(user, rememberMe) {
    // Criar token JWT simulado
    const token = createSimulatedToken(user);
    
    // Salvar no localStorage ou sessionStorage
    if (rememberMe) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
    } else {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('user_data', JSON.stringify(user));
    }
    
    // Atualizar último acesso
    updateUserLastActive(user.id);
}

// Função para criar um token simulado
function createSimulatedToken(user) {
    // Em um ambiente real, isso seria feito no backend com JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        exp: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 horas
    }));
    const signature = btoa('simulated_signature');
    
    return `${header}.${payload}.${signature}`;
}

// Função para atualizar último acesso do usuário
function updateUserLastActive(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].lastActive = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Função para verificar se o usuário está logado
function isLoggedIn() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return !!token;
}

// Função para obter dados do usuário logado
function getLoggedInUser() {
    const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
}

// Função para fazer logout
function logoutUser() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('user_data');
    
    // Redirecionar para a página de login
    window.location.href = 'login.html';
}

// Função para mostrar notificações de autenticação
function showAuthNotification(message, type) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.textContent = message;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após alguns segundos
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Inicializar dados de demonstração se não existirem
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
