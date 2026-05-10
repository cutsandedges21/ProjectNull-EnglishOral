import { animate, stagger } from "https://esm.sh/motion@10.16.2";

const slides = document.querySelectorAll('.slide');
const bgLayer = document.getElementById('bg-layer');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentSlideEl = document.getElementById('current-slide');
const totalSlidesEl = document.getElementById('total-slides');
const progressBar = document.getElementById('progress');

let currentSlide = 0;
const totalSlides = slides.length;
totalSlidesEl.textContent = totalSlides;

let isAnimating = false;

function updatePresentation(direction = 1) {
    if (isAnimating) return;
    isAnimating = true;

    // Fade out old slides
    slides.forEach((slide, index) => {
        if (index !== currentSlide && slide.classList.contains('active')) {
            animate(slide, { opacity: 0, scale: 0.95 }, { duration: 0.4 }).finished.then(() => {
                slide.classList.remove('active');
                slide.style.visibility = 'hidden';
            });
        }
    });
    
    const slide = slides[currentSlide];
    slide.style.visibility = 'visible';
    slide.classList.add('active');

    // Update Background
    const bgImage = slide.getAttribute('data-bg');
    if (bgImage) {
        bgLayer.style.backgroundImage = `url('${bgImage}')`;
    } else {
        bgLayer.style.backgroundImage = 'none';
    }

    
    // Handle black background slide
    const gradients = document.querySelector('.gradients-container');
    const particles = document.getElementById('tsparticles');
    
    if (slide.classList.contains('black-bg')) {
        document.body.style.backgroundColor = 'black';
        if (gradients) gradients.style.opacity = '0';
        if (particles) particles.style.opacity = '0';
    } else {
        document.body.style.backgroundColor = 'var(--bg-color)';
        if (gradients) gradients.style.opacity = '0.6';
        if (particles) particles.style.opacity = '1';
    }

    // Update Counter
    currentSlideEl.textContent = currentSlide + 1;
    
    // Animate Progress Bar
    const progressPercent = ((currentSlide) / (totalSlides - 1)) * 100;
    animate(progressBar, { width: `${progressPercent}%` }, { duration: 0.5, easing: "ease-out" });

    // Buttons Visibility
    prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
    prevBtn.style.cursor = currentSlide === 0 ? 'default' : 'pointer';
    nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
    nextBtn.style.cursor = currentSlide === totalSlides - 1 ? 'default' : 'pointer';

    // Slide Entrance Animation (slide from left or right based on direction)
    const startX = direction === 0 ? 0 : direction * 50;
    animate(slide, 
        { opacity: [0, 1], x: [startX, 0] }, 
        { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
    );

    // Stagger Children Animation
    const elements = slide.querySelectorAll('.glass-panel > *, .side-image-container > img, .corner-logo, .bg-logo-img, .stamp-logo');
    
    // Initial hidden state
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
    });

    // Stagger fade up
    animate(
        elements, 
        { opacity: [0, 1], y: [20, 0] }, 
        { delay: stagger(0.1, { startDelay: 0.1 }), duration: 0.5, easing: [0.22, 1, 0.36, 1] }
    ).finished.then(() => {
        isAnimating = false;
    });
}

function nextSlide() {
    if (currentSlide < totalSlides - 1 && !isAnimating) {
        currentSlide++;
        updatePresentation(1);
    }
}

function prevSlide() {
    if (currentSlide > 0 && !isAnimating) {
        currentSlide--;
        updatePresentation(-1);
    }
}

// Event Listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

// Interactive Button Hover Animations
const navBtns = document.querySelectorAll('.nav-btn');
navBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        if (btn.style.opacity !== '0.3') animate(btn, { scale: 1.15 }, { duration: 0.2 });
    });
    btn.addEventListener('mouseleave', () => {
        if (btn.style.opacity !== '0.3') animate(btn, { scale: 1 }, { duration: 0.2 });
    });
});

// Initialize first slide (direction 0 means no lateral slide-in)
slides.forEach(slide => slide.style.visibility = 'hidden');
updatePresentation(0);


// --- Background Gradient Mouse Tracking ---
const interactiveBlob = document.getElementById('interactive-blob');
let curX = 0;
let curY = 0;
let tgX = 0;
let tgY = 0;

function animateBlob() {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    if (interactiveBlob) {
        interactiveBlob.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    }
    requestAnimationFrame(animateBlob);
}

document.addEventListener('mousemove', (event) => {
    tgX = event.clientX;
    tgY = event.clientY;
});

animateBlob();

// --- tsParticles SparklesCore Initialization ---
if (typeof tsParticles !== 'undefined') {
    tsParticles.load({
        id: "tsparticles",
        options: {
            background: { color: { value: "transparent" } },
            fullScreen: { enable: false, zIndex: -1 },
            fpsLimit: 120,
            particles: {
                color: { value: ["#555555", "#882222", "#333333", "#000000"] },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "out" },
                    random: false,
                    speed: { min: 0.05, max: 0.3 },
                    straight: false,
                },
                number: {
                    density: { enable: true, width: 400, height: 400 },
                    value: 70,
                },
                opacity: {
                    value: { min: 0.1, max: 1 },
                    animation: {
                        enable: true,
                        speed: 4,
                        sync: false,
                    },
                },
                shape: { type: "circle" },
                size: {
                    value: { min: 1, max: 4 },
                },
            },
            detectRetina: true,
        }
    });
}
