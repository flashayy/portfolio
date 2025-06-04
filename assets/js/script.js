document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-nav__list .main-nav__link');
    // Vyberie všetky sekcie, ktoré majú ID a nachádzajú sa priamo v <main>
    const sections = document.querySelectorAll('main section[id]');
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('mainMenu');

    // Dynamicky získa výšku hlavičky
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
                // Používame scrollBy pre relatívny scroll od aktuálnej pozície
                const headerHeight = getHeaderHeight();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerHeight - 10; // -10 pre malý priestor navrchu

                window.scrollBy({
                    top: offsetPosition,
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
        const headerHeight = getHeaderHeight(); // Získame výšku hlavičky

        // Prejde cez všetky sekcie a zistí, ktorá je aktuálne vo viewport-e
        sections.forEach(section => {
            const rect = section.getBoundingClientRect(); // Získa pozíciu sekcie vzhľadom na viewport

            // Kontrolujeme, či je aspoň časť sekcie viditeľná a nad hranicou hlavičky
            // Zohľadňujeme, že ak je sekcia celá nad hlavičkou, ale jej spodná časť je stále
            // blízko vrchu viewportu, môže byť považovaná za aktívnu.
            // Používame prahovú hodnotu napr. 200px od vrchu, aby sa detekovala aktívna sekcia.
            // Ak je vrchná časť sekcie nad nulou (mimo obrazovky hore) A jej spodná časť je pod nulou (stále viditeľná dole)
            // Alebo, ak je vrchná časť sekcie blízko vrchu viewportu
            const topThreshold = headerHeight + 50; // Sekcia je aktívna, ak jej vrchná časť prejde túto hranicu
            const bottomThreshold = headerHeight + 100; // Prah pre prechod na ďalšiu sekciu

            if (rect.top <= topThreshold && rect.bottom >= bottomThreshold) {
                 // Ak je sekcia dostatočne vysoko vo viewport-e a jej spodná časť je pod prahom, je aktívna
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
        // Táto podmienka by mala byť robustnejšia s getBoundingClientRect(), ale ako poistka je stále dobrá.
        if (window.scrollY < headerHeight + 50) { // Ak je scroll pozícia blízko vrchu stránky
            const homeLink = document.querySelector('.main-nav__link[href="#home"]');
            if (homeLink) {
                navLinks.forEach(link => link.classList.remove('main-nav__link--active'));
                homeLink.classList.add('main-nav__link--active');
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
    // Spusti ju aj po tom, ako sa načíta všetok obsah (napr. obrázky), aby bol offsetHeight správny
    window.addEventListener('load', highlightActiveLink);
    highlightActiveLink(); // Spusti aj pri DOMContentLoaded, pre prípad, že 'load' je príliš neskoro na prvotné nastavenie
});