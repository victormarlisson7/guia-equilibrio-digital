// Guia Equilíbrio Digital - Scripts do Painel Administrativo

document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
});

function initAdmin() {
    setupAdminNavigation();
    setupAdminInteractions();
    loadAdminData();
}

// Configuração da navegação administrativa
function setupAdminNavigation() {
    // Navegação lateral
    const sideNavItems = document.querySelectorAll('.side-nav-item');
    sideNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Remover classe ativa de todos os itens
            sideNavItems.forEach(i => i.classList.remove('active'));
            
            // Adicionar classe ativa ao item clicado
            this.classList.add('active');
        });
    });
    
    // Botão de ações rápidas
    const actionBtn = document.getElementById('admin-action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            openQuickActionsModal();
        });
    }
}

// Configuração de interações administrativas
function setupAdminInteractions() {
    // Configurar botões de ação nas tabelas
    setupTableActions();
    
    // Configurar modais
    setupModals();
    
    // Configurar formulários
    setupAdminForms();
}

// Configurar ações nas tabelas
function setupTableActions() {
    // Botões de visualizar usuário
    const viewButtons = document.querySelectorAll('.btn-view-user');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            viewUser(userId);
        });
    });
    
    // Botões de editar usuário
    const editButtons = document.querySelectorAll('.btn-edit-user');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUser(userId);
        });
    });
    
    // Botões de excluir usuário
    const deleteButtons = document.querySelectorAll('.btn-delete-user');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            confirmDeleteUser(userId);
        });
    });
    
    // Botões de gerenciar conteúdo
    const contentButtons = document.querySelectorAll('.btn-manage-content');
    contentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentId = this.getAttribute('data-content-id');
            const contentType = this.getAttribute('data-content-type');
            manageContent(contentId, contentType);
        });
    });
}

// Configurar modais
function setupModals() {
    // Fechar modais ao clicar no X
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Configurar formulários administrativos
function setupAdminForms() {
    // Formulário de adicionar usuário
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addUser();
        });
    }
    
    // Formulário de editar usuário
    const editUserForm = document.getElementById('edit-user-form');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateUser();
        });
    }
    
    // Formulário de adicionar conteúdo
    const addContentForm = document.getElementById('add-content-form');
    if (addContentForm) {
        addContentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addContent();
        });
    }
    
    // Formulário de editar conteúdo
    const editContentForm = document.getElementById('edit-content-form');
    if (editContentForm) {
        editContentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateContent();
        });
    }
}

// Carregar dados administrativos
function loadAdminData() {
    // Verificar qual página está sendo exibida
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('/admin/dashboard.html')) {
        loadDashboardData();
    } else if (currentPage.includes('/admin/users.html')) {
        loadUsersData();
    } else if (currentPage.includes('/admin/content.html')) {
        loadContentData();
    } else if (currentPage.includes('/admin/support.html')) {
        loadSupportData();
    } else if (currentPage.includes('/admin/settings.html')) {
        loadSettingsData();
    }
}

// Carregar dados do dashboard
function loadDashboardData() {
    // Carregar estatísticas gerais
    loadGeneralStats();
    
    // Carregar usuários recentes
    loadRecentUsers();
    
    // Carregar estatísticas de conteúdo
    loadContentStats();
    
    // Inicializar gráficos
    initCharts();
}

