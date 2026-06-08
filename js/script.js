/**
 * Muhammad Ali Portfolio — script.js
 * Optimized: debounced scroll, requestAnimationFrame cursor,
 * lazy-loaded particles, proper cleanup, accessible form validation.
 */

'use strict';

/* ============================================================
   1. UTILITIES
   ============================================================ */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/** Debounce: returns a function that delays invoking fn until after `wait` ms. */
function debounce(fn, wait = 100) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* ============================================================
   2. PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
    const preloader = $('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 300);
    }
    initAOS();
});

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 750, once: true, offset: 80, easing: 'ease-out-cubic' });
    }
}

/* ============================================================
   3. CUSTOM CURSOR  (desktop / fine-pointer only)
   ============================================================ */
(function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursor = document.querySelector('.cursor');
    const dot    = document.querySelector('.cursor-dot');
    if (!cursor || !dot) return;

    let mx = -100, my = -100;
    let cx = -100, cy = -100;
    let rafId;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animate() {
        // Smooth follow for outer ring
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        cursor.style.transform = `translate(${cx - 14}px, ${cy - 14}px)`;
        dot.style.transform    = `translate(${mx - 3}px, ${my - 3}px)`;
        rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    // Hover enlargement on interactive elements
    const hoverSels = 'a, button, .filter-btn, .project-card, .service-card, input, textarea';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverSels)) cursor.classList.add('is-hovering');
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverSels)) cursor.classList.remove('is-hovering');
    });

    document.addEventListener('mousedown', () => cursor.style.transform += ' scale(0.8)');
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-hovering'));
})();

/* ============================================================
   4. LIGHTWEIGHT CANVAS PARTICLES  (replaces particles.js)
   ============================================================ */
