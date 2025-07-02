let blocks = [];
let empty = 15;
let moves = 0;
let moving = false;
const winStuff = document.getElementById('win-popup');

function init() {
    blocks = [];
    for (let i = 1; i <= 15; i++) {
        blocks.push(i);
    }
    blocks.push(0);
    scramble();

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] === 0) {
            empty = i;
            break;
        }
    }

    render();
}

function render() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');

        if (blocks[i] === 0) {
            block.className = 'empty';
            block.textContent = '';
        } else {
            block.className = 'block';
            block.id = `block-${i}`;
            block.textContent = blocks[i];
            block.onclick = function () { move(i); };

            if (canMove(i)) {
                block.classList.add('movable');
            }
        }

        grid.appendChild(block);
    }

    if (won()) {
        showWin();
    }
}

function getDir(from, to) {
    const FR = Math.floor(from / 4);
    const FC = from % 4;
    const TR = Math.floor(to / 4);
    const TC = to % 4;

    if (FR === TR) {
        return FC < TC ? 'right' : 'left';
    } else {
        return FR < TR ? 'down' : 'up';
    }
}

function getMove(direction) {
    const distance = 80;
    switch (direction) {
        case 'up': return `translateY(-${distance}px)`;
        case 'down': return `translateY(${distance}px)`;
        case 'left': return `translateX(-${distance}px)`;
        case 'right': return `translateX(${distance}px)`;
        default: return 'translateX(0)';
    }
}

async function move(clicked) {
    if (canMove(clicked) && !moving) {
        moving = true;

        const clickedBlock = document.getElementById(`block-${clicked}`);
        const direction = getDir(clicked, empty);
        const transformstr = getMove(direction);

        clickedBlock.classList.add('moving');
        clickedBlock.style.transform = transformstr;

        await new Promise(resolve => setTimeout(resolve, 100));

        blocks[empty] = blocks[clicked];
        blocks[clicked] = 0;
        empty = clicked;

        moves++;
        document.getElementById('counter').textContent = `${moves}`;

        render();
        moving = false;
    }
}

function canMove(i) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const emptyRow = Math.floor(empty / 4);
    const emptyCol = empty % 4;

    const samerow = row === emptyRow && Math.abs(col - emptyCol) === 1;
    const samecol = col === emptyCol && Math.abs(row - emptyRow) === 1;

    return samerow || samecol;
}

function scramble() {
    moves = 0;
    document.getElementById('counter').textContent = moves;
    hideWin();
    moving = false;

    for (let i = 0; i < 1000; i++) {
        const movables = [];
        for (let j = 0; j < blocks.length; j++) {
            if (canMove(j)) {
                movables.push(j);
            }
        }

        if (movables.length > 0) {
            const random = Math.floor(Math.random() * movables.length);
            const blockThatRequiresMovingServices = movables[random]; // no idea what else to name it

            blocks[empty] = blocks[blockThatRequiresMovingServices];
            blocks[blockThatRequiresMovingServices] = 0;
            empty = blockThatRequiresMovingServices;
        }
    }

    render();
}

const solve = () => {
    blocks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    empty = 15;
    moving = false;
    render();
}

function won() {
    for (let i = 0; i < 15; i++) {
        if (blocks[i] !== i + 1) {
            return false;
        }
    }

    return blocks[15] === 0;
}

function showWin() {
    document.getElementById('win-message').textContent = `You solved it in ${moves} moves!`;
    winStuff.classList.add('show');
}

function hideWin() {
    winStuff.classList.remove('show');
}

function createSnow() {
    const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❇', '✶'];

    function addSnow() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.top = '-100px';
        snowflake.style.fontSize = (Math.random() * 0.8 + 0.8) + 'em';
        snowflake.style.animationDuration = (Math.random() * 5 + 8) + 's';
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(snowflake);

        const duration = parseFloat(snowflake.style.animationDuration) * 1000;
        const delay = parseFloat(snowflake.style.animationDelay) * 1000;
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.remove();
            }
        }, duration + delay);
    }

    for (let i = 0; i < 8; i++) {
        setTimeout(() => addSnow(), i * 1000);
    }

    setInterval(() => {
        addSnow();
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
    init();
    createSnow();
});