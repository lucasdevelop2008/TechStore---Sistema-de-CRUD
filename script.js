// ============================================
// DADOS INICIAIS
// ============================================

const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "MacBook Pro 14",
        category: "Notebooks",
        price: 9999.99,
        stock: 5,
        description: "Laptop profissional de alta performance com processador M3 Pro"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        category: "Smartphones",
        price: 7999.99,
        stock: 12,
        description: "Smartphone flagship com câmera avançada e design premium"
    },
    {
        id: 3,
        name: "iPad Air",
        category: "Tablets",
        price: 5999.99,
        stock: 8,
        description: "Tablet versátil para trabalho e criatividade com tela Liquid Retina"
    },
    {
        id: 4,
        name: "AirPods Pro",
        category: "Acessórios",
        price: 1999.99,
        stock: 25,
        description: "Fones com cancelamento de ruído ativo e áudio espacial"
    },
    {
        id: 5,
        name: "Magic Mouse",
        category: "Periféricos",
        price: 799.99,
        stock: 15,
        description: "Mouse sem fio com superfície multi-toque e design elegante"
    }
];

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================

let products = [...INITIAL_PRODUCTS];
let editingId = null;
let deleteId = null;
let currentSort = { field: 'name', order: 'asc' };
let searchTerm = '';
let categoryFilter = '';

// ============================================
// ELEMENTOS DO DOM
// ============================================

const btnNovoBtn = document.getElementById('btnNovoBtn');
const modalOverlay = document.getElementById('modalOverlay');
const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelForm = document.getElementById('btnCancelForm');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const categoryFilter_el = document.getElementById('categoryFilter');
const productsTable = document.getElementById('productsTable');
const productsBody = document.getElementById('productsBody');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');
const toast = document.getElementById('toast');

// Campos do formulário
const productName = document.getElementById('productName');
const productCategory = document.getElementById('productCategory');
const productPrice = document.getElementById('productPrice');
const productStock = document.getElementById('productStock');
const productDescription = document.getElementById('productDescription');

// ============================================
// EVENT LISTENERS
// ============================================

btnNovoBtn.addEventListener('click', openNewProductModal);
btnCloseModal.addEventListener('click', closeModal);
btnCancelForm.addEventListener('click', closeModal);
btnCancelDelete.addEventListener('click', closeDeleteModal);
btnConfirmDelete.addEventListener('click', confirmDelete);
productForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', handleSearch);
categoryFilter_el.addEventListener('change', handleCategoryFilter);

// Event listeners para ordenação
document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', handleSort);
});

// ============================================
// FUNÇÕES PRINCIPAIS - MODAL
// ============================================

function openNewProductModal() {
    editingId = null;
    modalTitle.textContent = 'Novo Produto';
    productForm.reset();
    clearErrors();
    modalOverlay.classList.add('active');
}

function openEditProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingId = id;
    modalTitle.textContent = 'Editar Produto';
    productName.value = product.name;
    productCategory.value = product.category;
    productPrice.value = product.price;
    productStock.value = product.stock;
    productDescription.value = product.description;
    clearErrors();
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    productForm.reset();
    clearErrors();
    editingId = null;
}

function closeDeleteModal() {
    deleteModalOverlay.classList.remove('active');
    deleteId = null;
}

// ============================================
// FUNÇÕES PRINCIPAIS - CRUD
// ============================================

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        showToast('Verifique os erros no formulário', 'error');
        return;
    }

    const formData = {
        name: productName.value.trim(),
        category: productCategory.value,
        price: parseFloat(productPrice.value),
        stock: parseInt(productStock.value),
        description: productDescription.value.trim()
    };

    if (editingId) {
        // Editar
        const index = products.findIndex(p => p.id === editingId);
        if (index !== -1) {
            products[index] = { ...products[index], ...formData };
            showToast('Produto atualizado com sucesso!', 'success');
        }
    } else {
        // Criar
        const newProduct = {
            id: Date.now(),
            ...formData
        };
        products.push(newProduct);
        showToast('Produto criado com sucesso!', 'success');
    }

    closeModal();
    renderProducts();
}

function deleteProduct(id) {
    deleteId = id;
    deleteModalOverlay.classList.add('active');
}