// Carregar dados de usuários
function loadUsersData() {
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Obter tabela de usuários
    const usersTable = document.getElementById('users-table');
    if (!usersTable) return;
    
    // Limpar tabela
    usersTable.innerHTML = '';
    
    // Preencher tabela com usuários
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Formatar data de registro
        const regDate = new Date(user.registrationDate);
        const formattedRegDate = `${regDate.getDate().toString().padStart(2, '0')}/${(regDate.getMonth() + 1).toString().padStart(2, '0')}/${regDate.getFullYear()}`;
        
        // Formatar último acesso
        const lastDate = new Date(user.lastActive);
        const formattedLastDate = `${lastDate.getDate().toString().padStart(2, '0')}/${(lastDate.getMonth() + 1).toString().padStart(2, '0')}/${lastDate.getFullYear()}`;
        
        // Determinar status
        let status = 'Ativo';
        let statusClass = 'badge-primary';
        
        // Verificar se é um usuário novo (menos de 3 dias)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        if (regDate > threeDaysAgo) {
            status = 'Novo';
            statusClass = 'badge-secondary';
        }
        
        // Verificar se está inativo (mais de 30 dias sem acesso)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (lastDate < thirtyDaysAgo) {
            status = 'Inativo';
            statusClass = 'badge-warning';
        }
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${formattedRegDate}</td>
            <td>${formattedLastDate}</td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary btn-view-user" data-user-id="${user.id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-secondary btn-edit-user" data-user-id="${user.id}"><i class="fas fa-edit"></i></button>
                ${user.role !== 'admin' ? `<button class="btn btn-sm btn-danger btn-delete-user" data-user-id="${user.id}"><i class="fas fa-trash"></i></button>` : ''}
            </td>
        `;
        
        usersTable.appendChild(row);
    });
    
    // Reconfigurar ações da tabela
    setupTableActions();
}

// Carregar dados de conteúdo
function loadContentData() {
    // Verificar qual tipo de conteúdo está sendo exibido
    const contentType = new URLSearchParams(window.location.search).get('type');
    
    switch(contentType) {
        case 'activities':
            loadActivitiesContent();
            break;
        case 'food':
            loadFoodContent();
            break;
        case 'coloring':
            loadColoringContent();
            break;
        case 'chat':
            loadChatContent();
            break;
        default:
            loadAllContent();
            break;
    }
}

// Carregar dados de suporte
function loadSupportData() {
    // Simular carregamento de tickets de suporte
    const supportTickets = [
        {
            id: 1,
            user: 'Ana Silva',
            email: 'ana@exemplo.com',
            subject: 'Dúvida sobre atividades',
            message: 'Olá, gostaria de saber como adicionar uma atividade personalizada.',
            date: '2025-05-20T10:30:00',
            status: 'open'
        },
        {
            id: 2,
            user: 'João Pereira',
            email: 'joao@exemplo.com',
            subject: 'Problema com login',
            message: 'Não consigo fazer login na minha conta.',
            date: '2025-05-21T14:45:00',
            status: 'in_progress'
        },
        {
            id: 3,
            user: 'Maria Santos',
            email: 'maria@exemplo.com',
            subject: 'Sugestão de melhoria',
            message: 'Gostaria de sugerir uma nova funcionalidade para o chat.',
            date: '2025-05-19T09:15:00',
            status: 'closed'
        }
    ];
    
    // Obter tabela de tickets
    const ticketsTable = document.getElementById('support-tickets-table');
    if (!ticketsTable) return;
    
    // Limpar tabela
    ticketsTable.innerHTML = '';
    
    // Preencher tabela com tickets
    supportTickets.forEach(ticket => {
        const row = document.createElement('tr');
        
        // Formatar data
        const ticketDate = new Date(ticket.date);
        const formattedDate = `${ticketDate.getDate().toString().padStart(2, '0')}/${(ticketDate.getMonth() + 1).toString().padStart(2, '0')}/${ticketDate.getFullYear()}`;
        
        // Determinar status
        let status = 'Aberto';
        let statusClass = 'badge-warning';
        
        if (ticket.status === 'in_progress') {
            status = 'Em Andamento';
            statusClass = 'badge-primary';
        } else if (ticket.status === 'closed') {
            status = 'Resolvido';
            statusClass = 'badge-success';
        }
        
        row.innerHTML = `
            <td>${ticket.user}</td>
            <td>${ticket.subject}</td>
            <td>${formattedDate}</td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary btn-view-ticket" data-ticket-id="${ticket.id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-secondary btn-reply-ticket" data-ticket-id="${ticket.id}"><i class="fas fa-reply"></i></button>
                <button class="btn btn-sm btn-success btn-close-ticket" data-ticket-id="${ticket.id}"><i class="fas fa-check"></i></button>
            </td>
        `;
        
        ticketsTable.appendChild(row);
    });
}

// Carregar dados de configurações
function loadSettingsData() {
    // Carregar configurações do sistema
    const systemSettings = {
        siteName: 'Guia Equilíbrio Digital',
        contactEmail: 'contato@guiaequilibriodigital.com.br',
        notificationsEnabled: true,
        chatEnabled: true,
        registrationEnabled: true,
        maintenanceMode: false
    };
    
    // Preencher formulário de configurações
    const siteNameInput = document.getElementById('site-name');
    if (siteNameInput) siteNameInput.value = systemSettings.siteName;
    
    const contactEmailInput = document.getElementById('contact-email');
    if (contactEmailInput) contactEmailInput.value = systemSettings.contactEmail;
    
    const notificationsCheck = document.getElementById('notifications-enabled');
    if (notificationsCheck) notificationsCheck.checked = systemSettings.notificationsEnabled;
    
    const chatCheck = document.getElementById('chat-enabled');
    if (chatCheck) chatCheck.checked = systemSettings.chatEnabled;
    
    const registrationCheck = document.getElementById('registration-enabled');
    if (registrationCheck) registrationCheck.checked = systemSettings.registrationEnabled;
    
    const maintenanceCheck = document.getElementById('maintenance-mode');
    if (maintenanceCheck) maintenanceCheck.checked = systemSettings.maintenanceMode;
}

// Carregar estatísticas gerais
function loadGeneralStats() {
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Calcular estatísticas
    const totalUsers = users.length;
    
    // Verificar usuários ativos (último acesso nos últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = users.filter(user => {
        const lastActive = new Date(user.lastActive);
        return lastActive > thirtyDaysAgo;
    }).length;
    
    // Verificar novos usuários hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newUsersToday = users.filter(user => {
        const regDate = new Date(user.registrationDate);
        return regDate >= today;
    }).length;
    
    // Atualizar elementos na página
    const totalUsersEl = document.querySelector('.stats-card:nth-child(1) .stats-number');
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    
    const activeUsersEl = document.querySelector('.stats-card:nth-child(2) .stats-number');
    if (activeUsersEl) activeUsersEl.textContent = activeUsers;
    
    const newUsersTodayEl = document.querySelector('.stats-card:nth-child(3) .stats-number');
    if (newUsersTodayEl) newUsersTodayEl.textContent = newUsersToday;
}

// Carregar usuários recentes
function loadRecentUsers() {
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Ordenar por data de registro (mais recentes primeiro)
    users.sort((a, b) => {
        return new Date(b.registrationDate) - new Date(a.registrationDate);
    });
    
    // Pegar os 5 mais recentes
    const recentUsers = users.slice(0, 5);
    
    // Obter tabela de usuários recentes
    const recentUsersTable = document.getElementById('recent-users-table');
    if (!recentUsersTable) return;
    
    // Limpar tabela
    recentUsersTable.innerHTML = '';
    
    // Preencher tabela com usuários recentes
    recentUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Formatar data de registro
        const regDate = new Date(user.registrationDate);
        const formattedRegDate = `${regDate.getDate().toString().padStart(2, '0')}/${(regDate.getMonth() + 1).toString().padStart(2, '0')}/${regDate.getFullYear()}`;
        
        // Formatar último acesso
        const lastDate = new Date(user.lastActive);
        const formattedLastDate = `${lastDate.getDate().toString().padStart(2, '0')}/${(lastDate.getMonth() + 1).toString().padStart(2, '0')}/${lastDate.getFullYear()}`;
        
        // Determinar status
        let status = 'Ativo';
        let statusClass = 'badge-primary';
        
        // Verificar se é um usuário novo (menos de 3 dias)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        if (regDate > threeDaysAgo) {
            status = 'Novo';
            statusClass = 'badge-secondary';
        }
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${formattedRegDate}</td>
            <td>${formattedLastDate}</td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary btn-view-user" data-user-id="${user.id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-secondary btn-edit-user" data-user-id="${user.id}"><i class="fas fa-edit"></i></button>
            </td>
        `;
        
        recentUsersTable.appendChild(row);
    });
    
    // Reconfigurar ações da tabela
    setupTableActions();
}

