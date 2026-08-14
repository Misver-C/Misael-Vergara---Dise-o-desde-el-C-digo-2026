document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById("splash-screen");

    // Pequeño retraso para asegurar que el navegador pinta el fondo blanco primero
    setTimeout(() => {
        // Agregamos la clase que dispara la animación en CSS
        splashScreen.classList.add("animate");
        
        // La animación dura 0.5s (500ms). Eliminamos el elemento del DOM después de que termine 
        // para mantener el HTML limpio y asegurar que no interfiera.
        setTimeout(() => {
            splashScreen.remove();
        }, 500);
        
    }, 100);
});
