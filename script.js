document.addEventListener("DOMContentLoaded", () => {
    // 1. Splash Screen Animada
    const splashScreen = document.getElementById("splash-screen");
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add("animate");
            setTimeout(() => {
                splashScreen.remove();
            }, 500);
        }, 100);
    }

    // 2. Efecto Parallax y Difuminado (Blur) en el fondo al hacer scroll
    const heroBg = document.querySelector(".hero-bg-img");
    const heroOverlay = document.querySelector(".hero-overlay");
    const mainSection = document.querySelector(".main-section");

    if (heroBg && mainSection) {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            const sectionHeight = mainSection.offsetHeight;

            // Calculamos el progreso mientras la sección principal esté a la vista
            if (scrollY <= sectionHeight * 1.5) {
                // Progreso de 0 (arriba) a 1 (al terminar la sección)
                const progress = Math.min(Math.max(scrollY / sectionHeight, 0), 1);

                // Movimiento Parallax: se desplaza a una velocidad del 40% del scroll
                const translateY = scrollY * 0.4;
                const scale = 1 + progress * 0.05;
                heroBg.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;

                // Efecto de difuminado progresivo: de 0px a 15px
                const blurAmount = progress * 15;
                heroBg.style.filter = `blur(${blurAmount.toFixed(1)}px)`;

                // Suave intensificación del contraste del overlay
                if (heroOverlay) {
                    heroOverlay.style.opacity = (0.7 + progress * 0.3).toString();
                }
            }

            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        // Ejecutar al inicio por si la página se carga con scroll previo
        updateParallax();
    }
});
