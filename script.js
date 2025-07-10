// Typewriter effect for title section
class TypeWriter {
    constructor(elementId, text, speed = 100) {
        this.element = document.getElementById(elementId);
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    start() {
        this.element.textContent = '';
        this.index = 0;
        this.type();
    }
}


// Time display and year update
function updateTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) {
        timeDisplay.textContent = `${dateString} • ${timeString}`;
    }
    
    // Update copyright year
    const yearDisplay = document.getElementById('current-year');
    if (yearDisplay) {
        yearDisplay.textContent = now.getFullYear();
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add scroll animations to elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skill-group, .section-title, .point');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Enhanced project card interactions
function initProjectCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 20px 60px rgba(206, 160, 35, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
}

// Skill item interactions
function initSkillInteractions() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 2rem;
                background: rgba(206, 160, 35, 0.2);
                transform: scale(0);
                animation: skillRipple 0.6s ease-out;
                pointer-events: none;
                top: 0;
                left: 0;
            `;
            
            item.style.position = 'relative';
            item.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Contact link interactions
function initContactLinkInteractions() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const pulse = document.createElement('div');
            pulse.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 0.8rem;
                background: rgba(206, 160, 35, 0.3);
                transform: scale(0);
                animation: contactPulse 0.4s ease-out;
                pointer-events: none;
                top: 0;
                left: 0;
            `;
            
            link.style.position = 'relative';
            link.appendChild(pulse);
            
            setTimeout(() => {
                if (pulse.parentNode) {
                    pulse.parentNode.removeChild(pulse);
                }
            }, 400);
        });
    });
}

// Add dynamic animations
function addDynamicAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes skillRipple {
            to {
                transform: scale(1.2);
                opacity: 0;
            }
        }
        
        @keyframes contactPulse {
            to {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Page entrance animation
function initPageEntrance() {
    const heroText = document.querySelector('.hero-text');
    const summarySection = document.querySelector('.summary-section');
    
    setTimeout(() => {
        if (heroText) {
            heroText.style.opacity = '0';
            heroText.style.transform = 'translateY(30px)';
            heroText.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                heroText.style.opacity = '1';
                heroText.style.transform = 'translateY(0)';
            }, 200);
        }
    }, 100);
    
    setTimeout(() => {
        if (summarySection) {
            summarySection.style.opacity = '0';
            summarySection.style.transform = 'translateY(30px)';
            summarySection.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                summarySection.style.opacity = '1';
                summarySection.style.transform = 'translateY(0)';
            }, 300);
        }
    }, 600);
}

// Parallax effect for background
function initParallaxEffect() {
    const timeVortex = document.querySelector('.time-vortex');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (timeVortex) {
            timeVortex.style.transform = `translateY(${rate}px)`;
        }
    });
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start typewriter animations with delay
    setTimeout(() => {
        const titleTypewriter = new TypeWriter('typewriter-title', 'COMPUTER ENGINEERING STUDENT', 80);
        titleTypewriter.start();
        
        setTimeout(() => {
            const ampersandTypewriter = new TypeWriter('typewriter-ampersand', '&', 100);
            ampersandTypewriter.start();
            
            setTimeout(() => {
                const subtitleTypewriter = new TypeWriter('typewriter-subtitle', 'SOFTWARE DEVELOPER', 60);
                subtitleTypewriter.start();
            }, 800);
        }, 2000);
    }, 1000);
    
    // Update time immediately and then every second
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
    
    // Initialize all interactive features
    addDynamicAnimations();
    initScrollAnimations();
    initProjectCardInteractions();
    initSkillInteractions();
    initContactLinkInteractions();
    initPageEntrance();
    initParallaxEffect();
    
    // Add subtle body entrance animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
