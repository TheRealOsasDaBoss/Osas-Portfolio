document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // --- Back to Top Logic ---
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.remove('opacity-0', 'invisible');
                backToTop.classList.add('opacity-100', 'visible');
            } else {
                backToTop.classList.add('opacity-0', 'invisible');
                backToTop.classList.remove('opacity-100', 'visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = { threshold: 0.1 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-10');
                
                // Trigger Skills Progress Animations if visible
                if (entry.target.classList.contains('skill-item') || entry.target.querySelector('.progress-fill')) {
                    animateSkills(entry.target);
                }
                // Trigger Stats Counter if visible
                if (entry.target.id === 'stat-projects') {
                    animateValue(entry.target, 0, 15, 2000);
                }
            }
        });
    }, observerOptions);

    // Target elements for reveal animations
    document.querySelectorAll('section, .glass-card, .glass-panel, #stat-projects, h1, .hero-subheadline-premium').forEach(el => {
        if (!el.classList.contains('no-reveal')) {
            el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-12');
            scrollObserver.observe(el);
        }
    });

    // --- Skills Progress Logic ---
    function animateSkills(container) {
        const fills = container.querySelectorAll('.progress-fill, .tech-progress-fill');
        fills.forEach(fill => {
            const val = fill.closest('[data-value]')?.getAttribute('data-value') || "90";
            fill.style.width = val + '%';
        });

        const circles = container.querySelectorAll('.circular-progress');
        circles.forEach(circle => {
            const val = circle.getAttribute('data-value');
            const fill = circle.querySelector('.fill');
            if (fill) {
                const radius = fill.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (val / 100) * circumference;
                fill.style.strokeDasharray = circumference;
                fill.style.strokeDashoffset = offset;
            }
        });
    }

    // --- Counter Animation ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + "+";
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalContent = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = '<span>Sending...</span><span class="material-symbols-outlined animate-spin">progress_activity</span>';
            
            setTimeout(() => {
                btn.innerHTML = '<span>Sent Successfully</span><span class="material-symbols-outlined">check_circle</span>';
                btn.classList.add('bg-green-600');
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.classList.remove('bg-green-600');
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // --- Visual Effects ---
    // Parallax / Mouse Tracking Glow
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        const heroGradient = document.querySelector('.hero-gradient');
        if (heroGradient) {
            heroGradient.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
        }
    });

    // --- Project Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('article.glass-card[data-category]');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update button styles
                filterButtons.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
                filterButtons.forEach(b => b.classList.add('border', 'border-white/10', 'text-white/60'));
                btn.classList.remove('border', 'border-white/10', 'text-white/60');
                btn.classList.add('bg-blue-600', 'text-white');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }
});