// Carregar estatísticas de conteúdo
function loadContentStats() {
    // Simular estatísticas de conteúdo
    const contentStats = {
        activities: 45,
        recipes: 30,
        coloringPages: 25,
        chatTopics: 78
    };
    
    // Atualizar elementos na página
    const activitiesEl = document.querySelector('.content-stat-item:nth-child(1) .stats-number');
    if (activitiesEl) activitiesEl.textContent = contentStats.activities;
    
    const recipesEl = document.querySelector('.content-stat-item:nth-child(2) .stats-number');
    if (recipesEl) recipesEl.textContent = contentStats.recipes;
    
    const coloringEl = document.querySelector('.content-stat-item:nth-child(3) .stats-number');
    if (coloringEl) coloringEl.textContent = contentStats.coloringPages;
    
    const chatEl = document.querySelector('.content-stat-item:nth-child(4) .stats-number');
    if (chatEl) chatEl.textContent = contentStats.chatTopics;
}

// Inicializar gráficos
function initCharts() {
    // Gráfico de crescimento de usuários já é inicializado no HTML
}

// Funções de gerenciamento de usuários
function viewUser(userId) {
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Encontrar usuário pelo ID
    const user = users.find(u => u.id === parseInt(userId));
    
    if (!user) {
        showAdminNotification('Usuário não encontrado.', 'error');
        return;
    }
    
    // Abrir modal com detalhes do usuário
    const modal = document.getElementById('view-user-modal');
    if (!modal) return;
    
    // Preencher modal com dados do usuário
    const userNameEl = modal.querySelector('.user-name');
    if (userNameEl) userNameEl.textContent = user.name;
    
    const userEmailEl = modal.querySelector('.user-email');
    if (userEmailEl) userEmailEl.textContent = user.email;
    
    const userRoleEl = modal.querySelector('.user-role');
    if (userRoleEl) userRoleEl.textContent = user.role === 'admin' ? 'Administrador' : 'Membro';
    
    const userRegDateEl = modal.querySelector('.user-reg-date');
    if (userRegDateEl) {
        const regDate = new Date(user.registrationDate);
        userRegDateEl.textContent = `${regDate.getDate().toString().padStart(2, '0')}/${(regDate.getMonth() + 1).toString().padStart(2, '0')}/${regDate.getFullYear()}`;
    }
    
    const userLastActiveEl = modal.querySelector('.user-last-active');
    if (userLastActiveEl) {
        const lastDate = new Date(user.lastActive);
        userLastActiveEl.textContent = `${lastDate.getDate().toString().padStart(2, '0')}/${(lastDate.getMonth() + 1).toString().padStart(2, '0')}/${lastDate.getFullYear()}`;
    }
    
    // Exibir modal
    modal.style.display = 'block';
}

