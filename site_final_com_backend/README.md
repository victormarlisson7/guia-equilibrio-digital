# Guia Equilíbrio Digital - Instruções de Hospedagem

## Visão Geral

Este pacote contém a versão estática do Guia Equilíbrio Digital, uma plataforma web responsiva desenvolvida para ajudar mães e pais a retirarem seus filhos do excesso de telas através de métodos e atividades práticas. A plataforma oferece uma área de membros com conteúdo exclusivo e um painel administrativo para gerenciamento de usuários e conteúdo.

## Conteúdo do Pacote

- **Área de Membros**: Dashboard, atividades práticas, imagens para colorir, comidas saudáveis, chat entre pais, controle de progresso e suporte
- **Painel Administrativo**: Gestão de usuários, estatísticas, gerenciamento de conteúdo e suporte
- **Sistema de Autenticação**: Login e cadastro de usuários com armazenamento local

## Instruções de Hospedagem

### Opção 1: Netlify (Recomendado)

1. Acesse [netlify.com](https://www.netlify.com/) e faça login ou crie uma conta
2. Na página inicial do Netlify, arraste e solte a pasta descompactada deste ZIP ou clique em "Deploy manually"
3. Aguarde o upload e a implantação automática
4. Após a implantação, clique em "Domain settings" para personalizar o domínio se desejar

### Opção 2: Vercel

1. Acesse [vercel.com](https://vercel.com/) e faça login ou crie uma conta
2. Clique em "New Project" e depois em "Upload"
3. Arraste e solte a pasta descompactada deste ZIP
4. Clique em "Deploy" e aguarde a implantação

### Opção 3: Hospedagem Tradicional

1. Descompacte o arquivo ZIP
2. Faça upload de todos os arquivos e pastas para o diretório raiz do seu servidor web via FTP
3. Certifique-se de que o arquivo index.html esteja na raiz do diretório público

## Acesso ao Sistema

### Área de Membros
- URL: seu-dominio.com/login.html
- Credenciais de teste: 
  - Email: ana@exemplo.com
  - Senha: senha123

### Painel Administrativo
- URL: seu-dominio.com/admin/dashboard.html
- Credenciais de administrador:
  - Email: admin@exemplo.com
  - Senha: admin123

## Personalização

Para personalizar o site:
- Edite os arquivos HTML para alterar o conteúdo
- Modifique o arquivo CSS em /css/styles.css para alterar o estilo
- Substitua as imagens em /images/ mantendo os mesmos nomes de arquivo

## Limitações da Versão Estática

Esta versão utiliza armazenamento local do navegador para simular um backend:
- Os dados são armazenados apenas no navegador do usuário
- Usuários diferentes não compartilham dados
- Os dados podem ser perdidos se o usuário limpar o cache do navegador

Para uma versão completa com backend, consulte a documentação completa incluída no pacote.

## Suporte

Para questões técnicas ou problemas com a plataforma, consulte a documentação completa ou entre em contato através do formulário de suporte no site.

---

Guia Equilíbrio Digital - Maio de 2025
