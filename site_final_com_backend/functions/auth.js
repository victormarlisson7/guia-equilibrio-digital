const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Chave secreta para JWT - em produção real, isso seria uma variável de ambiente
const JWT_SECRET = 'guia-equilibrio-digital-secret-key-2025';

// Função para ler o arquivo de usuários
const getUsersData = () => {
  try {
    const usersPath = path.join(__dirname, 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Erro ao ler arquivo de usuários:', error);
    return { users: [] };
  }
};

// Função para salvar o arquivo de usuários
const saveUsersData = (data) => {
  try {
    const usersPath = path.join(__dirname, 'users.json');
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo de usuários:', error);
    return false;
  }
};

// Função para autenticação
exports.handler = async (event, context) => {
  // Configurar CORS para permitir acesso do frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Responder a requisições OPTIONS (preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Verificar se é uma requisição POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Método não permitido' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { action, email, password, name } = data;

    // Obter dados dos usuários
    const usersData = getUsersData();
    
    // Ação de login
    if (action === 'login') {
      const user = usersData.users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, message: 'Email ou senha incorretos' })
        };
      }
      
      // Atualizar último acesso
      user.lastActive = new Date().toISOString();
      saveUsersData(usersData);
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Retornar dados do usuário (exceto senha) e token
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Login realizado com sucesso',
          user: userWithoutPassword,
          token
        })
      };
    }
    
    // Ação de cadastro
    if (action === 'register') {
      // Verificar se o email já está cadastrado
      if (usersData.users.some(u => u.email === email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Este email já está cadastrado' })
        };
      }
      
      // Criar novo usuário
      const newUser = {
        id: usersData.users.length + 1,
        name,
        email,
        password,
        role: 'member',
        registrationDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      
      // Adicionar à lista de usuários
      usersData.users.push(newUser);
      saveUsersData(usersData);
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email, 
          name: newUser.name, 
          role: newUser.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Retornar dados do usuário (exceto senha) e token
      const { password: _, ...userWithoutPassword } = newUser;
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Cadastro realizado com sucesso',
          user: userWithoutPassword,
          token
        })
      };
    }
    
    // Ação de verificação de token
    if (action === 'verify') {
      const { token } = data;
      
      if (!token) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Token não fornecido' })
        };
      }
      
      try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verificar se o usuário ainda existe
        const user = usersData.users.find(u => u.id === decoded.id);
        
        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, message: 'Usuário não encontrado' })
          };
        }
        
        // Retornar dados do usuário (exceto senha)
        const { password: _, ...userWithoutPassword } = user;
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: userWithoutPassword
          })
        };
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, message: 'Token inválido ou expirado' })
        };
      }
    }
    
    // Ação não reconhecida
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Ação não reconhecida' })
    };
    
  } catch (error) {
    console.error('Erro na função de autenticação:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Erro interno do servidor' })
    };
  }
};