function editUser(userId) {
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Encontrar usuário pelo ID
    const user = users.find(u => u.id === parseInt(userId));
    
    if (!user) {
        showAdminNotification('Usuário não encontrado.', 'error');
        return;
    }
    
    // Abrir modal de edição
    const modal = document.getElementById('edit-user-modal');
    if (!modal) return;
    
    // Preencher formulário com dados do usuário
    const userIdInput = modal.querySelector('#edit-user-id');
    if (userIdInput) userIdInput.value = user.id;
    
    const userNameInput = modal.querySelector('#edit-user-name');
    if (userNameInput) userNameInput.value = user.name;
    
    const userEmailInput = modal.querySelector('#edit-user-email');
    if (userEmailInput) userEmailInput.value = user.email;
    
    const userRoleSelect = modal.querySelector('#edit-user-role');
    if (userRoleSelect) userRoleSelect.value = user.role;
    
    // Exibir modal
    modal.style.display = 'block';
}

function updateUser() {
    // Obter dados do formulário
    const userId = document.getElementById('edit-user-id').value;
    const name = document.getElementById('edit-user-name').value;
    const email = document.getElementById('edit-user-email').value;
    const role = document.getElementById('edit-user-role').value;
    
    // Validar campos
    if (!name || !email) {
        showAdminNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Encontrar índice do usuário
    const userIndex = users.findIndex(u => u.id === parseInt(userId));
    
    if (userIndex === -1) {
        showAdminNotification('Usuário não encontrado.', 'error');
        return;
    }
    
    // Verificar se o e-mail já está em uso por outro usuário
    const emailExists = users.some((u, index) => u.email === email && index !== userIndex);
    
    if (emailExists) {
        showAdminNotification('Este e-mail já está em uso por outro usuário.', 'error');
        return;
    }
    
    // Atualizar dados do usuário
    users[userIndex].name = name;
    users[userIndex].email = email;
    users[userIndex].role = role;
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Fechar modal
    const modal = document.getElementById('edit-user-modal');
    if (modal) modal.style.display = 'none';
    
    // Mostrar notificação
    showAdminNotification('Usuário atualizado com sucesso!', 'success');
    
    // Recarregar dados
    loadUsersData();
}

function confirmDeleteUser(userId) {
    // Confirmar exclusão
    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
        deleteUser(userId);
    }
}

