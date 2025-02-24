const FLASHCARDS_DIR = 'Flashcards/';
const audio = new Audio('flip.mp3');

let categories = [];
let currentDeck = [];
let currentCardIndex = 0;
let stats = {
    learned: 0,
    toLearn: 0,
    skipped: 0
};

// DOM Elements
const screens = {
    home: document.getElementById('homeScreen'),
    flashcard: document.getElementById('flashcardScreen'),
    results: document.getElementById('resultsScreen')
};

const categorySelect = document.getElementById('categorySelect');
const categoryInfo = document.getElementById('categoryInfo');
const cardCountInput = document.getElementById('cardCount');
const startBtn = document.getElementById('startBtn');
const flashcard = document.getElementById('flashcard');
const front = document.querySelector('.front');
const back = document.querySelector('.back');

// Event Listeners
startBtn.addEventListener('click', startSession);
flashcard.addEventListener('click', flipCard);
document.querySelectorAll('.Learned-btn, .ToLearn-btn, .Skip-btn').forEach(btn => {
    btn.addEventListener('click', handleAction);
});
document.querySelectorAll('[id^="homeBtn"]').forEach(btn => {
    btn.addEventListener('click', returnHome);
});

// Initialize app
detectCategories();

async function detectCategories() {
    try {
        const response = await fetch(`${FLASHCARDS_DIR}categories.json`);
        categories = await response.json();
        populateCategorySelect();
    } catch (error) {
        categoryInfo.textContent = 'No categories found';
    }
}

function populateCategorySelect() {
    categorySelect.innerHTML = categories.map(cat => 
        `<option value="${cat.file}">${cat.name}</option>`
    ).join('');
}

categorySelect.addEventListener('change', async function() {
    if (this.value) {
        try {
            const response = await fetch(`${FLASHCARDS_DIR}${this.value}`);
            const data = await response.json();
            categoryInfo.textContent = `This deck contains ${data.length} flashcards.`;
        } catch (error) {
            categoryInfo.textContent = 'Error loading category info';
        }
    } else {
        categoryInfo.textContent = '';
    }
});

async function startSession() {
    const categoryFile = categorySelect.value;
    const maxCards = parseInt(cardCountInput.value) || 1;
    
    const response = await fetch(`${FLASHCARDS_DIR}${categoryFile}`);
    const data = await response.json();
    
    currentDeck = shuffleArray(data).slice(0, maxCards);
    currentCardIndex = 0;
    resetStats();
    
    screens.home.classList.add('hidden');
    screens.flashcard.classList.remove('hidden');
    updateStatsDisplay();
    showNextCard();
}

function flipCard() {
    flashcard.classList.toggle('flipped');
    audio.play();
}

// Update the handleAction function
function handleAction(e) {
    const action = e.target.dataset.action;
    stats[action]++;
    
    // Update the stats display immediately
    updateStatsDisplay();
    
    if (currentCardIndex < currentDeck.length - 1) {
        currentCardIndex++;
        showNextCard();
    } else {
        showResults();
    }
}


function showNextCard() {
    flashcard.classList.remove('flipped'); // Ensure the card flips back

    // Add a short delay before updating the card content
    setTimeout(() => {
        const card = currentDeck[currentCardIndex];
        
        front.style.opacity = "0"; // Start with hidden content
        back.style.opacity = "0";

        front.textContent = card.question;
        back.textContent = card.answer;

        // Gradually fade in the text
        setTimeout(() => {
            front.style.opacity = "1";
            back.style.opacity = "1";
        }, 100); // Small fade-in delay
    }, 200); // 0.2s delay before changing content

    // Update card counters
    document.getElementById('currentCard').textContent = currentCardIndex + 1;
    document.getElementById('totalCards').textContent = currentDeck.length;
}


function updateStatsDisplay() {
    const total = currentDeck.length;
    document.getElementById('learnedCount').textContent = stats.learned;
    document.getElementById('toLearnCount').textContent = stats.toLearn;
    document.getElementById('skippedCount').textContent = stats.skipped;
    document.getElementById('progressPercent').textContent = 
        Math.round((stats.learned / total) * 100) || 0;
}

// Update the showResults function to properly calculate percentages
function showResults() {
    screens.flashcard.classList.add('hidden');
    screens.results.classList.remove('hidden');
    
    const total = currentDeck.length;
    const resultsHTML = `
        <div class="result-item">
            <span>Total Cards:</span>
            <span>${total}</span>
        </div>
        <div class="result-item">
            <span>✅ Learned:</span>
            <span>${stats.learned} (${((stats.learned / total) * 100).toFixed(1)}%)</span>
        </div>
        <div class="result-item">
            <span>❌ To Learn:</span>
            <span>${stats.toLearn} (${((stats.toLearn / total) * 100).toFixed(1)}%)</span>
        </div>
        <div class="result-item">
            <span>⏩ Skipped:</span>
            <span>${stats.skipped} (${((stats.skipped / total) * 100).toFixed(1)}%)</span>
        </div>
    `;
    document.getElementById('resultsStats').innerHTML = resultsHTML;
}

function returnHome() {
    for (const screen of Object.values(screens)) {
        screen.classList.add('hidden');
    }
    screens.home.classList.remove('hidden');
}

function resetStats() {
    stats = { learned: 0, toLearn: 0, skipped: 0 };
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}


// Play Sound When Clicking Button

const Button_Sound = new Audio('click.mp3'); // Create an Audio object

// Function to play the sound
function playButton_Sound() {
  Button_Sound.play();
}

// Add event listeners to buttons 
document.getElementById('Learned-btn').addEventListener('click', playButton_Sound);
document.getElementById('ToLearn-btn').addEventListener('click', playButton_Sound);
document.getElementById('Skip-btn').addEventListener('click', playButton_Sound);
document.getElementById('homeBtn1').addEventListener('click', playButton_Sound);
document.getElementById('homeBtn2').addEventListener('click', playButton_Sound);
