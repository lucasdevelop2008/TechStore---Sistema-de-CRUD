/* ============================================
   TECHSTORE PRO - APPLICATION LOGIC
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

let appState = {
    products: [],
    editingId: null,
    currentView: 'dashboard',
    darkMode: localStorage.getItem('darkMode') === 'true',
    notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
    notifications: 0
};

// ============================================
// SAMPLE DATA
// ============================================

const sampleProducts = [
    {
        id: 1,
        name: 'MacBook Pro 14',
        category: 'Notebooks',
        price: 9999.99,
        stock: 5,
        description: 'Laptop profissional de alta performance com processador M3 Pro',
        image: 'https://via.placeholder.com/200?text=MacBook+Pro'
    },
    {
        id: 2,
        name: 'iPhone 15 Pro',
        category: 'Smartphones',
        price: 7999.99,
        stock: 12,
        description: 'Smartphone flagship com câmera avançada e design premium',
        image: 'https://via.placeholder.com/200?text=iPhone+15'
    },
    {
        id: 3,
        name: 'iPad Air',
        category: 'Tablets',
        price: 5999.99,
        stock: 8,
        description: 'Tablet versátil para trabalho e criatividade com tela Liquid Retina',
        image: 'https://via.placeholder.com/200?text=iPad+Air'
    },
    {
        id: 4,
        name: 'AirPods Pro',
        category: 'Acessórios',
        price: 1999.99,
        stock: 25,
        description: 'Fones com cancelamento de ruído ativo e áudio espacial',
        image: 'https://via.placeholder.com/200?text=AirPods'
    },
    {
        id: 5,
        name: 'Magic Mouse',
        category: 'Periféricos',
        price: 799.99,
        stock: 15,
        description: 'Mouse sem fio com superfície multi-toque e design elegante',
        image: 'https://via.placeholder.com/200?text=Magic+Mouse'
    }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadProducts();
    
    // Apply theme
    applyTheme();
    
    // Setup event listeners
    setupEventListeners();
    
    // Render initial view
    renderDashboard();
    
    // Load sample data if empty
    if (appState.products.length === 0) {
        appState.products = JSON.parse(JSON.stringify(sampleProducts));
        saveProducts();
        renderDashboard();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        appState.darkMode = e.target.checked;
        applyTheme();
    });

    // Product modal
    document.getElementById('newProductBtn').addEventListener('click', openProductModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);
    document.getElementById('cancelFormBtn').addEventListener('click', closeProductModal);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);

    // Search and filter
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);

    // Settings
    document.getElementById('clearDataBtn').addEventListener('click', () => {
        showConfirmDialog('Tem certeza que deseja limpar todos os dados?', () => {
            appState.products = [];
            saveProducts();
            renderProducts();
            showToast('Dados limpos com sucesso', 'success');
        });
    });

    document.getElementById('resetDataBtn').addEventListener('click', () => {
        appState.products = JSON.parse(JSON.stringify(sampleProducts));
        saveProducts();
        renderProducts();
        showToast('Dados de exemplo carregados', 'success');
    });

    // Confirm dialog
    document.getElementById('confirmCancel').addEventListener('click', closeConfirmDialog);
    document.getElementById('confirmOk').addEventListener('click', executeConfirmAction);

    // Close modal on background click
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') {
            closeProductModal();
        }
    });

    document.getElementById('confirmDialog').addEventListener('click', (e) => {
        if (e.target.id === 'confirmDialog') {
            closeConfirmDialog();
        }
    });
}

// ============================================
// VIEW MANAGEMENT
// ============================================

function switchView(view) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Show selected view
    document.getElementById(`${view}-view`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        products: 'Produtos',
        analytics: 'Análises',
        settings: 'Configurações'
    };
    document.getElementById('pageTitle').textContent = titles[view];

    // Render view content
    switch(view) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'products':
            renderProducts();
            break;
        case 'analytics':
            renderAnalytics();
            break;
    }

    appState.currentView = view;
}

// ============================================
// DASHBOARD VIEW
// ============================================

function renderDashboard() {
    updateMetrics();
    renderCharts();
}

function updateMetrics() {
    const totalProducts = appState.products.length;
    const totalValue = appState.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const categories = new Set(appState.products.map(p => p.category)).size;
    const lowStock = appState.products.filter(p => p.stock < 10).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalCategories').textContent = categories;
    document.getElementById('lowStock').textContent = lowStock;
}

function renderCharts() {
    renderCategoryChart();
    renderValueChart();
}

function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart')?.getContext('2d');
    if (!ctx) return;

    const categories = {};
    appState.products.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#1e40af',
                    '#0d9488',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ],
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary'),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        font: { family: "'Poppins', sans-serif" }
                    }
                }
            }
        }
    });

    // Store chart reference to destroy later
    if (window.categoryChartInstance) window.categoryChartInstance.destroy();
    window.categoryChartInstance = chart;
}

function renderValueChart() {
    const ctx = document.getElementById('valueChart')?.getContext('2d');
    if (!ctx) return;

    const categories = {};
    appState.products.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + (p.price * p.stock);
    });

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Valor em Estoque (R$)',
                data: Object.values(categories),
                backgroundColor: '#1e40af',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        font: { family: "'Poppins', sans-serif" }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    if (window.valueChartInstance) window.valueChartInstance.destroy();
    window.valueChartInstance = chart;
}

// ============================================
// PRODUCTS VIEW
// ============================================

function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    if (appState.products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum produto cadastrado</td></tr>';
        return;
    }

    appState.products.forEach(product => {
        const row = createProductRow(product);
        tbody.appendChild(row);
    });
}

function createProductRow(product) {
    const row = document.createElement('tr');
    const total = (product.price * product.stock).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const price = product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const stockClass = product.stock < 10 ? 'stock-low' : '';

    row.innerHTML = `
        <td>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description || 'Sem descrição'}</div>
        </td>
        <td><span class="category-badge">${product.category}</span></td>
        <td><span class="price-value">R$ ${price}</span></td>
        <td><span class="stock-value ${stockClass}">${product.stock} un.</span></td>
        <td>R$ ${total}</td>
        <td>
            <div class="actions-cell">
                <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        </td>
    `;

    return row;
}

function filterProducts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filtered = appState.products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search) || 
                          p.description.toLowerCase().includes(search);
        const matchCategory = !category || p.category === category;
        return matchSearch && matchCategory;
    });

    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum produto encontrado</td></tr>';
        return;
    }

    filtered.forEach(product => {
        const row = createProductRow(product);
        tbody.appendChild(row);
    });
}

// ============================================
// PRODUCT MODAL
// ============================================

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalTitle');

    form.reset();
    appState.editingId = productId;

    if (productId) {
        const product = appState.products.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Editar Produto';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productDescription').value = product.description || '';
        }
    } else {
        title.textContent = 'Novo Produto';
    }

    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    appState.editingId = null;
}

function handleProductSubmit(e) {
    e.preventDefault();

    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value || 'https://via.placeholder.com/200?text=Produto',
        description: document.getElementById('productDescription').value
    };

    if (appState.editingId) {
        const index = appState.products.findIndex(p => p.id === appState.editingId);
        if (index !== -1) {
            appState.products[index] = { ...appState.products[index], ...product };
            showToast('Produto atualizado com sucesso', 'success');
        }
    } else {
        product.id = Math.max(...appState.products.map(p => p.id), 0) + 1;
        appState.products.push(product);
        showToast('Produto adicionado com sucesso', 'success');
    }

    saveProducts();
    closeProductModal();
    renderProducts();
    updateMetrics();
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    showConfirmDialog('Tem certeza que deseja deletar este produto?', () => {
        appState.products = appState.products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        updateMetrics();
        showToast('Produto deletado com sucesso', 'success');
    });
}

// ============================================
// ANALYTICS VIEW
// ============================================

function renderAnalytics() {
    renderAnalyticsByCategory();
    renderAnalyticsByValue();
    renderAnalyticsLowStock();
    renderAnalyticsStats();
}

function renderAnalyticsByCategory() {
    const categories = {};
    appState.products.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });

    const container = document.getElementById('analyticsCategory');
    container.innerHTML = '';

    Object.entries(categories).forEach(([category, count]) => {
        const item = document.createElement('div');
        item.className = 'analytics-item';
        item.innerHTML = `
            <span class="analytics-item-label">${category}</span>
            <span class="analytics-item-value">${count} produtos</span>
        `;
        container.appendChild(item);
    });
}

function renderAnalyticsByValue() {
    const sorted = [...appState.products]
        .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
        .slice(0, 5);

    const container = document.getElementById('analyticsValue');
    container.innerHTML = '';

    sorted.forEach(product => {
        const value = (product.price * product.stock).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const item = document.createElement('div');
        item.className = 'analytics-item';
        item.innerHTML = `
            <span class="analytics-item-label">${product.name}</span>
            <span class="analytics-item-value">R$ ${value}</span>
        `;
        container.appendChild(item);
    });
}

function renderAnalyticsLowStock() {
    const lowStock = appState.products.filter(p => p.stock < 10);

    const container = document.getElementById('analyticsLowStock');
    container.innerHTML = '';

    if (lowStock.length === 0) {
        container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-secondary);">Todos os produtos têm estoque adequado</div>';
        return;
    }

    lowStock.forEach(product => {
        const item = document.createElement('div');
        item.className = 'analytics-item';
        item.innerHTML = `
            <span class="analytics-item-label">${product.name}</span>
            <span class="analytics-item-value" style="color: var(--danger);">${product.stock} un.</span>
        `;
        container.appendChild(item);
    });
}

function renderAnalyticsStats() {
    const totalProducts = appState.products.length;
    const totalValue = appState.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const avgPrice = totalProducts > 0 ? appState.products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const totalStock = appState.products.reduce((sum, p) => sum + p.stock, 0);

    const container = document.getElementById('analyticsStats');
    container.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">Total de Produtos</div>
            <div class="stat-value">${totalProducts}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Valor Total</div>
            <div class="stat-value">R$ ${(totalValue / 1000).toFixed(1)}k</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Preço Médio</div>
            <div class="stat-value">R$ ${avgPrice.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Total em Estoque</div>
            <div class="stat-value">${totalStock} un.</div>
        </div>
    `;
}

// ============================================
// THEME MANAGEMENT
// ============================================

function toggleTheme() {
    appState.darkMode = !appState.darkMode;
    applyTheme();
}

function applyTheme() {
    if (appState.darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        document.getElementById('darkModeToggle').checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        document.getElementById('darkModeToggle').checked = false;
    }
    localStorage.setItem('darkMode', appState.darkMode);
}

// ============================================
// NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast active ${type}`;

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function showConfirmDialog(message, onConfirm) {
    const dialog = document.getElementById('confirmDialog');
    document.getElementById('confirmMessage').textContent = message;
    dialog.classList.add('active');
    window.confirmAction = onConfirm;
}

function closeConfirmDialog() {
    document.getElementById('confirmDialog').classList.remove('active');
    window.confirmAction = null;
}

function executeConfirmAction() {
    if (window.confirmAction) {
        window.confirmAction();
    }
    closeConfirmDialog();
}

// ============================================
// DATA PERSISTENCE
// ============================================

function saveProducts() {
    localStorage.setItem('techstore_products', JSON.stringify(appState.products));
}

function loadProducts() {
    const saved = localStorage.getItem('techstore_products');
    if (saved) {
        try {
            appState.products = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading products:', e);
            appState.products = [];
        }
    }
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

function exportToCSV() {
    if (appState.products.length === 0) {
        showToast('Nenhum produto para exportar', 'warning');
        return;
    }

    let csv = 'Nome,Categoria,Preço,Estoque,Total,Descrição\n';

    appState.products.forEach(p => {
        const total = (p.price * p.stock).toFixed(2);
        csv += `"${p.name}","${p.category}",${p.price},${p.stock},${total},"${p.description || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `techstore_produtos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Dados exportados com sucesso', 'success');
}