function deleteUser(userId) {
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Encontrar índice do usuário
    const userIndex = users.findIndex(u => u.id === parseInt(userId));
    
    if (userIndex === -1) {
        showAdminNotification('Usuário não encontrado.', 'error');
        return;
    }
    
    // Verificar se é administrador
    if (users[userIndex].role === 'admin') {
        showAdminNotification('Não é possível excluir um administrador.', 'error');
        return;
    }
    
    // Remover usuário
    users.splice(userIndex, 1);
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Mostrar notificação
    showAdminNotification('Usuário excluído com sucesso!', 'success');
    
    // Recarregar dados
    loadUsersData();
}

function addUser() {
    // Obter dados do formulário
    const name = document.getElementById('add-user-name').value;
    const email = document.getElementById('add-user-email').value;
    const password = document.getElementById('add-user-password').value;
    const role = document.getElementById('add-user-role').value;
    
    // Validar campos
    if (!name || !email || !password) {
        showAdminNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Obter usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se o e-mail já está em uso
    if (users.some(u => u.email === email)) {
        showAdminNotification('Este e-mail já está cadastrado.', 'error');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        role: role,
        registrationDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
    };
    
    // Adicionar à lista de usuários
    users.push(newUser);
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Fechar modal
    const modal = document.getElementById('add-user-modal');
    if (modal) modal.style.display = 'none';
    
    // Limpar formulário
    document.getElementById('add-user-form').reset();
    
    // Mostrar notificação
    showAdminNotification('Usuário adicionado com sucesso!', 'success');
    
    // Recarregar dados
    loadUsersData();
}

// Funções de gerenciamento de conteúdo
function loadAllContent() {
    // Implementar carregamento de todos os tipos de conteúdo
}

function loadActivitiesContent() {
    // Implementar carregamento de atividades
}

function loadFoodContent() {
    // Implementar carregamento de receitas
}

function loadColoringContent() {
    // Implementar carregamento de imagens para colorir
}

function loadChatContent() {
    // Implementar carregamento de tópicos de chat
}

function manageContent(contentId, contentType) {
    // Implementar gerenciamento de conteúdo específico
}

function addContent() {
    // Implementar adição de novo conteúdo
}

function updateContent() {
    // Implementar atualização de conteúdo existente
}

// Funções de modais
function openQuickActionsModal() {
    const modal = document.getElementById('quick-actions-modal');
    if (modal) modal.style.display = 'block';
}

// Função para mostrar notificações administrativas
function showAdminNotification(message, type) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
