// CUSTOM CURSOR
document.addEventListener('DOMContentLoaded', function() {
    // Create custom cursor elements
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    // Track mouse movement with smooth interpolation
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Ultra-smooth cursor animation with easing
    let isAnimating = false;
    
    function animateCursor() {
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(() => {
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
                
                // Smoother follower with better easing
                followerX += (mouseX - followerX) * 0.08;
                followerY += (mouseY - followerY) * 0.08;
                
                cursorFollower.style.left = followerX + 'px';
                cursorFollower.style.top = followerY + 'px';
                
                isAnimating = false;
            });
        }
    }
    
    // Throttled animation for better performance
    let lastTime = 0;
    function throttledAnimateCursor(time) {
        if (time - lastTime >= 16) { // ~60fps
            animateCursor();
            lastTime = time;
        }
        requestAnimationFrame(throttledAnimateCursor);
    }
    requestAnimationFrame(throttledAnimateCursor);

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .social-icon, .nav-link, .tech-badge, .tag, .project-card, .interest-card, .stat-card, .contact-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.5';
    });
    
    // Create floating particles
    function createFloatingParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        document.body.appendChild(particlesContainer);
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 2-6px
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 20 + 's';
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 30000);
        }
        
        // Create particles periodically with smoother timing
        setInterval(createParticle, 2500);
        
        // Create initial particles with staggered timing
        for (let i = 0; i < 8; i++) {
            setTimeout(createParticle, i * 800);
        }
    }
    
    createFloatingParticles();
    
    // Smooth scroll enhancement
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Optimized parallax scrolling effect
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-section');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.3;
            element.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Enhanced Intersection Observer for smoother animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Global Visitor Counter using CountAPI (GitHub Pages Compatible)
    function initVisitorCounter() {
        const visitorCountElement = document.getElementById('visitorCount');
        const sessionKey = 'profile_session_visited';
        
        // Check if this is a new session
        const hasVisited = sessionStorage.getItem(sessionKey);
        
        if (!hasVisited) {
            // Increment global counter using CountAPI
            fetch('https://api.countapi.xyz/hit/dang-dinh-hoa-portfolio/visits')
                .then(response => response.json())
                .then(data => {
                    const currentCount = data.value;
                    // Animate counter
                    animateCounter(visitorCountElement, 0, currentCount, 2000);
                    // Mark this session as visited
                    sessionStorage.setItem(sessionKey, 'true');
                })
                .catch(error => {
                    console.log('CountAPI not available, using fallback');
                    // Fallback to local counter
                    const storageKey = 'profile_visitor_count';
                    let currentCount = parseInt(localStorage.getItem(storageKey)) || 0;
                    currentCount++;
                    localStorage.setItem(storageKey, currentCount.toString());
                    animateCounter(visitorCountElement, 0, currentCount, 2000);
                    sessionStorage.setItem(sessionKey, 'true');
                });
        } else {
            // Get current count without incrementing
            fetch('https://api.countapi.xyz/get/dang-dinh-hoa-portfolio/visits')
                .then(response => response.json())
                .then(data => {
                    const currentCount = data.value;
                    visitorCountElement.textContent = currentCount;
                })
                .catch(error => {
                    console.log('CountAPI not available, using fallback');
                    // Fallback to local counter
                    const storageKey = 'profile_visitor_count';
                    const currentCount = parseInt(localStorage.getItem(storageKey)) || 1;
                    visitorCountElement.textContent = currentCount;
                });
        }
        
        // Add click effect to visitor counter
        visitorCountElement.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Initialize visitor counter when page loads
    initVisitorCounter();
});

// PARTICLES.JS CONFIGURATION
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#00FF41'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00FF41',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// NAVBAR SCROLL EFFECT
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// MOBILE MENU TOGGLE
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});


// SMOOTH SCROLL FOR NAVIGATION
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// COUNTER ANIMATION FOR STATS
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// INTERSECTION OBSERVER FOR ANIMATIONS
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Animate stat numbers
            if (entry.target.classList.contains('stat-card')) {
                const statNumber = entry.target.querySelector('.stat-number');
                const target = parseInt(statNumber.dataset.target);
                animateCounter(statNumber, 0, target, 2000);
            }
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skill-category')) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.dataset.progress;
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 200);
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// Observe stat cards
document.querySelectorAll('.stat-card').forEach(element => {
    observer.observe(element);
});

// Observe skill categories
document.querySelectorAll('.skill-category').forEach(element => {
    observer.observe(element);
});

// BACK TO TOP BUTTON
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// TYPING EFFECT FOR HERO SUBTITLE
const typingText = document.querySelector('.typing-text');
const text = 'Data Scientist & Full Stack Developer';
let index = 0;

function typeEffect() {
    if (index < text.length) {
        typingText.textContent = text.substring(0, index + 1);
        index++;
        setTimeout(typeEffect, 100);
    }
}

// Start typing effect after a short delay
setTimeout(() => {
    typingText.textContent = '';
    typeEffect();
}, 1000);

// CURSOR TRAIL EFFECT
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.circle');

if (circles.length > 0) {
    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach(function (circle, index) {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// PARALLAX EFFECT FOR SECTIONS
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ACTIVE NAVIGATION LINK ON SCROLL
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// TILT EFFECT FOR CARDS
const cards = document.querySelectorAll('.project-card, .interest-card, .stat-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// LOADING ANIMATION
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// RANDOM COLOR CHANGE FOR TECH BADGES
const techBadges = document.querySelectorAll('.tech-badge');
const colors = ['#00FF41', '#F85D7F', '#4facfe', '#f093fb', '#667eea'];

techBadges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        badge.style.borderColor = randomColor;
        badge.style.color = randomColor;
    });

    badge.addEventListener('mouseleave', () => {
        badge.style.borderColor = '#00FF41';
        badge.style.color = '#00FF41';
    });
});

// CONSOLE LOG EASTER EGG
console.log('%c👋 Hello there, developer!', 'font-size: 20px; font-weight: bold; color: #00FF41;');
console.log('%c🚀 Interested in the code? Check out the GitHub repo!', 'font-size: 14px; color: #F85D7F;');
console.log('%c💼 https://github.com/hxdhshep07052005', 'font-size: 14px; color: #4facfe;');

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Press 'B' to scroll to bottom
    if (e.key === 'b' || e.key === 'B') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// THEME TOGGLE (Optional - for future enhancement)
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isDark = !document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

// PERFORMANCE OPTIMIZATION
// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
} else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
    });
}

// SOCIAL LINKS ANALYTICS (Optional)
document.querySelectorAll('.social-icon, .social-btn').forEach(link => {
    link.addEventListener('click', (e) => {
        const platform = link.href.includes('github') ? 'GitHub' :
                        link.href.includes('instagram') ? 'Instagram' :
                        link.href.includes('linkedin') ? 'LinkedIn' :
                        link.href.includes('mailto') ? 'Email' : 'Unknown';
        
        console.log(`Social link clicked: ${platform}`);
        // You can add analytics tracking here
    });
});

// INITIALIZE ALL ANIMATIONS ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    // Add stagger animation to elements
    const staggerElements = document.querySelectorAll('.stagger');
    staggerElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Initialize tooltips if needed
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
});

// CUSTOM CURSOR (Optional Enhancement)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';

// Uncomment to enable custom cursor
// document.body.appendChild(cursor);
// document.body.appendChild(cursorFollower);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// RESIZE HANDLER
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

console.log('%c✨ Portfolio Loaded Successfully!', 'font-size: 16px; font-weight: bold; color: #00FF41; background: #0D1117; padding: 10px;');

