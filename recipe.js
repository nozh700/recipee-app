// Login & Signup Elements

const loginPopup = document.getElementById('login-popup');
const signupPopup = document.getElementById('signup-popup');

// Create Overlay

const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Show Login Popup On Page Load

window.onload = () => {
  loginPopup.style.display = 'block';
  overlay.style.display = 'block';
};
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

// Open Signup Form

showSignup.addEventListener('click', () => {
  loginPopup.style.display = 'none';
  signupPopup.style.display = 'block';
});

// Open Login Form

showLogin.addEventListener('click', () => {
  signupPopup.style.display = 'none';
  loginPopup.style.display = 'block';
});

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
// Signup Form Submit

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  // Get Existing Users

  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Check User Already Exists

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    alert('Username Already Exists');
    return;
  }

  // Add New User

  const user = {
    username,
    password,
  };

  users.push(user);

  // Save Updated Users Array

  localStorage.setItem('users', JSON.stringify(users));

  alert('Signup Successful');

  signupPopup.style.display = 'none';
  loginPopup.style.display = 'block';
});

// Login Form Submit

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  // Get All Users

  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Find Matching User

  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (validUser) {
    alert('Login Successful');

    loginPopup.style.display = 'none';
    overlay.style.display = 'none';
  } else {
    alert('Invalid Username or Password');
  }
});

const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const favoriteRecipesContainer = document.querySelector(
  '.favorite-recipes-container'
);
const spinner = document.querySelector('.spinner');
const favoriteBtn = document.querySelector('.favorite');
const favoritePopup = document.querySelector('.favorite-popup');
const favoritePopupCloseBtn = document.querySelector(
  '.favorite-popup-close-btn'
);
// Function to show the spinner
const showSpinner = () => {
  spinner.style.display = 'block';
};

// Function to hide the spinner
const hideSpinner = () => {
  spinner.style.display = 'none';
};
const fetchRecipe = async (query) => {
  showSpinner();
  recipeContainer.innerHTML = '<h2>Fetching Recipe...</h2>';
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();
    hideSpinner();
    if (response.meals) {
      recipeContainer.innerHTML = '';
      response.meals.forEach((meal) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs To <span>${meal.strCategory}</span> Category</p>
                `;

        // Favorite button
        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = 'Add to Favorites';
        favoriteButton.classList.add('colorful-button');
        favoriteButton.addEventListener('click', () => saveToFavorites(meal));
        recipeDiv.appendChild(favoriteButton);

        const button = document.createElement('button');
        button.textContent = 'View Recipe';
        button.classList.add('colorful-button'); // Add class for colorful effect
        recipeDiv.appendChild(button);

        button.addEventListener('click', () => {
          openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      recipeContainer.innerHTML = '<h2>No recipes found.</h2>';
    }
  } catch (error) {
    hideSpinner();
    recipeContainer.innerHTML =
      '<h2>Failed to fetch recipes. Please try again later.</h2>';
    console.error('Error fetching recipes:', error);
  }
};
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) {
    fetchRecipe(searchInput);
  } else {
    recipeContainer.innerHTML = '<h2>Please enter a search term.</h2>';
  }
});

//Function to open recipe popup
const openRecipePopup=(meal)=>{
  //Extract YouTube video ID from meal.strYoutube
  const videoId=meal.strYoutube.split('v=')[1];
  const embedUrl=`https://www.youtube.com/embed/${videoId}`;

  recipeDetailsContent.innerHTML=`
  <h2 class="recipename">${meal.strMeal}</h2>
  <h3>Ingredients</h3>
  <ul class="ingredientlist">${fetchIngredients(meal)}</ul>
  <div id="imgset">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal};">
  </div>
  <div id="insset">  
      <h3>Instructions</h3>
      <p class="recipeInstruction">${meal.strInstructions}</p>
  </div>
  <iframe id="videoset" width=600 height="400" src="${embedUrl}" frameborder="0" allowfllScreen> </iframe>
  `;
  recipeDetailsContent.parentElement.style.display='block';
};

const fetchIngredients=(meal)=>{
  let ingredientList='';
  for(let i=1;i<=20;i++){
    const ingredient=meal[`strIngredient${i}`];
    if(ingredient){
      const measure=meal[`strMeasure${i}`];
      ingredientList+=`<li>${measure} ${ingredient}</li>`;
    }else{
      break;
    }
  }
  return ingredientList;
};

//working of close button 
recipeCloseBtn.addEventListener('click',()=>{
  recipeDetailsContent.parentElement.style.display="none";
});



