// Create stars
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 3 + 1}px`;
    star.style.height = star.style.width;
    star.style.setProperty('--opacity', Math.random());
    star.style.setProperty('--duration', `${Math.random() * 5 + 3}s`);
    star.style.animationDelay = `${Math.random() * 5}s`;
    starsContainer.appendChild(star);
}

let headsCount = 0;
let tailsCount = 0;
let isFlipping = false;

function flipCoin() {
    if (isFlipping) return;

    const coin = document.getElementById('coin');
    const result = document.getElementById('result');
    const button = document.querySelector('.btn');
    const coinShadow = document.querySelector('.coin-shadow');

    isFlipping = true;
    button.disabled = true;
    result.textContent = '';
    result.className = '';

    // Reset coin position
    coin.style.transform = 'rotateY(0)';
    coinShadow.style.transform = 'translateX(-50%) scale(0.8)';
    coinShadow.style.opacity = '0.5';

    // Create random outcome
    const random = Math.random();
    const isHeads = random >= 0.5;

    // Calculate rotation
    const rotations = 5 + Math.floor(random * 5);
    const finalDegree = isHeads ? rotations * 360 : (rotations * 360) + 180;

    // Apply flip animation
    coin.style.transition = 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    coin.style.transform = `rotateY(${finalDegree}deg)`;

    // Shadow animation
    coinShadow.animate([
        { transform: 'translateX(-50%) scale(1.2)', opacity: 0.8 },
        { transform: 'translateX(-50%) scale(0.6)', opacity: 0.3 },
        { transform: 'translateX(-50%) scale(0.9)', opacity: 0.5 }
    ], {
        duration: 2000,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });

    // Play sound
    playCoinSound();

    // After animation completes
    setTimeout(() => {
        if (isHeads) {
            result.textContent = 'شیر!';
            result.className = 'heads animate__animated animate__tada';
            headsCount++;
            createConfetti('#f5d742');
        } else {
            result.textContent = 'خط!';
            result.className = 'tails animate__animated animate__tada';
            tailsCount++;
            createConfetti('#e0e0e0');
        }

        // Update stats
        updateStats();

        // Enable button
        button.disabled = false;
        isFlipping = false;

        // Add glow effect to coin
        coin.classList.add('glow');
        setTimeout(() => {
            coin.classList.remove('glow');
        }, 2000);
    }, 2000);
}

function updateStats() {
    document.getElementById('heads-count').textContent = headsCount;
    document.getElementById('tails-count').textContent = tailsCount;
    document.getElementById('total-count').textContent = headsCount + tailsCount;

    // Animate stats
    const stats = document.querySelectorAll('.stat-box');
    stats.forEach(box => {
        box.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            box.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
    });
}

function playCoinSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.7);

        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.7);
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function createConfetti(color) {
    const container = document.querySelector('.container');
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.setProperty('--bg', color);
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = -20 + 'px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        container.appendChild(confetti);

        const animationDuration = Math.random() * 3 + 2;

        const keyframes = [
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${Math.random() * 400 - 200}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ];

        const timing = {
            duration: animationDuration * 1000,
            iterations: 1,
            easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
        };

        confetti.animate(keyframes, timing);

        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}