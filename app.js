// Initialize the flashcard app
let flashcards = {};
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

// Show the create form (dummy function for now)
function showCreateForm() {
  alert("Create Flashcard functionality is not implemented yet.");
}

// Load categories and show them as clickable buttons
async function loadCategories() {
  mainMenu.classList.add('hidden');
  categorySelection.classList.remove('hidden');

  // Clear existing buttons
  categoryButtonsContainer.innerHTML = '';

  // List of categories (add more categories here as needed)
  const categories = ['words', 'phrases'];

  // Create buttons for each category
  for (const category of categories) {
    const button = document.createElement('button');
    button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    button.onclick = () => loadCategory(category);
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
    console.error('Failed to load category:', error);
  }
}

// Display the learning mode interface
function startLearning() {
  categorySelection.classList.add('hidden');
  learnMode.classList.remove('hidden');
  document.getElementById('current-category').textContent = `Category: ${currentCategory}`;
  showCard();
}

// Show the current card
function showCard() {
  const card = currentDeck[currentCardIndex];
  isShowingBack = false;
  flashcardContainer.innerHTML = `
    <div>${card.front}</div>
    <button onclick="toggleCard()">Reveal</button>
  `;
}

// Toggle between showing front and back of the flashcard
function toggleCard() {
  const card = currentDeck[currentCardIndex];
  isShowingBack = !isShowingBack;
  flashcardContainer.innerHTML = `
    <div>${isShowingBack ? card.back : card.front}</div>
    <button onclick="toggleCard()">${isShowingBack ? 'Hide' : 'Reveal'}</button>
  `;
}

// Mark the card as learned and move to the next one
function markLearned() {
  currentDeck.splice(currentCardIndex, 1);
  if (currentDeck.length === 0) {
    alert('All cards learned in this category!');
    showMainMenu();
  } else {
    currentCardIndex = currentCardIndex % currentDeck.length;
    showCard();
  }
}

// Shuffle the current card back into the deck
function keepLearning() {
  currentCardIndex = Math.floor(Math.random() * currentDeck.length);
  showCard();
}

// Shuffle the deck of cards
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Show the main menu
function showMainMenu() {
  mainMenu.classList.remove('hidden');
  categorySelection.classList.add('hidden');
  learnMode.classList.add('hidden');
}
