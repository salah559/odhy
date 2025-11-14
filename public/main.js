const API_URL = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initSmoothScroll();
  initMobileMenu();
  initContactForm();
  initScrollAnimations();
});

async function loadProducts() {
  const productsGrid = document.getElementById('productsGrid');
  
  try {
    const response = await fetch(`${API_URL}/api/products`);
    const products = await response.json();
    
    if (products && products.length > 0) {
      productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
          <div class="product-image">
            <span class="product-badge">متوفر</span>
            🐑
          </div>
          <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
              <span>الوزن: ${product.weight}</span>
            </div>
            <div class="product-price">
              <div class="price">
                <span class="price-currency">دج</span>
                ${product.price.toLocaleString('ar-DZ')}
              </div>
            </div>
            <button class="product-btn" onclick="orderProduct(${product.id})">
              اطلب الآن
            </button>
          </div>
        </div>
      `).join('');
      
      setTimeout(() => {
        initScrollAnimations();
      }, 100);
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

function orderProduct(productId) {
  alert(`تم اختيار المنتج رقم ${productId}. سيتم تحويلك إلى صفحة الطلب قريباً!`);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
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

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      alert('شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.');
      contactForm.reset();
    });
  }
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .product-card, .step, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  
  if (window.scrollY > 100) {
    header.style.background = 'rgba(26, 26, 26, 0.98)';
    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
  } else {
    header.style.background = 'rgba(26, 26, 26, 0.95)';
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  }
  
  const scrollBtn = document.querySelector('.hero-scroll');
  if (scrollBtn && window.scrollY > 300) {
    scrollBtn.style.opacity = '0';
  } else if (scrollBtn) {
    scrollBtn.style.opacity = '1';
  }
});

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

console.log('منصة أضحيتي جاهزة! 🐑✨');
console.log('API URL:', API_URL);
