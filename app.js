// Initial setup
const flashcards = {};
let currentCategory = '';
let currentDeck = [];
let currentCardIndex = 0;
let isShowingBack = false;

// Elements
const mainMenu = document.getElementById('main-menu');
const categorySelection = document.getElementById('category-selection');
const learnMode = document.getElementById('learn-mode');
const flashcardContainer = document.getElementById('flashcard-container');
const categoryButtonsContainer = document.getElementById('category-buttons');
const errorLog = document.getElementById('error-log');

// Attach event listeners to buttons
document.getElementById('create-btn').addEventListener('click', showCreateForm);
document.getElementById('learn-btn').addEventListener('click', loadCategories);
document.getElementById('back-to-menu').addEventListener('click', showMainMenu);
document.getElementById('learned-btn').addEventListener('click', markLearned);
document.getElementById('keep-learning-btn').addEventListener('click', keepLearning);
document.getElementById('end-session-btn').addEventListener('click', showMainMenu);

// Dummy function for "Create Flashcard"
function showCreateForm() {
  alert("Create Flashcard functionality is not implemented yet.");
}

// Load categories from JSON files in the flashcards directory
async function loadCategories() {
  mainMenu.classList.add('hidden');
  categorySelection.classList.remove('hidden');

  categoryButtonsContainer.innerHTML = '';  // Clear existing buttons

  const categories = ['words', 'phrases'];  // Add more categories as needed

  // Create buttons for each category
  for (const category of categories) {
    const button = document.createElement('button');
    button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    button.addEventListener('click', () => loadCategory(category));
    categoryButtonsContainer.appendChild(button);
  }
}

// Load flashcards for a specific category
async function loadCategory(category) {
  try {
    const response = await fetch(`flashcards/${category}.json`);
    const data = await response.json();
    flashcards[category] = data;
    currentCategory = category;
    currentDeck = [...flashcards[category]];
    currentCardIndex = 0;
    shuffleDeck(currentDeck);
    startLearning();
  } catch (error) {
    logError(`Failed to load category "${category}": ${error.message}`);
  }
}

// Show learning mode and display the first flashcard
function startLearning() {
  categorySelection.classList.add('hidden');
  learnMode.classList.remove('hidden');
  document.getElementById('current-category').textContent = `Category: ${currentCategory}`;
  showCard();
}

// Display the current card
function showCard() {
  const card = currentDeck[currentCardIndex];
  isShowingBack = false;
  flashcardContainer.innerHTML = `
    <div>${card.front}</div>
    <button onclick="toggleCard()">Reveal</button>
  `;
}

// Toggle front and back of flashcard
function toggleCard() {
  const card = currentDeck[currentCardIndex];
  isShowingBack = !isShowingBack;
  flashcardContainer.innerHTML = `
    <div>${isShowingBack ? card.back : card.front}</div>
    <button onclick="toggleCard()">${isShowingBack ? 'Hide' : 'Reveal'}</button>
  `;
}

// Mark card as learned
function markLearned() {
  currentDeck.splice(currentCardIndex, 1);
  if (currentDeck.length === 0) {
    alert('All cards learned in this category!');
    showMainMenu();
  } else {
    currentCardIndex %= currentDeck.length;
    showCard();
  }
}

// Keep card in deck for future review
function keepLearning() {
  currentCardIndex = Math.floor(Math.random() * currentDeck.length);
  showCard();
}

// Shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Show main menu
function showMainMenu() {
  mainMenu.classList.remove('hidden');
  categorySelection.classList.add('hidden');
  learnMode.classList.add('hidden');
}

// Log error messages to help with debugging
function logError(message) {
  errorLog.classList.remove('hidden');
  errorLog.textContent = `Error: ${message}`;
}
