TechStore - Sistema de Cadastro CRUD

Um sistema completo de cadastro de produtos desenvolvido com HTML, CSS e JavaScript vanilla (sem dependências externas).

📦 O que está incluído

• index.html - Estrutura HTML da aplicação

• style.css - Estilos CSS responsivos

• script.js - Lógica JavaScript do CRUD

🚀 Como usar

1. Extrair o ZIP

Descompacte o arquivo techstore-crud.zip em uma pasta.

2. Abrir no navegador

Abra o arquivo index.html diretamente no seu navegador:

• Clique duas vezes em index.html

• Ou arraste o arquivo para o navegador

• Ou clique com botão direito → "Abrir com" → navegador

Pronto! A aplicação está funcionando.

✨ Funcionalidades

✅ CRUD Completo

• Criar: Clique em "Novo Produto" para adicionar um produto

• Listar: Todos os produtos aparecem em uma tabela

• Editar: Clique em "Editar" para modificar um produto

• Deletar: Clique em "Deletar" para remover um produto

🔍 Busca em Tempo Real

• Digite na barra de busca para encontrar produtos por nome ou descrição

• Os resultados aparecem instantaneamente

📂 Filtro por Categoria

• Use o dropdown para filtrar por:

• Notebooks

• Smartphones

• Tablets

• Acessórios

• Periféricos

⬆️⬇️ Ordenação Dinâmica

• Clique nos cabeçalhos "Produto", "Preço" ou "Estoque" para ordenar

• Primeira clique: ordem crescente (↑)

• Segunda clique: ordem decrescente (↓)

✔️ Validação de Formulário

• Nome: mínimo 3 caracteres

• Preço: deve ser maior que 0

• Estoque: não pode ser negativo

• Descrição: mínimo 10 caracteres

📱 Responsivo

• Funciona em desktop, tablet e mobile

• Interface se adapta automaticamente

📊 Dados de Exemplo

O sistema vem com 5 produtos pré-carregados:

Produto
Categoria
Preço
Estoque
MacBook Pro 14
Notebooks
R$ 9.999,99
5
iPhone 15 Pro
Smartphones
R$ 7.999,99
12
iPad Air
Tablets
R$ 5.999,99
8
AirPods Pro
Acessórios
R$ 1.999,99
25
Magic Mouse
Periféricos
R$ 799,99
15

🎯 Passo a Passo - Criar um Produto

1. Clique no botão "+ Novo Produto" no topo

2. Preencha os campos:

• Nome: Digite o nome do produto

• Categoria: Selecione uma categoria

• Preço: Digite o valor em reais

• Estoque: Digite a quantidade

• Descrição: Descreva o produto

3. Clique em "Salvar"

4. O produto aparecerá na tabela

🎯 Passo a Passo - Editar um Produto

1. Encontre o produto na tabela

2. Clique no botão "✏️ Editar"

3. Modifique os campos desejados

4. Clique em "Salvar"

🎯 Passo a Passo - Deletar um Produto

1. Encontre o produto na tabela

2. Clique no botão "🗑️ Deletar"

3. Confirme a exclusão no diálogo

4. O produto será removido

🔧 Publicar no GitHub Pages

Opção 1: Repositório de Usuário

Bash

# 1. Crie um repositório chamado seu-usuario.github.io
# 2. Clone o repositório
git clone https://github.com/seu-usuario/seu-usuario.github.io.git

# 3. Copie os 3 arquivos para a pasta
cp index.html style.css script.js seu-usuario.github.io/

# 4. Faça commit e push
cd seu-usuario.github.io
git add .
git commit -m "Adicionar TechStore CRUD"
git push origin main

# 5. Acesse: https://seu-usuario.github.io

Opção 2: Repositório de Projeto

Bash

# 1. Crie um repositório chamado tech-store-crud
# 2. Clone o repositório
git clone https://github.com/seu-usuario/tech-store-crud.git

# 3. Copie os 3 arquivos
cp index.html style.css script.js tech-store-crud/

# 4. Faça commit e push
cd tech-store-crud
git add .
git commit -m "Adicionar TechStore CRUD"
git push origin main

# 5. Vá em Settings → Pages → Source → main branch
# 6. Acesse: https://seu-usuario.github.io/tech-store-crud

💾 Persistência de Dados

Importante: Os dados são armazenados apenas na memória do navegador. Isso significa:

• ✅ Os dados persistem enquanto você está na página

• ❌ Os dados são perdidos ao recarregar a página

• ❌ Os dados não são salvos em banco de dados

Para salvar os dados permanentemente, você precisaria:

1. Implementar um backend (Node.js, Python, etc. )

2. Conectar a um banco de dados (PostgreSQL, MongoDB, etc.)

3. Usar localStorage do navegador (dados limitados)

Usar localStorage (Simples)

Se quiser que os dados persistam entre recarregamentos, você pode adicionar ao script.js:

JavaScript


// Salvar dados
function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Carregar dados
function loadFromLocalStorage() {
    const saved = localStorage.getItem('products');
    if (saved) {
        products = JSON.parse(saved);
    }
}

// Chamar loadFromLocalStorage() na função init()


🎨 Customizar

Mudar Cores

Abra style.css e procure por :root:

CSS

:root {
    --primary-color: #0891b2;  /* Cor principal */
    --danger-color: #ef4444;   /* Cor de perigo */
    --success-color: #10b981;  /* Cor de sucesso */
    /* ... mais cores ... */
}


Adicionar Categorias

Abra index.html e procure por <select id="categoryFilter">:

HTML

<option value="Nova Categoria">Nova Categoria</option>


Também adicione em script.js (se necessário).

Mudar Dados Iniciais

Abra script.js e modifique INITIAL_PRODUCTS:

JavaScript

const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Seu Produto",
        category: "Sua Categoria",
        price: 99.99,
        stock: 10,
        description: "Descrição do produto"
    },
    // ... mais produtos ...
];

🐛 Solução de Problemas

A página abre em branco

• Verifique se os 3 arquivos estão na mesma pasta

• Certifique-se de que os nomes estão corretos:

• index.html

• style.css

• script.js

Os estilos não aparecem

• Verifique se style.css está na mesma pasta que index.html

• Recarregue a página (Ctrl+F5 ou Cmd+Shift+R)

Os botões não funcionam

• Verifique se script.js está na mesma pasta

• Abra o console (F12) e procure por erros

• Recarregue a página

Os dados desapareceram após recarregar

• Isso é normal! Os dados são temporários

• Use localStorage se quiser persistência

📚 Estrutura de Dados

JavaScript


{
    id: 1,                    // ID único
    name: "Produto",          // Nome
    category: "Categoria",    // Categoria
    price: 99.99,            // Preço em reais
    stock: 10,               // Quantidade em estoque
    description: "Descrição" // Descrição detalhada
}


🎓 Aprendizado

Este projeto demonstra:

• HTML semântico

• CSS Grid e Flexbox

• JavaScript vanilla (sem frameworks)

• Manipulação do DOM

• Event listeners

• Validação de formulários

• Filtro e ordenação de dados

• Responsividade mobile-first

📝 Licença

Projeto de demonstração educacional. Sinta-se livre para usar e modificar.

✅ Checklist

Extraiu o ZIP

Abriu index.html no navegador

Consegue ver a tabela com 5 produtos

Consegue criar um novo produto

Consegue editar um produto

Consegue deletar um produto

Consegue buscar produtos

Consegue filtrar por categoria

Consegue ordenar por nome, preço e estoque

Pronto para usar! Divirta-se com o TechStore CRUD! 🚀


