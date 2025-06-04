document.addEventListener('DOMContentLoaded', () => {
    // ... (ostatné selektory) ...
    const menuToggle = document.querySelector('.menu-toggle'); // Získa referenciu na hamburger tlačidlo
    const mainMenu = document.getElementById('mainMenu'); // Získa referenciu na hlavné menu

    // ... (ostatné funkcie) ...

    // Event listener pre hamburger tlačidlo
    menuToggle.addEventListener('click', () => {
        mainMenu.classList.toggle('is-open'); // Prepína triedu pre otvorenie/zatvorenie menu
        menuToggle.classList.toggle('is-active'); // KĽÚČOVÉ: Prepína triedu pre animáciu hamburgeru
        // Zablokovanie scrollovania body, keď je menu otvorené
        if (mainMenu.classList.contains('is-open')) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    });

    // ... (ostatné event listenery a funkcie) ...

    // Pridáme event listener k navigačným linkom, aby zatvorili menu po kliknutí
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // ... (kód pre scroll) ...

            // Ak je menu otvorené, zatvor ho po kliknutí na link
            if (mainMenu.classList.contains('is-open')) {
                mainMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active'); // KĽÚČOVÉ: Zabezpečí zatvorenie "X"
                document.body.style.overflowY = 'auto'; // Uvoľni scroll
            }
        });
    });
});