(function initParticles() {
    const canvas = $('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], rafId;

    const CONFIG = {
        count: 55,
        color: '79, 195, 247',   // RGB of --c-accent
        maxDist: 140,
        speed: 0.55,
        radius: 2.2,
        opacity: 0.55
    };

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = Array.from({ length: CONFIG.count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * CONFIG.speed,
            vy: (Math.random() - 0.5) * CONFIG.speed,
            r: Math.random() * CONFIG.radius + 0.8
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${CONFIG.color}, ${CONFIG.opacity})`;
            ctx.fill();
        });

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < CONFIG.maxDist) {
                    const alpha = (1 - dist / CONFIG.maxDist) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${CONFIG.color}, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        rafId = requestAnimationFrame(draw);
    }

    // Pause particles when tab is hidden (performance)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(rafId); }
        else { rafId = requestAnimationFrame(draw); }
    });

    window.addEventListener('resize', debounce(() => { resize(); createParticles(); }, 250));
    resize();
    createParticles();
    draw();
})();

/* ============================================================
   5. TYPED.JS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const typedEl = $('typed');
    if (typedEl && typeof Typed !== 'undefined') {
        new Typed('#typed', {
            strings: [
                'Web Applications',
                'Laravel APIs',
                'CRUD Systems',
                'Modern UI/UX'
            ],
            typeSpeed: 55,
            backSpeed: 35,
            backDelay: 2200,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
});

/* ============================================================
   6. INTERSECTION OBSERVER — COUNTERS
   ============================================================ */
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let start = 0;
        const step = target / 60;
        const tick = () => {
            start = Math.min(start + step, target);
            el.textContent = Math.ceil(start) + (start >= target ? '+' : '');
            if (start < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
    });
}, { threshold: 0.6 });

$$('.counter').forEach(el => counterObs.observe(el));

/* ============================================================
   7. INTERSECTION OBSERVER — SKILL PROGRESS BARS
   ============================================================ */
const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        barObs.unobserve(fill);
    });
}, { threshold: 0.4 });

$$('.skill-fill').forEach(el => barObs.observe(el));

/* ============================================================
   8. NAVBAR — SCROLL CLASS + SCROLLSPY (debounced)
   ============================================================ */
const navbar  = $('navbar');
const navLinks = $$('.nav-link[href^="#"]');

const handleScroll = debounce(() => {
    // Scrolled state
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top
    const btn = $('backToTop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 450);

    // Scrollspy
    let current = '';
    $$('section[id]').forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}, 60);

window.addEventListener('scroll', handleScroll, { passive: true });

/* ============================================================
   9. BACK TO TOP
   ============================================================ */
const backToTopBtn = $('backToTop');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   10. SKILLS DATA & RENDER
   ============================================================ */
const SKILLS = [
    { name: 'HTML5',       category: 'frontend', icon: 'devicon-html5-plain colored',    level: 95 },
    { name: 'CSS3',        category: 'frontend', icon: 'devicon-css3-plain colored',     level: 90 },
    { name: 'Bootstrap 5', category: 'frontend', icon: 'devicon-bootstrap-plain colored',level: 90 },
    { name: 'JavaScript',  category: 'frontend', icon: 'devicon-javascript-plain colored',level: 70 },
    { name: 'React',       category: 'frontend', icon: 'devicon-react-plain colored',    level: 60 },
    { name: 'PHP',         category: 'backend',  icon: 'devicon-php-plain colored',      level: 85 },
    { name: 'Laravel',     category: 'backend',  icon: 'devicon-laravel-plain colored',  level: 80 },
    { name: 'MySQL',       category: 'backend',  icon: 'devicon-mysql-plain colored',    level: 80 },
    { name: 'Python',      category: 'backend',  icon: 'devicon-python-plain colored',   level: 65 },
    { name: 'Git',         category: 'tools',    icon: 'devicon-git-plain colored',      level: 75 },
    { name: 'GitHub',      category: 'tools',    icon: 'devicon-github-original colored',level: 80 },
    { name: 'VS Code',     category: 'tools',    icon: 'devicon-vscode-plain colored',   level: 85 },
    { name: 'XAMPP',       category: 'tools',    icon: 'bx bx-server',                  level: 75 }
];

const CIRC = 2 * Math.PI * 38; // r=38 → circumference ~238.76

function renderSkills(filter = 'all') {
    const grid = $('skillsGrid');
    if (!grid) return;
    const list = filter === 'all' ? SKILLS : SKILLS.filter(s => s.category === filter);

    grid.innerHTML = list.map(s => `
        <div class="col-6 col-md-4 col-lg-3" data-aos="zoom-in">
            <div class="skill-card">
                <div class="circular-progress" aria-label="${s.name} – ${s.level}%">
                    <svg viewBox="0 0 88 88" aria-hidden="true">
                        <defs>
                            <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#4FC3F7"/>
                                <stop offset="100%" stop-color="#A78BFA"/>
                            </linearGradient>
                        </defs>
                        <circle class="circle-bg" cx="44" cy="44" r="38"/>
                        <circle class="circle-progress" cx="44" cy="44" r="38"
                            data-level="${s.level}"
                            stroke="url(#pg)"
                            stroke-dasharray="${CIRC}"
                            stroke-dashoffset="${CIRC}"/>
                    </svg>
                    <span class="progress-value">${s.level}%</span>
                </div>
                <i class="${s.icon} skill-icon-display" aria-hidden="true"></i>
                <h4>${s.name}</h4>
            </div>
        </div>`).join('');

    // Animate circles after paint
    requestAnimationFrame(() => {
        grid.querySelectorAll('.circle-progress').forEach(c => {
            const offset = CIRC - (parseInt(c.dataset.level, 10) / 100) * CIRC;
            c.style.strokeDashoffset = offset;
        });
        if (typeof AOS !== 'undefined') AOS.refresh();
    });
}

// Filter buttons
$$('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
        $$('.filter-btn[data-filter]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        renderSkills(this.dataset.filter);
    });
});

renderSkills();

/* ============================================================
   11. PROJECTS DATA & RENDER
   ============================================================ */
const PROJECTS = [
    {
        title: 'Portfolio Website',
        category: 'frontend',
        tech: ['HTML', 'CSS', 'Bootstrap', 'JS'],
        desc: 'Responsive personal portfolio with dark theme, smooth animations, and modern design.',
        github: 'https://github.com/muhammadali-dev01/portfolio-website',
        live: 'https://muhammadali-dev01.github.io/portfolio-website',
        img: 'img/projects/portfolio-website.jpg'
    },
    {
        title: 'Real-Time Form Validation',
        category: 'javascript',
        tech: ['HTML', 'CSS', 'JavaScript'],
        desc: 'Client-side form validation with real-time error feedback and success animations.',
        github: 'https://github.com/muhammadali-dev01/form-validation',
        live: 'https://muhammadali-dev01.github.io/form-validation',
        img: 'img/projects/form-validation.jpg'
    },
    {
        title: 'Noorani Qaida Learning System',
        category: 'frontend',
        tech: ['HTML', 'CSS', 'JavaScript'],
        desc: 'Interactive Islamic learning platform interface for Noorani Qaida lessons.',
        github: 'https://github.com/muhammadali-dev01/noorani-qaida',
        live: 'https://muhammadali-dev01.github.io/noorani-qaida',
        img: 'img/projects/noorani-qaida.jpg'
    },
    {
        title: 'Student Registration System',
        category: 'laravel',
        tech: ['Laravel', 'MySQL', 'Bootstrap'],
        desc: 'CRUD-based student registration and management system with full authentication.',
        github: 'https://github.com/muhammadali-dev01/student-registration',
        live: null,
        img: 'img/projects/student-registration.jpg'
    },
    {
        title: 'CMS Blog Platform',
        category: 'laravel',
        tech: ['Laravel', 'MySQL', 'PHP'],
        desc: 'Full-featured blog CMS with admin panel and role-based access control.',
        github: 'https://github.com/muhammadali-dev01/cms-blog',
        live: null,
        img: 'img/projects/cms-blog.jpg'
    },
    {
        title: 'Basic Calculator',
        category: 'javascript',
        tech: ['HTML', 'CSS', 'JavaScript'],
        desc: 'Interactive calculator with modern glassmorphism UI and keyboard support.',
        github: 'https://github.com/muhammadali-dev01/calculator',
        live: 'https://muhammadali-dev01.github.io/calculator',
        img: 'img/projects/calculator.jpg'
    }
];

function renderProjects(filter = 'all') {
    const grid = $('projectsGrid');
    if (!grid) return;
    const list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

    if (!list.length) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class='bx bx-folder-open' style="font-size: 3.5rem; color: var(--c-muted);" aria-hidden="true"></i>
                <h4 class="mt-3 text-muted-custom">No projects in this category yet</h4>
                <p class="text-muted-custom">Check back soon!</p>
            </div>`;
        return;
    }

    grid.innerHTML = list.map((p, i) => `
        <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${i * 80}">
            <article class="project-card">
                <div class="project-thumb">
                    <img src="${p.img}"
                         alt="${p.title} project screenshot"
                         loading="lazy"
                         width="800" height="500"
                         onerror="this.src='https://placehold.co/800x500/0E1520/4FC3F7?text=${encodeURIComponent(p.title)}'">
                    <div class="project-overlay" aria-hidden="true">
                        <div class="project-overlay-btns">
                            <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn-ghost-custom">
                                <i class='bx bxl-github'></i> Code
                            </a>
                            ${p.live ? `
                            <a href="${p.live}" target="_blank" rel="noopener noreferrer" class="btn-primary-custom">
                                <i class='bx bx-link-external'></i> Live
                            </a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-body">
                    <h4>${p.title}</h4>
                    <p>${p.desc}</p>
                    <div class="tech-tags">
                        ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </article>
        </div>`).join('');

    if (typeof AOS !== 'undefined') AOS.refresh();
}

$$('.filter-btn[data-project-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
        $$('.filter-btn[data-project-filter]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        renderProjects(this.dataset.projectFilter);
    });
});

renderProjects();

/* ============================================================
   12. GITHUB API — with graceful degradation
   ============================================================ */
(function loadGithubRepos() {
    const grid = $('githubRepos');
    if (!grid) return;

    // Skeleton loading
    grid.innerHTML = Array(4).fill(`
        <div class="col-md-6">
            <div class="repo-card" style="min-height:140px;">
                <div style="background:rgba(127,149,174,.08);height:16px;border-radius:8px;width:60%;margin-bottom:12px;"></div>
                <div style="background:rgba(127,149,174,.06);height:12px;border-radius:8px;width:90%;margin-bottom:8px;"></div>
                <div style="background:rgba(127,149,174,.06);height:12px;border-radius:8px;width:70%;"></div>
            </div>
        </div>`).join('');

    fetch('https://api.github.com/users/muhammadali-dev01/repos?sort=updated&per_page=4', {
        headers: { Accept: 'application/vnd.github.v3+json' }
    })
        .then(r => { if (!r.ok) throw new Error('GitHub API error'); return r.json(); })
        .then(repos => {
            grid.innerHTML = repos.map(repo => `
                <div class="col-md-6" data-aos="fade-up">
                    <div class="repo-card">
                        <h5><i class='bx bxl-github' aria-hidden="true"></i> ${repo.name}</h5>
                        <p>${repo.description || 'No description provided.'}</p>
                        <div class="repo-meta">
                            ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                            <span class="tech-tag"><i class='bx bx-star' aria-hidden="true"></i> ${repo.stargazers_count}</span>
                            <span class="tech-tag"><i class='bx bx-git-repo-forked' aria-hidden="true"></i> ${repo.forks_count}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-ghost-custom" style="font-size:.85rem;padding:8px 18px;">
                            View Repo <i class='bx bx-link-external'></i>
                        </a>
                    </div>
                </div>`).join('');
            if (typeof AOS !== 'undefined') AOS.refresh();
        })
        .catch(() => {
            grid.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted-custom mb-3">Could not load repositories. View them directly on GitHub.</p>
                    <a href="https://github.com/muhammadali-dev01" target="_blank" rel="noopener noreferrer" class="btn-ghost-custom">
                        <i class='bx bxl-github'></i> View GitHub Profile
                    </a>
                </div>`;
        });
})();

