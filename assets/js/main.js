// Flavor & Coffee - Main JavaScript

// DOM Elements (removidos os que não existem no HTML: contactForm, submitBtn, submitText)
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navClose = document.getElementById('nav-close');
const backToTop = document.getElementById('back-to-top');

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

// Back to top functionality (corrigido para funcionar com classes Tailwind)
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide back to top button (usando classes corretas do HTML/Tailwind)
    if (scrollTop > 300) {
        backToTop.classList.remove('opacity-0', 'invisible');
        backToTop.classList.add('opacity-100', 'visible');
    } else {
        backToTop.classList.remove('opacity-100', 'visible');
        backToTop.classList.add('opacity-0', 'invisible');
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
                link.classList.remove('text-yellow-400');
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