function confirmDelete() {
    if (deleteId) {
        products = products.filter(p => p.id !== deleteId);
        showToast('Produto excluído com sucesso!', 'success');
        closeDeleteModal();
        renderProducts();
    }
}

// ============================================
// FUNÇÕES - VALIDAÇÃO
// ============================================

function validateForm() {
    clearErrors();
    let isValid = true;

    // Validar Nome
    if (!productName.value.trim()) {
        showError('errorName', 'Nome do produto é obrigatório');
        isValid = false;
    } else if (productName.value.trim().length < 3) {
        showError('errorName', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    }

    // Validar Categoria
    if (!productCategory.value) {
        showError('errorCategory', 'Categoria é obrigatória');
        isValid = false;
    }

    // Validar Preço
    if (!productPrice.value || parseFloat(productPrice.value) <= 0) {
        showError('errorPrice', 'Preço deve ser maior que 0');
        isValid = false;
    }

    // Validar Estoque
    if (productStock.value === '' || parseInt(productStock.value) < 0) {
        showError('errorStock', 'Estoque não pode ser negativo');
        isValid = false;
    }

    // Validar Descrição
    if (!productDescription.value.trim()) {
        showError('errorDescription', 'Descrição é obrigatória');
        isValid = false;
    } else if (productDescription.value.trim().length < 10) {
        showError('errorDescription', 'Descrição deve ter pelo menos 10 caracteres');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// ============================================
// FUNÇÕES - BUSCA E FILTRO
// ============================================

function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    renderProducts();
}

function handleCategoryFilter(e) {
    categoryFilter = e.target.value;
    renderProducts();
}

function handleSort(e) {
    const field = e.currentTarget.dataset.sort;

    if (currentSort.field === field) {
        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.order = 'asc';
    }

    renderProducts();
}

// ============================================
// FUNÇÕES - FILTRO E ORDENAÇÃO
// ============================================

function getFilteredAndSortedProducts() {
    let filtered = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        const matchesCategory =
            categoryFilter === '' || product.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    // Ordenação
    filtered.sort((a, b) => {
        let aValue = a[currentSort.field];
        let bValue = b[currentSort.field];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return currentSort.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSort.order === 'asc' ? 1 : -1;
        return 0;
    });

    return filtered;
}

// ============================================
// FUNÇÕES - RENDERIZAÇÃO
// ============================================

function renderProducts() {
    const filteredProducts = getFilteredAndSortedProducts();

    // Atualizar contagem
    resultCount.textContent = `${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`;

    // Mostrar/esconder tabela e empty state
    if (filteredProducts.length === 0) {
        productsTable.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    productsTable.style.display = 'table';
    emptyState.style.display = 'none';

    // Limpar tbody
    productsBody.innerHTML = '';

    // Renderizar linhas
    filteredProducts.forEach((product, index) => {
        const row = createProductRow(product, index);
        productsBody.appendChild(row);
    });

    // Atualizar ícones de ordenação
    updateSortIcons();
}

function createProductRow(product, index) {
    const row = document.createElement('tr');

    const stockClass = product.stock > 0 ? 'stock-positive' : 'stock-negative';
    const stockText = `${product.stock} unidade${product.stock !== 1 ? 's' : ''}`;

    row.innerHTML = `
        <td>
            <div class="product-name">${escapeHtml(product.name)}</div>
            <div class="product-description">${escapeHtml(product.description)}</div>
        </td>
        <td>
            <span class="category-badge">${escapeHtml(product.category)}</span>
        </td>
        <td>
            <span class="price">R$ ${product.price.toFixed(2)}</span>
        </td>
        <td>
            <span class="${stockClass}">${stockText}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-primary btn-sm" onclick="openEditProductModal(${product.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                    🗑️ Deletar
                </button>
            </div>
        </td>
    `;

    return row;
}

function updateSortIcons() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        const field = btn.dataset.sort;
        const icon = btn.querySelector('.sort-icon');

        if (field === currentSort.field) {
            icon.classList.add(currentSort.order);
        } else {
            icon.classList.remove('asc', 'desc');
        }
    });
}

// ============================================
// FUNÇÕES - NOTIFICAÇÕES
// ============================================

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    renderProducts();
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
