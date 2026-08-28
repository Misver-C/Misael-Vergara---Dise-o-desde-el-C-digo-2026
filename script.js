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

    // 3. Cortina Desplegable de Ejecución de Código en Vivo
    const codeCurtain = document.getElementById("code-curtain");
    const curtainCanvas = document.getElementById("curtain-canvas");
    const closeCurtainBtn = document.getElementById("close-curtain-btn");
    const curtainTitle = document.getElementById("curtain-title");
    const curtainResetBtn = document.getElementById("curtain-reset-btn");
    const codeTriggers = document.querySelectorAll(".code-trigger");

    if (codeCurtain && curtainCanvas) {
        let animationFrameId = null;
        let isCurtainOpen = false;
        let currentMode = 0;
        let activeDemoKey = "traduccion-imagen";
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;
        let time = 0;

        const ctx = curtainCanvas.getContext("2d");

        // =========================================================================
        // 🎨 CATÁLOGO DE CÓDIGOS / SKETCHES POR ENCARGO
        // Aquí puedes agregar, editar o personalizar el código para cada encargo.
        // El nombre de la clave debe coincidir con data-demo="..." en tu HTML.
        //
        // Parámetros disponibles para tus dibujos:
        // - ctx: Contexto 2D de Canvas (para pintar círculos, líneas, etc.)
        // - width, height: Ancho y alto actual del lienzo
        // - mx, my: Coordenadas del cursor del mouse
        // - time: Contador de tiempo continuo para animación
        // - mode: Modo activo (cambia con clics en el lienzo)
        // =========================================================================
        const encargosCodeDemos = {
            // Demostración para Encargo 03: Traducción de imagen (Matriz de ondas vectoriales)
            "traduccion-imagen": (ctx, width, height, mx, my, time, mode) => {
                const cols = 26;
                const rows = 16;
                const stepX = width / cols;
                const stepY = height / rows;

                for (let i = 0; i <= cols; i++) {
                    for (let j = 0; j <= rows; j++) {
                        const px = i * stepX;
                        const py = j * stepY;
                        const dist = Math.hypot(px - mx, py - my);
                        const angle = Math.atan2(py - my, px - mx) + time;
                        const wave = Math.sin(dist * 0.03 - time * 2);
                        const len = (wave + 1.2) * 12;

                        const x2 = px + Math.cos(angle) * len;
                        const y2 = py + Math.sin(angle) * len;

                        const hue = (dist * 0.6 + time * 50) % 360;
                        ctx.strokeStyle = `hsl(${hue}, 85%, 60%)`;
                        ctx.lineWidth = 2;

                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();

                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
                    }
                }
            },

            // Ejemplo de código para Encargo 04: Malla topográfica generativa
            "encargo-04": (ctx, width, height, mx, my, time, mode) => {
                const lines = 28;
                const spacing = height / lines;

                for (let l = 0; l < lines; l++) {
                    const y = l * spacing;
                    ctx.beginPath();
                    ctx.moveTo(0, y);

                    for (let x = 0; x <= width; x += 15) {
                        const dist = Math.hypot(x - mx, y - my);
                        const influence = Math.max(0, 1 - dist / 240);
                        const offset = Math.sin(x * 0.02 + time + l * 0.25) * 16 + Math.cos(dist * 0.05 - time * 3) * 38 * influence;
                        ctx.lineTo(x, y + offset);
                    }

                    const hue = (l * 12 + time * 40) % 360;
                    ctx.strokeStyle = `hsl(${hue}, 90%, 65%)`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            },

            // Ejemplo de código para Encargo 05: Anillos cinéticos
            "encargo-05": (ctx, width, height, mx, my, time, mode) => {
                const rings = 16;
                for (let r = 1; r <= rings; r++) {
                    const radius = (r * 20) + Math.sin(time * 2 + r * 0.35) * 14;
                    ctx.beginPath();
                    ctx.arc(mx, my, radius, 0, Math.PI * 2);
                    const hue = (r * 22 + time * 60) % 360;
                    ctx.strokeStyle = `hsla(${hue}, 90%, 60%, ${1 - r / rings * 0.6})`;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                }
            }
        };

        const resizeCanvas = () => {
            const rect = curtainCanvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            curtainCanvas.width = rect.width * dpr;
            curtainCanvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener("resize", () => {
            if (isCurtainOpen) resizeCanvas();
        });

        // Seguimiento del cursor para interactividad en tiempo real
        curtainCanvas.addEventListener("mousemove", (e) => {
            const rect = curtainCanvas.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
        });

        curtainCanvas.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const rect = curtainCanvas.getBoundingClientRect();
                targetMouseX = e.touches[0].clientX - rect.left;
                targetMouseY = e.touches[0].clientY - rect.top;
            }
        }, { passive: true });

        // Clic en canvas o botón para cambiar patrón
        curtainCanvas.addEventListener("click", () => {
            currentMode = (currentMode + 1) % 3;
        });

        if (curtainResetBtn) {
            curtainResetBtn.addEventListener("click", () => {
                currentMode = (currentMode + 1) % 3;
            });
        }

        // Motor de dibujo generativo (ejecutado sólo mientras la cortina está abierta)
        const drawGenerativeArt = () => {
            if (!isCurtainOpen) return;

            const rect = curtainCanvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            // Interpolación suave del movimiento del mouse
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;

            // Estela oscura de fondo
            ctx.fillStyle = "rgba(10, 10, 10, 0.22)";
            ctx.fillRect(0, 0, width, height);

            time += 0.025;

            const mx = mouseX || width / 2;
            const my = mouseY || height / 2;

            // Ejecutar la función de dibujo correspondiente al encargo activo
            const demoFunc = encargosCodeDemos[activeDemoKey] || encargosCodeDemos["traduccion-imagen"];
            demoFunc(ctx, width, height, mx, my, time, currentMode);

            animationFrameId = requestAnimationFrame(drawGenerativeArt);
        };

        const curtainHtmlDemo = document.getElementById("curtain-html-demo");
        const closeCurtainFooterBtn = document.getElementById("close-curtain-footer-btn");

        // Abrir cortina y arrancar ejecución
        const openCurtain = (title, demoKey) => {
            if (curtainTitle && title) {
                curtainTitle.textContent = title;
            }
            activeDemoKey = demoKey || "traduccion-imagen";
            codeCurtain.classList.add("active");
            codeCurtain.setAttribute("aria-hidden", "false");
            isCurtainOpen = true;

            // Si es la traducción HTML (Encargo 03)
            if (activeDemoKey === "traduccion-imagen") {
                if (curtainHtmlDemo) curtainHtmlDemo.style.display = "block";
                if (curtainCanvas) curtainCanvas.style.display = "none";
            } else {
                if (curtainHtmlDemo) curtainHtmlDemo.style.display = "none";
                if (curtainCanvas) curtainCanvas.style.display = "block";

                setTimeout(() => {
                    resizeCanvas();
                    const rect = curtainCanvas.getBoundingClientRect();
                    targetMouseX = rect.width / 2;
                    targetMouseY = rect.height / 2;
                    mouseX = targetMouseX;
                    mouseY = targetMouseY;
                    if (!animationFrameId) {
                        drawGenerativeArt();
                    }
                }, 120);
            }

            // Desplazar la vista hacia la cortina suavemente
            codeCurtain.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        // Cerrar cortina y pausar loop
        const closeCurtain = () => {
            codeCurtain.classList.remove("active");
            codeCurtain.setAttribute("aria-hidden", "true");
            isCurtainOpen = false;

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        // Asignar eventos de clic y teclado a tarjetas con disparador de código
        codeTriggers.forEach((trigger) => {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                const title = trigger.getAttribute("data-title") || "Ejecución de Código en Vivo";
                const demoKey = trigger.getAttribute("data-demo") || "traduccion-imagen";
                openCurtain(title, demoKey);
            });

            trigger.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const title = trigger.getAttribute("data-title") || "Ejecución de Código en Vivo";
                    const demoKey = trigger.getAttribute("data-demo") || "traduccion-imagen";
                    openCurtain(title, demoKey);
                }
            });
        });

        // Botones de cerrar cortina (superior y pie)
        if (closeCurtainBtn) {
            closeCurtainBtn.addEventListener("click", closeCurtain);
        }
        if (closeCurtainFooterBtn) {
            closeCurtainFooterBtn.addEventListener("click", closeCurtain);
        }
    }
});
