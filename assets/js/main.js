// Flavor & Coffee - Main JavaScript

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navClose = document.getElementById('nav-close');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');

// Initialize AOS
AOS.init({ 
    duration: 800, 
    easing: 'ease-in-out', 
    once: true, 
    offset: 100,
    disable: 'mobile' // Disable on mobile for better performance
});

// Navigation toggle
function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('translate-x-0');
    
    if (isOpen) {
        navMenu.classList.remove('translate-x-0');
        navMenu.classList.add('-translate-x-full');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        navMenu.classList.remove('-translate-x-full');
        navMenu.classList.add('translate-x-0');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close mobile menu
function closeMobileMenu() {
    navMenu.classList.remove('translate-x-0');
    navMenu.classList.add('-translate-x-full');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners
navToggle.addEventListener('click', toggleMobileMenu);
navClose.addEventListener('click', closeMobileMenu);

// Close menu when clicking outside
navMenu.addEventListener('click', (e) => {
    if (e.target === navMenu) {
        closeMobileMenu();
    }
});

// Close menu on window resize if desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        closeMobileMenu();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMobileMenu();
        }
    });
});

// Back to top functionality
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide back to top button
    if (scrollTop > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Update active navigation link
    updateActiveNavLink();
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('text-orange-400');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('text-orange-400');
                }
            });
            
            document.querySelectorAll('.nav-link-mobile').forEach(link => {
                link.classList.remove('text-orange-400');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('text-orange-400');
                }
            });
        }
    });
}

// Scroll event listener
window.addEventListener('scroll', handleScroll);

// Back to top click handler
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form validation and submission
function validateForm(formData) {
    const errors = {};
    
    // Name validation
    if (!formData.get('nome') || formData.get('nome').trim().length < 2) {
        errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    // Phone validation
    const phone = formData.get('telefone');
    if (!phone || !/^\+?[0-9\s\-\(\)]+$/.test(phone)) {
        errors.telefone = 'Telefone inválido';
    }
    
    // Email validation (optional)
    const email = formData.get('email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'E-mail inválido';
    }
    
    // Subject validation
    if (!formData.get('assunto')) {
        errors.assunto = 'Selecione um assunto';
    }
    
    // Message validation
    const message = formData.get('mensagem');
    if (!message || message.trim().length < 10) {
        errors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres';
    }
    
    return errors;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (field && errorElement) {
        field.classList.add('form-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (field && errorElement) {
        field.classList.remove('form-error');
        errorElement.style.display = 'none';
    }
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    document.querySelectorAll('.form-error').forEach(field => {
        field.classList.remove('form-error');
    });
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    successDiv.style.display = 'block';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div>Enviando...';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i><span id="submit-text">Enviar Mensagem</span>';
    }
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const errors = validateForm(formData);
        
        // Clear previous errors
        clearAllErrors();
        
        // Show validation errors
        if (Object.keys(errors).length > 0) {
            Object.keys(errors).forEach(fieldName => {
                showFieldError(fieldName, errors[fieldName]);
            });
            return;
        }
        
        // Set loading state
        setLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // On success
            showSuccess('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            
            // Send WhatsApp message as fallback
            const nome = formData.get('nome');
            const telefone = formData.get('telefone');
            const assunto = formData.get('assunto');
            const mensagem = formData.get('mensagem');
            
            const whatsappMessage = `Olá, sou ${nome}. ${mensagem}`;
            const whatsappUrl = `https://wa.me/244900000000?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato via WhatsApp.');
        } finally {
            setLoading(false);
        }
    });
}

// Real-time form validation
document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea').forEach(field => {
    field.addEventListener('blur', () => {
        const formData = new FormData(contactForm);
        const errors = validateForm(formData);
        
        if (errors[field.name]) {
            showFieldError(field.name, errors[field.name]);
        } else {
            clearFieldError(field.name);
        }
    });
    
    field.addEventListener('input', () => {
        if (field.classList.contains('form-error')) {
            clearFieldError(field.name);
        }
    });
});

// Phone number formatting
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 2) {
            value = '+' + value;
        } else if (value.length <= 11) {
            value = '+' + value.substring(0, 2) + ' ' + value.substring(2);
        } else {
            value = '+' + value.substring(0, 2) + ' ' + value.substring(2, 9) + ' ' + value.substring(9, 13);
        }
    }
    
    e.target.value = value;
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    updateActiveNavLink();
    
    // Add loading class to images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}