
        // ========== PRELOADER ==========
        window.addEventListener('load', () => {
            document.getElementById('preloader').classList.add('hidden');
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        });

        // ========== CUSTOM CURSOR ==========
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
        });
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });

        // ========== PARTICLES.JS ==========
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: '#38BDF8' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#38BDF8', opacity: 0.2, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
                modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });

        // ========== TYPED.JS ==========
        new Typed('#typed', {
            strings: ['PHP Developer', 'Laravel Expert', 'Full-Stack Learner', 'Web Developer'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });

        // ========== COUNTER ANIMATION ==========
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    let count = 0;
                    const speed = target / 50;
                    const updateCount = () => {
                        count += speed;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target + '+';
                        }
                    };
                    updateCount();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => counterObserver.observe(counter));

        // ========== PROGRESS BARS ANIMATION ==========
        const progressBars = document.querySelectorAll('.progress-bar');
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        progressBars.forEach(bar => progressObserver.observe(bar));

        // ========== NAVBAR SCROLL ==========
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // ========== BACK TO TOP ==========
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ========== SKILLS DATA ==========
        const skillsData = [
            { name: 'HTML5', category: 'frontend', icon: 'devicon-html5-plain', level: 95 },
            { name: 'CSS3', category: 'frontend', icon: 'devicon-css3-plain', level: 90 },
            { name: 'Bootstrap 5', category: 'frontend', icon: 'devicon-bootstrap-plain', level: 90 },
            { name: 'JavaScript', category: 'frontend', icon: 'devicon-javascript-plain', level: 70 },
            { name: 'PHP', category: 'backend', icon: 'devicon-php-plain', level: 85 },
            { name: 'Laravel', category: 'backend', icon: 'devicon-laravel-plain', level: 80 },
            { name: 'MySQL', category: 'backend', icon: 'devicon-mysql-plain', level: 80 },
            { name: 'Git', category: 'tools', icon: 'devicon-git-plain', level: 75 },
            { name: 'GitHub', category: 'tools', icon: 'devicon-github-original', level: 80 },
            { name: 'VS Code', category: 'tools', icon: 'devicon-vscode-plain', level: 85 },
            { name: 'XAMPP', category: 'tools', icon: 'bx bx-server', level: 75 },
            { name: 'Python', category: 'backend', icon: 'devicon-python-plain', level: 65 }
        ];

        function renderSkills(filter = 'all') {
            const grid = document.getElementById('skillsGrid');
            const filtered = filter === 'all' ? skillsData : skillsData.filter(s => s.category === filter);
            grid.innerHTML = filtered.map(skill => `
                <div class="col-md-4 col-lg-3" data-aos="zoom-in">
                    <div class="skill-card">
                        <div class="circular-progress">
                            <svg>
                                <circle class="circle-bg" cx="50" cy="50" r="40"></circle>
                                <circle class="circle-progress" cx="50" cy="50" r="40"
                                    data-level="${skill.level}"></circle>
                            </svg>
                            <span class="progress-value">${skill.level}%</span>
                        </div>
                        <i class="${skill.icon} skill-icon" style="font-size: 2.5rem;"></i>
                        <h4>${skill.name}</h4>
                    </div>
                </div>
            `).join('');
            
            // Animate circles
            setTimeout(() => {
                document.querySelectorAll('.circle-progress').forEach(circle => {
                    const level = circle.getAttribute('data-level');
                    const circumference = 2 * Math.PI * 40;
                    const offset = circumference - (level / 100) * circumference;
                    circle.style.strokeDasharray = circumference;
                    circle.style.strokeDashoffset = offset;
                });
            }, 100);
        }

        // Skill Tabs
        document.querySelectorAll('.skill-tab[data-filter]').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.skill-tab[data-filter]').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderSkills(this.getAttribute('data-filter'));
            });
        });

        renderSkills();

        // ========== PROJECTS DATA ==========
                // ========== PROJECTS DATA ==========
        const projectsData = [
            {
                title: 'Portfolio Website',
                category: 'frontend',
                tech: ['HTML', 'CSS', 'Bootstrap'],
                description: 'Responsive personal portfolio with modern dark theme design and smooth animations.',
                github: 'https://github.com/muhammadali-dev01/portfolio-website',
                live: 'https://muhammadali-dev01.github.io/portfolio-website',
                image: 'images/projects/portfolio-website.jpg'
            },
            {
                title: 'Real-Time Form Validation',
                category: 'javascript',
                tech: ['HTML', 'CSS', 'JavaScript'],
                description: 'Client-side form validation with real-time error feedback and success animations.',
                github: 'https://github.com/muhammadali-dev01/form-validation',
                live: 'https://muhammadali-dev01.github.io/form-validation',
                image: 'images/projects/form-validation.jpg'
            },
            {
                title: 'Noorani Qaida Learning System',
                category: 'frontend',
                tech: ['HTML', 'CSS', 'JavaScript'],
                description: 'Interactive Islamic learning platform interface for Noorani Qaida lessons.',
                github: 'https://github.com/muhammadali-dev01/noorani-qaida',
                live: 'https://muhammadali-dev01.github.io/noorani-qaida',
                image: 'images/projects/noorani-qaida.jpg'
            },
            {
                title: 'Student Registration System',
                category: 'laravel',
                tech: ['Laravel', 'MySQL', 'Bootstrap'],
                description: 'CRUD-based student registration and management system with authentication.',
                github: 'https://github.com/muhammadali-dev01/student-registration',
                live: '#',
                image: 'images/projects/student-registration.jpg'
            },
            {
                title: 'CMS Blog Platform',
                category: 'laravel',
                tech: ['Laravel', 'MySQL', 'PHP'],
                description: 'Full-featured blog content management system with admin panel and user roles.',
                github: 'https://github.com/muhammadali-dev01/cms-blog',
                live: '#',
                image: 'images/projects/cms-blog.jpg'
            },
            {
                title: 'Basic Calculator',
                category: 'javascript',
                tech: ['HTML', 'CSS', 'JavaScript'],
                description: 'Interactive calculator with modern UI and keyboard support.',
                github: 'https://github.com/muhammadali-dev01/calculator',
                live: 'https://muhammadali-dev01.github.io/calculator',
                image: 'images/projects/calculator.jpg'
            }
        ];

                function renderProjects(filter = 'all') {
            const grid = document.getElementById('projectsGrid');
            const filtered = filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter);
            
            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class='bx bx-folder-open' style="font-size: 4rem; color: var(--text-secondary);"></i>
                        <h4 class="mt-3 text-secondary">No projects in this category yet</h4>
                        <p class="text-secondary">Check back soon!</p>
                    </div>`;
                return;
            }
            
            grid.innerHTML = filtered.map((project, index) => `
                <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="project-card">
                        <div class="project-image">
                            <img src="${project.image}" 
                                 alt="${project.title}" 
                                 loading="lazy"
                                 onerror="this.src='https://via.placeholder.com/800x500/1E293B/38BDF8?text=${encodeURIComponent(project.title)}'">
                            <div class="project-overlay">
                                <div class="text-center">
                                    <a href="${project.github}" target="_blank" class="btn btn-outline-custom btn-sm m-1">
                                        <i class='bx bxl-github me-1'></i>GitHub
                                    </a>
                                    <a href="${project.live}" target="_blank" class="btn btn-primary-custom btn-sm m-1">
                                        <i class='bx bx-link-external me-1'></i>Live Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="p-4">
                            <h4>${project.title}</h4>
                            <p class="text-secondary">${project.description}</p>
                            <div class="project-tech-badges">
                                ${project.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        document.querySelectorAll('.skill-tab[data-project-filter]').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.skill-tab[data-project-filter]').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderProjects(this.getAttribute('data-project-filter'));
            });
        });

        renderProjects();

        // ========== GITHUB API ==========
        fetch('https://api.github.com/users/muhammadali-dev01/repos?sort=updated&per_page=4')
            .then(res => res.json())
            .then(repos => {
                const grid = document.getElementById('githubRepos');
                grid.innerHTML = repos.map(repo => `
                    <div class="col-md-6">
                        <div class="skill-card">
                            <h5><i class='bx bxl-github me-2'></i>${repo.name}</h5>
                            <p class="text-secondary">${repo.description || 'No description'}</p>
                            <div class="d-flex gap-2">
                                <span class="tech-badge"><i class='bx bx-star'></i> ${repo.stargazers_count}</span>
                                <span class="tech-badge"><i class='bx bx-git-repo-forked'></i> ${repo.forks_count}</span>
                            </div>
                            <a href="${repo.html_url}" target="_blank" class="btn btn-outline-custom btn-sm mt-3">View Repo</a>
                        </div>
                    </div>
                `).join('');
            })
            .catch(() => {
                document.getElementById('githubRepos').innerHTML = `
                    <div class="col-12 text-center">
                        <a href="https://github.com/muhammadali-dev01" target="_blank" class="btn btn-outline-custom">
                            View GitHub Profile
                        </a>
                    </div>`;
            });

        // ========== TESTIMONIAL SWIPER ==========
        new Swiper('.testimonialSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: { delay: 3000 },
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2 }
            }
        });

        // ========== CURRENT YEAR ==========
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // ========== CONTACT FORM ==========
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message sent successfully! (Demo mode)');
            this.reset();
        });

        // ========== SCROLLSPY ==========
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
