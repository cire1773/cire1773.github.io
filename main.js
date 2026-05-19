let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    initLang();
    initTheme();
    initNavigation();
    initBackground();
    launchEmojis();
});

function initLang() {
    const langBtn = document.getElementById('lang-toggle');
    updateTexts();

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ro' : 'en';
        updateTexts();
    });
}

function updateTexts() {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (cvData[key] && cvData[key][currentLang]) {
            el.innerHTML = cvData[key][currentLang];
        }
    });
}

function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
}

function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn, .side-nav-btn');
    
    // Initial setup for Frame 1
    triggerEnterAnimations(document.getElementById('frame-1'));

    navBtns.forEach(btn => {
        // Skip links that just act as buttons but shouldn't trigger frame navigation (like the download btn)
        if (!btn.hasAttribute('data-target')) return;

        btn.addEventListener('click', (e) => {
            // Find targetId from either the exact target clicked or its parent button
            const targetId = e.currentTarget.getAttribute('data-target');
            goToFrame(targetId);
        });
    });
}

function goToFrame(targetId) {
    const currentFrame = document.querySelector('.frame.active');
    const targetFrame = document.getElementById(targetId);

    if (currentFrame && targetFrame && currentFrame !== targetFrame) {
        // Exit current
        currentFrame.classList.remove('active');
        currentFrame.classList.add('exit');
        
        // Remove enter classes from current to reset them for next time
        const currentItems = currentFrame.querySelectorAll('.animate-item');
        currentItems.forEach(item => item.classList.remove('enter'));

        // After exit animation, enter new
        setTimeout(() => {
            currentFrame.classList.remove('exit');
            targetFrame.classList.add('active');
            triggerEnterAnimations(targetFrame);
        }, 500); // Matches CSS transition duration
    }
}

function triggerEnterAnimations(frame) {
    const items = frame.querySelectorAll('.animate-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('enter');
        }, (index + 1) * 150); // Stagger delay
    });
}

function launchEmojis() {
    const container = document.getElementById('animation-container');
    const emojis = ['🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '⭐', '⭐', '⭐', '⭐'];
    
    // Hide main content initially to show the launch
    const mainContainer = document.getElementById('cv-container');
    mainContainer.style.opacity = '0';
    mainContainer.style.transition = 'opacity 1s ease';

    emojis.forEach((emoji, index) => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.classList.add('emoji-sprite');
        
        // Randomize origin within a 400x200 invisible rectangle at center
        const offsetX = (Math.random() - 0.5) * 400;
        const offsetY = (Math.random() - 0.5) * 200;
        span.style.left = `calc(50% + ${offsetX}px)`;
        span.style.top = `calc(50% + ${offsetY}px)`;

        // Randomize destination (outwards)
        const angle = Math.random() * Math.PI * 2;
        const distance = 500 + Math.random() * 300;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        span.style.setProperty('--dx', `${dx}px`);
        span.style.setProperty('--dy', `${dy}px`);
        span.style.setProperty('--rot', `${Math.random() * 360}deg`);

        // Add animation
        span.style.animation = `flyOut 1.5s ease-out forwards`;
        // Stagger the launch slightly
        span.style.animationDelay = `${Math.random() * 0.3}s`;

        container.appendChild(span);
    });

    // Cleanup and show main content
    setTimeout(() => {
        container.innerHTML = '';
        mainContainer.style.opacity = '1';
    }, 2000);
}

function initBackground() {
    const bgContainer = document.createElement('div');
    bgContainer.id = 'background-decorations';
    document.body.appendChild(bgContainer);
    
    const svgs = [
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', // Star
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>', // Crescent Moon
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="8" r="2"/><circle cx="15" cy="14" r="3"/><circle cx="10" cy="16" r="1"/></svg>', // Our Moon (craters)
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(-20 12 12)"/></svg>' // Saturn
    ];

    const rows = 4;
    const cols = 5;
    const cellWidth = window.innerWidth / cols;
    const cellHeight = window.innerHeight / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const decor = document.createElement('div');
            decor.classList.add('bg-decor');
            decor.innerHTML = svgs[Math.floor(Math.random() * svgs.length)];
            
            // Varied sizes from small to large
            const size = 30 + Math.random() * 90; // Sizes between 30px and 120px
            
            // Random position within the grid cell, keeping it fully inside
            const maxOffsetX = cellWidth - size;
            const maxOffsetY = cellHeight - size;
            
            const left = (c * cellWidth) + (Math.random() * (maxOffsetX > 0 ? maxOffsetX : 0));
            const top = (r * cellHeight) + (Math.random() * (maxOffsetY > 0 ? maxOffsetY : 0));

            decor.style.left = `${left}px`;
            decor.style.top = `${top}px`;
            decor.style.width = `${size}px`;
            decor.style.height = `${size}px`;
            decor.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            bgContainer.appendChild(decor);
        }
    }
}