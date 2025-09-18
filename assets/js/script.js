document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-nav__list .main-nav__link');
    const sections = document.querySelectorAll('main section[id]');
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('mainMenu');
    const contactButton = document.querySelector('.header .button--contact');
    const themeToggle = document.getElementById('themeToggle');
    const contactForm = document.getElementById('contactForm');

    const getHeaderHeight = () => header.offsetHeight;

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (mainMenu.classList.contains('is-open')) {
                mainMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                document.body.style.overflowY = 'auto';
            }

            if (targetElement) {
                const headerHeight = getHeaderHeight();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerHeight - 10;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                navLinks.forEach(nav => nav.classList.remove('main-nav__link--active'));
                this.classList.add('main-nav__link--active');
            }
        });
    });

    contactButton.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = '#contact';
        const targetElement = document.querySelector(targetId);

        if (mainMenu.classList.contains('is-open')) {
            mainMenu.classList.remove('is-open');
            menuToggle.classList.remove('is-active');
            document.body.style.overflowY = 'auto';
        }

        if (targetElement) {
            const headerHeight = getHeaderHeight();
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition - headerHeight - 10;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });

            navLinks.forEach(nav => nav.classList.remove('main-nav__link--active'));
        }
    });

    const highlightActiveLink = () => {
        let currentActiveSectionId = 'home';
        const headerHeight = getHeaderHeight();

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const topThreshold = headerHeight + 50;
            const bottomThreshold = headerHeight + 100;

            if (rect.top <= topThreshold && rect.bottom >= bottomThreshold) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('main-nav__link--active');
            if (link.getAttribute('href').substring(1) === currentActiveSectionId) {
                link.classList.add('main-nav__link--active');
            }
        });

        if (window.scrollY < headerHeight + 50) {
            const homeLink = document.querySelector('.main-nav__link[href="#home"]');
            if (homeLink) {
                navLinks.forEach(link => link.classList.remove('main-nav__link--active'));
                homeLink.classList.add('main-nav__link--active');
            }
        }
    };

    menuToggle.addEventListener('click', () => {
        mainMenu.classList.toggle('is-open');
        menuToggle.classList.toggle('is-active');
        if (mainMenu.classList.contains('is-open')) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        themeToggle.querySelector('.theme-toggle__icon').textContent = isLightMode ? '☀️' : '🌙';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('.theme-toggle__icon').textContent = '☀️';
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.querySelector('.theme-toggle__icon').textContent = '🌙';
    }

    window.addEventListener('scroll', highlightActiveLink);
    window.addEventListener('load', highlightActiveLink);
    highlightActiveLink();

    if (contactForm) {
        emailjs.init("_cYbP8K99z-13hmhh");

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            emailjs.sendForm('service_8rzno8w', 'template_grju3ta', this)
                .then(() => {
                    alert('Email odoslaný! 📧');
                    contactForm.reset();
                }, (error) => {
                    alert('Chyba pri odosielaní: ' + JSON.stringify(error));
                });
        });
    }
});
