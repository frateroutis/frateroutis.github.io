// Main application functionality
class OutisApp {
    constructor() {
        this.currentPage = window.location.pathname;
        this.init();
    }

    init() {
        this.highlightActiveNav();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupLazyLoading();
        this.initThemeToggle();
    }

    highlightActiveNav() {
        const path = (window.location.pathname || '/').replace(/index\.html$/, '');
        document.querySelectorAll('.header-navigation nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            if (href === '/') {
                if (path === '/') link.classList.add('is-active');
            } else if (path === href || path.startsWith(href + '/')) {
                link.classList.add('is-active');
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.__rafHandled) return;
            if (e.target && e.target.classList && e.target.classList.contains('grid-item')) {
                this.handleGridClick(e);
            }
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const selector = anchor.getAttribute('href');
                if (!selector || selector === '#') return;
                const target = document.querySelector(selector);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    initializeAnimations() {
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -30px 0px'
        });

        document.querySelectorAll('.blurb, .grid-item, .api-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    handleGridClick(event) {
        const link = event.target.getAttribute('link');
        if (!link) return;

        event.target.classList.add('clicked');
        if (event.stopPropagation) event.stopPropagation();
        event.__rafHandled = true;

        this.showNotification('Abrindo link...', 'info');

        setTimeout(() => {
            window.open(link, '_blank', 'noopener');
            event.target.classList.remove('clicked');
        }, 250);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2600);
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        const themeIcon = themeToggle.querySelector('.theme-icon');

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        this.applyTheme(currentTheme);
        if (themeIcon) this.updateThemeIcon(themeIcon, currentTheme);

        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(currentTheme);
            if (themeIcon) this.updateThemeIcon(themeIcon, currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    applyTheme(theme) {
        const body = document.body;
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        }
    }

    updateThemeIcon(icon, theme) {
        if (theme === 'dark') {
            icon.textContent = '☀️';
            icon.setAttribute('aria-label', 'Mudar para modo claro');
        } else {
            icon.textContent = '🌙';
            icon.setAttribute('aria-label', 'Mudar para modo escuro');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.outisApp = new OutisApp();
});
