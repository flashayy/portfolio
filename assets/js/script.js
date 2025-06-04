document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-nav__list .main-nav__link');
    // Vyberie všetky sekcie, ktoré majú ID a nachádzajú sa priamo v <main>
    const sections = document.querySelectorAll('main section[id]');
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('mainMenu');

    const getHeaderHeight = () => header.offsetHeight;

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href'); // Získa #home, #services atď.
            const targetElement = document.querySelector(targetId);

            // Ak je menu otvorené, zatvor ho po kliknutí na link
            if (mainMenu.classList.contains('is-open')) {
                mainMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                document.body.style.overflowY = 'auto'; // Uvoľni scroll
            }

            if (targetElement) {
                // Posun o výšku hlavičky plus malý offset, aby sekcia nebola presne pod hlavičkou
                const offsetTop = targetElement.offsetTop - getHeaderHeight() - 10;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Odstráni aktívnu triedu zo všetkých linkov a pridá ju na kliknutý link
                navLinks.forEach(nav => nav.classList.remove('main-nav__link--active'));
                this.classList.add('main-nav__link--active');
            }
        });
    });

    // Funkcia na zvýraznenie aktívneho navigačného linku
    const highlightActiveLink = () => {
        let currentActiveSectionId = 'home'; // Predvolená aktívna sekcia je 'home'

        // Prejde cez všetky sekcie a zistí, ktorá je aktuálne vo viewport-e
        sections.forEach(section => {
            // Vypočíta pozíciu sekcie s ohľadom na výšku hlavičky a dodatočný offset
            const sectionTop = section.offsetTop - getHeaderHeight() - 50;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Ak je horný okraj okna v rámci sekcie, nastav túto sekciu ako aktívnu
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        // Prejde cez všetky navigačné linky a aktualizuje ich aktívny stav
        navLinks.forEach(link => {
            link.classList.remove('main-nav__link--active'); // Najprv odstráni aktívnu triedu zo všetkých

            // Ak sa href linku zhoduje s ID aktuálnej sekcie, pridá triedu
            if (link.getAttribute('href').substring(1) === currentActiveSectionId) {
                link.classList.add('main-nav__link--active');
            }
        });

        // Špeciálny prípad: Ak je stránka úplne hore, uisti sa, že Home link je aktívny
        // Toto je dôležité, ak by scrollovanie nebolo dostatočne citlivé na nulu
        if (window.scrollY === 0) {
            const homeLink = document.querySelector('.main-nav__link[href="#home"]');
            if (homeLink) { // Uisti sa, že link existuje
                navLinks.forEach(link => link.classList.remove('main-nav__link--active')); // Opäť, odstráň všetky
                homeLink.classList.add('main-nav__link--active'); // Nastav Home ako aktívny
            }
        }
    };

    // Event listener pre hamburger tlačidlo
    menuToggle.addEventListener('click', () => {
        mainMenu.classList.toggle('is-open');
        menuToggle.classList.toggle('is-active');
        if (mainMenu.classList.contains('is-open')) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    });

    // Spusti funkciu pri scrollovaní
    window.addEventListener('scroll', highlightActiveLink);

    // KĽÚČOVÉ: Spusti funkciu hneď po načítaní stránky
    // Toto zabezpečí, že "Home" bude aktívny pri prvom zobrazení
    highlightActiveLink();
});