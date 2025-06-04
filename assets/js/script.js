document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-nav__list .main-nav__link');
    const sections = document.querySelectorAll('main section[id]');
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('mainMenu');
    const modeToggle = document.getElementById('modeToggle');

    const getHeaderHeight = () => header.offsetHeight;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            modeToggle.textContent = '☀️';
            modeToggle.setAttribute('aria-label', 'Prepnúť na tmavý režim');
        } else {
            document.body.classList.remove('light-mode');
            modeToggle.textContent = '🌙';
            modeToggle.setAttribute('aria-label', 'Prepnúť na svetlý režim');
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }

    modeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (mainMenu.classList.contains('is-open')) {
                mainMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                document.body.style.overflowY = 'auto';
            }

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - getHeaderHeight() - 10;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                navLinks.forEach(nav => nav.classList.remove('main-nav__link--active'));
                this.classList.add('main-nav__link--active');
            }
        });
    });

    const highlightActiveLink = () => {
        let currentActiveSectionId = 'home';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - getHeaderHeight() - 50;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('main-nav__link--active');

            if (link.getAttribute('href').substring(1) === currentActiveSectionId) {
                link.classList.add('main-nav__link--active');
            }
        });

        if (window.scrollY === 0) {
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

    window.addEventListener('scroll', highlightActiveLink);

    highlightActiveLink();
});