/* ============================================================
   13. TESTIMONIALS SWIPER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonialSwiper', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            a11y: { enabled: true },
            breakpoints: {
                768: { slidesPerView: 2 }
            }
        });
    }
});

/* ============================================================
   14. CONTACT FORM — client-side validation
   ============================================================ */
const contactForm = $('contactForm');
if (contactForm) {
    const fields = {
        contactName:    { validate: v => v.trim().length >= 2,    msg: 'Please enter your name (at least 2 characters).' },
        contactEmail:   { validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
        contactMessage: { validate: v => v.trim().length >= 10,   msg: 'Please write at least 10 characters.' }
    };

    function setFieldState(id, isValid, msg = '') {
        const input = $(id);
        if (!input) return;
        const errorEl = input.nextElementSibling;
        input.classList.toggle('is-invalid', !isValid);
        if (errorEl && errorEl.classList.contains('field-error')) {
            errorEl.textContent = isValid ? '' : msg;
        }
    }

    // Inline validation on blur
    Object.keys(fields).forEach(id => {
        const input = $(id);
        if (!input) return;
        input.addEventListener('blur', () => {
            const { validate, msg } = fields[id];
            setFieldState(id, validate(input.value), msg);
        });
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                setFieldState(id, fields[id].validate(input.value), fields[id].msg);
            }
        });
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let valid = true;
        Object.keys(fields).forEach(id => {
            const input = $(id);
            if (!input) return;
            const ok = fields[id].validate(input.value);
            setFieldState(id, ok, fields[id].msg);
            if (!ok) valid = false;
        });
        if (!valid) return;

        // Simulate send
        const btn = this.querySelector('.submit-btn');
        btn.classList.add('loading');
        btn.disabled = true;

        setTimeout(() => {
            btn.classList.remove('loading');
            btn.disabled = false;
            this.reset();
            const success = $('formSuccess');
            if (success) {
                success.textContent = '✓ Message sent! I\'ll get back to you soon.';
                success.classList.add('visible');
                setTimeout(() => success.classList.remove('visible'), 5000);
            }
        }, 1500);
    });
}

/* ============================================================
   15. NEWSLETTER FORM
   ============================================================ */
const newsletterForm = $('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = $('newsletterEmail');
        if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
            input.value = '';
            input.placeholder = '✓ Subscribed!';
            setTimeout(() => { input.placeholder = 'your@email.com'; }, 3000);
        }
    });
}

/* ============================================================
   16. CURRENT YEAR
   ============================================================ */
const yearEl = $('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   17. SMOOTH CLOSE MOBILE NAV ON LINK CLICK
   ============================================================ */
$$('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const collapse = document.getElementById('navbarNav');
        if (collapse && collapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(collapse);
            if (bsCollapse) bsCollapse.hide();
        }
    });
});