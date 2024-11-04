// Log that JavaScript has loaded
console.log("JavaScript file loaded.");

// Ensure DOM elements are loaded and accessible
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // Initialize state variables
  let flashcards = {};
  let currentCategory = '';
  let currentDeck = [];
  let currentCardIndex = 0;
  let isShowingBack = false;

  // Main elements
  const mainMenu = document.getElementById('main-menu');
  const categorySelection = document.getElementById('category-selection');
  const learnMode = document.getElementById('learn-mode');
  const flashcardContainer = document.getElementById('flashcard-container');
  const categoryButtonsContainer = document.getElementById('category-buttons');
  const errorLog = document.getElementById('error-log');

  // Button event listeners
  document.getElementById('create-btn').addEventListener('click', showCreateForm);
  document.getElementById('learn-btn').addEventListener('click', loadCategories);
  document.getElementById('back-to-menu').addEventListener('click', showMainMenu);
  document.getElementById('learned-btn').addEventListener('click', markLearned);
  document.getElementById('keep-learning-btn').addEventListener('click', keepLearning);
  document.getElementById('end-session-btn').addEventListener('click', showMainMenu);

  // Function for "Create Flashcard" - Not yet implemented
  function showCreateForm() {
    alert("Create Flashcard functionality is not implemented yet.");
  }

  // Load categories from predefined JSON files
  async function loadCategories() {
    console.log("Loading categories...");
    mainMenu.classList.add('hidden');
    categorySelection.classList.remove('hidden');

    // Clear existing buttons
    categoryButtonsContainer.innerHTML = '';

    const categories = ['words', 'phrases'];  // Categories to be loaded

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
      const response = await fetch(`Flashcards/${category}.json`);
      if (!response.ok) throw new Error(`Failed to load ${category}.json`);
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

  // Shuffle the deck
  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  // Return to the main menu
  function showMainMenu() {
    mainMenu.classList.remove('hidden');
    categorySelection.classList.add('hidden');
    learnMode.classList.add('hidden');
  }

  // Error log function
  function logError(message) {
    errorLog.classList.remove('hidden');
    errorLog.textContent = `Error: ${message}`;
    console.error(message);
  }
});
