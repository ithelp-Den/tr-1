document.addEventListener("DOMContentLoaded", () => {
        // === АНІМАЦІЯ ЦИФР ===
        const counters = document.querySelectorAll('.counter-value');
        const coachSection = document.getElementById('coach-counters');
        
        // Час анімації в мілісекундах (2 секунди)
        const animationDuration = 2000; 

        const animateCounters = () => {
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const isFloat = counter.getAttribute('data-is-float') === 'true';
                const startTime = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / animationDuration, 1); 
                    const easeOut = progress * (2 - progress); 
                    const currentVal = target * easeOut;

                    if (isFloat) {
                        counter.innerText = currentVal.toFixed(1); 
                    } else {
                        counter.innerText = Math.floor(currentVal);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = isFloat ? target.toFixed(1) : target;
                    }
                };

                requestAnimationFrame(updateCounter);
            });
        };

        if (coachSection) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        obs.unobserve(entry.target); 
                    }
                });
            }, { 
                threshold: 0.5 
            }); 

            observer.observe(coachSection);
        }
    });