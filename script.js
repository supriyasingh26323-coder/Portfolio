// ---------- Respect reduced motion ----------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Terminal typing effect ----------
function typeText(el, text, speed, callback){
    let i = 0;
    function step(){
        if(i <= text.length){
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(step, speed);
        } else if(callback){
            callback();
        }
    }
    step();
}

function runTerminal(){
    const typed1 = document.getElementById('typed-1');
    const output1 = document.getElementById('output-1');
    const typed2 = document.getElementById('typed-2');
    const output2 = document.getElementById('output-2');

    const line1 = 'whoami';
    const result1 = 'Supriya Singh — Aspiring Software Developer';
    const line2 = 'cat skills.txt';
    const result2 = 'Java · PHP · MySQL · JavaScript · Git';

    if(!typed1 || !output1 || !typed2 || !output2) return;

    if(prefersReducedMotion){
        typed1.textContent = line1;
        output1.textContent = result1;
        typed2.textContent = line2;
        output2.textContent = result2;
        return;
    }

    typeText(typed1, line1, 60, () => {
        output1.textContent = result1;
        setTimeout(() => {
            typeText(typed2, line2, 60, () => {
                output2.textContent = result2;
            });
        }, 400);
    });
}

// ---------- Scroll reveal ----------
function setupScrollReveal(){
    const revealEls = document.querySelectorAll('.reveal');

    if(prefersReducedMotion || !('IntersectionObserver' in window)){
        revealEls.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
}

// ---------- Navbar: scroll shadow ----------
function setupNavbarScroll(){
    const navbar = document.getElementById('navbar');
    if(!navbar) return;

    function onScroll(){
        if(window.scrollY > 10){
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ---------- Navbar: mobile toggle ----------
function setupNavToggle(){
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if(!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ---------- Navbar: scrollspy (active link highlight) ----------
function setupScrollSpy(){
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if(!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    const linkMap = {};
    navLinks.forEach(link => {
        const id = link.getAttribute('href').replace('#', '');
        linkMap[id] = link;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = linkMap[id];
            if(!link) return;

            if(entry.isIntersecting){
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

// ---------- Link click logging ----------
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Link opened');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    runTerminal();
    setupScrollReveal();
    setupNavbarScroll();
    setupNavToggle();
    setupScrollSpy();
});
