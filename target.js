
const   overlay = document.getElementById('overlay'),
        inFront = document.getElementById('in-front'),
        target = document.querySelector('.target'),
        playground = document.getElementById('playground'),
        menu = document.getElementById('menu'),
        playButton = document.getElementById('play-button'),
        restartButton = document.getElementById('restart-button'),
        rulesButton = document.getElementById('rules'),
        menuButton = document.querySelector('.menu-btn'),
        counter = document.getElementById('counter'),
        hidingButtons = Array.from(document.querySelectorAll('.hiding'));

let     score = 0, 
        menuOffset, 
        menuActive = false;

counter.innerText = score;

const targetValues = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

function updateMenuOffset() {
    menuOffset = (window.innerHeight / 2) + (menu.clientHeight / 2);
    if (!menuActive) {
        menu.style.transform = `translateY(-${menuOffset}px)`;
    }
}

function hideMenu() {
    menu.style.transform = `translateY(-${menuOffset}px)`;
    menuActive = false;
    overlay.style.opacity = 0;
    setTimeout(() => inFront.style.zIndex = -1, 600);
}

function showMenu() {
    menu.style.transform = `translateY(0)`;
    menuActive = true;
    inFront.style.zIndex = 1;
    overlay.style.opacity = 0.7;
}

document.addEventListener('DOMContentLoaded', () => {
    updateMenuOffset();

    requestAnimationFrame(() => {
        menu.style.transform = `translateY(-${menuOffset + 16}px)`;
    });

    playground.style.opacity = 1;

    setTimeout(() => {
        menu.style.transition = `transform .6s ease-in-out`;
        menu.style.transform = `translateY(0)`;
        menuActive = true;
    }, 500);
});

window.addEventListener('resize', updateMenuOffset);

playButton.addEventListener('click', () => {
    hideMenu();
    setTimeout(() => playButton.innerText = 'Resume', 600); 
});

restartButton.addEventListener('click', () => {
    score = 0;
    counter.innerText = score;
    hidingButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.opacity = 1;
        btn.style.display = 'inline';
    });
    setTimeout(() => playButton.innerText = 'Resume', 600);
    hideMenu();
});

menuButton.addEventListener('click', showMenu);

rulesButton.addEventListener('click', () => {
    let rules = document.getElementById('rules-popup');
    if (!rules) {
        rules = document.createElement('article');
        rules.id = 'rules-popup';
        rules.innerHTML = `
            Are you a darts fan? Think you know everything about the game? Really? Well, let's put your memory to the test! 
            Try to reveal all the numbers on the dartboard. Simply click on a hidden field, enter a number, and press Enter or click the dart icon. 
            <button id="rules-exit">Back</button>
        `;
        inFront.appendChild(rules);
        rules.querySelector('#rules-exit').addEventListener('click', () => rules.style.display = 'none');
    } else {
        rules.style.display = 'block';
    }
});

hidingButtons.forEach(hideButton => {
    hideButton.addEventListener('click', (event) => {
        hidingButtons.forEach(btn => btn.classList.remove('active'));
        hideButton.classList.add('active');

        document.querySelector('form')?.remove();

        const form = document.createElement('form');
        form.id = 'dart-form';
        form.innerHTML = `
            <input id="user-input" type="number" min="1" max="20" required>
            <button class="dart-submit" type="submit">
                <img src="img/dart.webp" alt="dart">
            </button>
        `;

        target.appendChild(form);
        const input = form.querySelector('#user-input');
        input.focus();

        input.addEventListener('keypress', (e) => {
            if (['e', 'E', '+', '-', ',', '.'].includes(e.key)) e.preventDefault();
        });

        input.addEventListener('input', () => {
            let value = parseInt(input.value, 10);
            if (value < 1 || isNaN(value)) input.value = 1;
            if (value > 20) input.value = 20;
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const userInput = parseInt(input.value, 10);
            const index = hidingButtons.indexOf(hideButton);
            const correctAnswer = targetValues[index];

            if (userInput === correctAnswer) {
                score++;
                counter.innerText = score;
            }

            hideButton.style.opacity = 0;
            setTimeout(() => hideButton.style.display = 'none', 200);

            form.remove();
        });

        event.stopPropagation();
    });
});

document.body.addEventListener('click', (event) => {
    if (!event.target.closest('.hiding') && !event.target.closest('form')) {
        hidingButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('form')?.remove();
    }
});