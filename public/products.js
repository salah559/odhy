const API_URL = window.location.origin;
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initMobileMenu();
});

async function loadProducts(category = 'all') {
  const productsGrid = document.getElementById('productsGrid');
  
  try {
    const url = category === 'all' 
      ? `${API_URL}/api/products` 
      : `${API_URL}/api/products/category/${category}`;
    
    const response = await fetch(url);
    const products = await response.json();
    allProducts = products;
    
    if (products && products.length > 0) {
      displayProducts(products);
    } else {
      productsGrid.innerHTML = '<p class="product-loading">لا توجد منتجات متاحة حالياً</p>';
    }
  } catch (error) {
    console.error('خطأ في تحميل المنتجات:', error);
    productsGrid.innerHTML = `
      <div class="product-loading">
        <p>حدث خطأ في تحميل المنتجات. يرجى المحاولة لاحقاً.</p>
      </div>
    `;
  }
}

function displayProducts(products) {
  const productsGrid = document.getElementById('productsGrid');
  
  productsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        ${product.is_featured ? '<span class="product-badge">مميز</span>' : ''}
        ${product.discount > 0 ? `<span class="product-badge" style="left: auto; right: 15px; background: #e53935;">خصم ${product.discount}%</span>` : ''}
        🐑
      </div>
      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description || ''}</p>
        <div class="product-details">
          <span>الوزن: ${product.weight}</span>
          <span>العمر: ${product.age} سنة</span>
        </div>
        <div class="product-details">
          <span>السلالة: ${product.breed}</span>
          <span>الفئة: ${product.category}</span>
        </div>
        <div class="product-price">
          <div class="price">
            ${product.discount > 0 ? `
              <div style="text-decoration: line-through; font-size: 1.2rem; color: #999;">
                ${Number(product.price).toLocaleString('ar-DZ')} دج
              </div>
              <div>
                <span class="price-currency">دج</span>
                ${(Number(product.price) * (1 - product.discount / 100)).toLocaleString('ar-DZ')}
              </div>
            ` : `
              <span class="price-currency">دج</span>
              ${Number(product.price).toLocaleString('ar-DZ')}
            `}
          </div>
        </div>
        <button class="product-btn" onclick="orderProduct(${product.id})">
          اطلب الآن
        </button>
      </div>
    </div>
  `).join('');
}

function filterProducts(category, event) {
  loadProducts(category);
  
  document.querySelectorAll('.filter-section .btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (event && event.target) {
    event.target.classList.add('active');
  }
}

function orderProduct(productId) {
  window.location.href = `/#contact`;
}

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.nav');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }
}
