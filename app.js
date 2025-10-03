const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple file-based storage (fallback when MongoDB is not available)
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    users: [],
    recipes: [
      // Vegetarian Recipes (4 recipes)
      {
        _id: "1",
        title: "Mediterranean Quinoa Salad",
        ingredients: ["1 cup quinoa", "2 cups vegetable broth", "1 cucumber, diced", "2 tomatoes, diced", "1/2 red onion, diced", "1/2 cup kalamata olives", "1/4 cup feta cheese", "3 tbsp olive oil", "2 tbsp lemon juice", "Salt and pepper to taste"],
        instructions: "Cook quinoa in vegetable broth. Let cool. Mix with vegetables, olives, and feta. Whisk olive oil with lemon juice and season. Toss salad with dressing.",
        prepTime: 25,
        diet: "vegetarian",
        cuisine: "Mediterranean"
      },
      {
        _id: "2",
        title: "Classic Margherita Pizza",
        ingredients: ["1 pizza dough", "1/2 cup tomato sauce", "8 oz fresh mozzarella", "Fresh basil leaves", "2 tbsp olive oil", "Salt and pepper", "Parmesan cheese"],
        instructions: "Preheat oven to 475°F. Roll out dough. Spread sauce, add mozzarella. Bake 12-15 minutes. Top with basil, olive oil, and parmesan.",
        prepTime: 30,
        diet: "vegetarian",
        cuisine: "Italian"
      },
      {
        _id: "3", 
        title: "Spinach and Ricotta Stuffed Shells",
        ingredients: ["20 jumbo pasta shells", "2 cups ricotta cheese", "2 cups fresh spinach", "1/2 cup parmesan", "2 eggs", "2 cups marinara sauce", "1 cup mozzarella", "Garlic", "Italian herbs"],
        instructions: "Cook shells. Mix ricotta, spinach, parmesan, eggs, and seasonings. Stuff shells with mixture. Top with marinara and mozzarella. Bake at 375°F for 25 minutes.",
        prepTime: 45,
        diet: "vegetarian",
        cuisine: "Italian"
      },
      {
        _id: "4",
        title: "Indian Paneer Butter Masala",
        ingredients: ["400g paneer cubes", "2 tomatoes", "1 onion", "3 cloves garlic", "1 inch ginger", "2 tbsp butter", "1/2 cup heavy cream", "Garam masala", "Turmeric", "Red chili powder"],
        instructions: "Blend tomatoes, onion, garlic, ginger into paste. Cook paste with spices. Add paneer and cream. Simmer until thick. Garnish with butter and coriander.",
        prepTime: 30,
        diet: "vegetarian", 
        cuisine: "Indian"
      },
      
      // Vegan Recipes (3 recipes)
      {
        _id: "5",
        title: "Vegan Chocolate Avocado Mousse",
        ingredients: ["2 ripe avocados", "1/4 cup cocoa powder", "1/4 cup maple syrup", "2 tbsp almond milk", "1 tsp vanilla extract", "Pinch of salt", "Fresh berries for topping"],
        instructions: "Blend all ingredients except berries until smooth and creamy. Chill for 2 hours. Serve topped with fresh berries.",
        prepTime: 10,
        diet: "vegan",
        cuisine: "International"
      },
      {
        _id: "6",
        title: "Vegan Buddha Bowl",
        ingredients: ["1 cup quinoa", "1 sweet potato", "1 cup chickpeas", "2 cups kale", "1/4 cup tahini", "2 tbsp lemon juice", "1 avocado", "Pumpkin seeds", "Olive oil", "Salt and pepper"],
        instructions: "Roast sweet potato and chickpeas. Cook quinoa. Massage kale with olive oil. Make tahini dressing. Arrange all in bowl and drizzle with dressing.",
        prepTime: 35,
        diet: "vegan",
        cuisine: "International"
      },
      {
        _id: "7",
        title: "Vegan Lentil Curry",
        ingredients: ["1 cup red lentils", "1 can coconut milk", "1 onion", "3 tomatoes", "Ginger-garlic paste", "Cumin seeds", "Turmeric", "Coriander powder", "Garam masala", "Cilantro"],
        instructions: "Sauté onions until golden. Add ginger-garlic paste and spices. Add tomatoes and cook until soft. Add lentils and coconut milk. Simmer until lentils are cooked.",
        prepTime: 25,
        diet: "vegan",
        cuisine: "Indian"
      },

      // Keto Recipes (3 recipes)  
      {
        _id: "8",
        title: "Keto Salmon with Asparagus",
        ingredients: ["4 salmon fillets", "1 lb asparagus", "3 tbsp butter", "2 cloves garlic, minced", "1 lemon, juiced", "Salt and pepper", "Fresh dill"],
        instructions: "Season salmon with salt and pepper. Pan sear 4 minutes per side. Sauté asparagus with garlic and butter. Finish with lemon juice and dill.",
        prepTime: 20,
        diet: "keto",
        cuisine: "International"
      },
      {
        _id: "9",
        title: "Keto Chicken Alfredo Zucchini Noodles",
        ingredients: ["2 chicken breasts", "3 large zucchini", "1/2 cup heavy cream", "1/2 cup parmesan", "3 tbsp butter", "2 cloves garlic", "Italian seasoning", "Salt and pepper"],
        instructions: "Spiralize zucchini into noodles. Cook chicken and slice. Make alfredo sauce with cream, butter, garlic, and parmesan. Toss everything together.",
        prepTime: 25,
        diet: "keto",
        cuisine: "Italian"
      },
      {
        _id: "10",
        title: "Keto Avocado Bacon Salad",
        ingredients: ["4 strips bacon", "2 avocados", "4 cups mixed greens", "2 tbsp olive oil", "1 tbsp apple cider vinegar", "1/4 cup blue cheese", "Cherry tomatoes", "Salt and pepper"],
        instructions: "Cook bacon until crispy. Slice avocados and tomatoes. Toss greens with oil and vinegar. Top with bacon, avocado, tomatoes, and blue cheese.",
        prepTime: 15,
        diet: "keto",
        cuisine: "International"
      },

      // Paleo Recipes (2 recipes)
      {
        _id: "11", 
        title: "Paleo Grilled Chicken with Sweet Potato",
        ingredients: ["4 chicken breasts", "2 large sweet potatoes", "2 tbsp olive oil", "Rosemary", "Thyme", "Garlic powder", "Salt and pepper", "Lemon"],
        instructions: "Season chicken with herbs and spices. Grill 6-7 minutes per side. Roast sweet potatoes at 400°F for 45 minutes. Serve with lemon wedges.",
        prepTime: 50,
        diet: "paleo",
        cuisine: "International"
      },
      {
        _id: "12",
        title: "Paleo Beef and Vegetable Stir Fry",
        ingredients: ["1 lb beef strips", "2 bell peppers", "1 broccoli head", "1 zucchini", "2 carrots", "3 tbsp coconut oil", "2 tbsp coconut aminos", "Ginger", "Garlic", "Sesame seeds"],
        instructions: "Heat coconut oil in wok. Stir fry beef until cooked. Add vegetables and cook until crisp-tender. Season with coconut aminos, ginger, and garlic.",
        prepTime: 20,
        diet: "paleo",
        cuisine: "Asian"
      },

      // Gluten-Free Recipes (2 recipes)
      {
        _id: "13",
        title: "Gluten-Free Chicken Parmesan",
        ingredients: ["4 chicken breasts", "1 cup almond flour", "1/2 cup parmesan", "2 eggs", "2 cups marinara sauce", "1 cup mozzarella", "Italian seasoning", "Olive oil"],
        instructions: "Coat chicken in egg, then almond flour mixture. Bake at 400°F for 20 minutes. Top with marinara and mozzarella. Bake 5 more minutes.",
        prepTime: 35,
        diet: "gluten-free",
        cuisine: "Italian"
      },
      {
        _id: "14",
        title: "Gluten-Free Quinoa Stuffed Bell Peppers",
        ingredients: ["4 bell peppers", "1 cup quinoa", "1 lb ground turkey", "1 onion", "2 tomatoes", "1 cup corn", "Mexican seasoning", "Cheese", "Cilantro"],
        instructions: "Cook quinoa and brown turkey with onion. Mix with tomatoes, corn, and seasonings. Stuff peppers and bake at 375°F for 30 minutes. Top with cheese.",
        prepTime: 45,
        diet: "gluten-free",
        cuisine: "Mexican"
      },

      // Omnivore Recipes (4 recipes)
      {
        _id: "15",
        title: "Spicy Thai Basil Stir Fry",
        ingredients: ["1 lb chicken breast, sliced", "3 cloves garlic, minced", "2 thai chilies, minced", "1 cup fresh thai basil", "2 tbsp soy sauce", "1 tbsp oyster sauce", "1 tsp sugar", "2 tbsp vegetable oil", "Steamed jasmine rice"],
        instructions: "Heat oil in wok. Stir fry garlic and chilies. Add chicken and cook until done. Add sauces and sugar. Stir in basil until wilted. Serve over rice.",
        prepTime: 15,
        diet: "omnivore",
        cuisine: "Thai"
      },
      {
        _id: "16", 
        title: "Classic Beef Tacos",
        ingredients: ["1 lb ground beef", "8 taco shells", "1 onion", "2 tomatoes", "Lettuce", "Cheddar cheese", "Sour cream", "Taco seasoning", "Lime", "Hot sauce"],
        instructions: "Brown beef with taco seasoning. Warm taco shells. Chop vegetables. Assemble tacos with beef, vegetables, cheese, and condiments.",
        prepTime: 20,
        diet: "omnivore", 
        cuisine: "Mexican"
      },
      {
        _id: "17",
        title: "Honey Garlic Pork Chops",
        ingredients: ["4 pork chops", "1/4 cup honey", "3 tbsp soy sauce", "4 cloves garlic", "2 tbsp olive oil", "1 tbsp apple cider vinegar", "Salt and pepper", "Green onions"],
        instructions: "Season pork chops. Sear in hot pan 4 minutes per side. Make sauce with honey, soy sauce, and garlic. Pour over chops and simmer 2 minutes.",
        prepTime: 18,
        diet: "omnivore",
        cuisine: "Asian"
      },
      {
        _id: "18",
        title: "Mediterranean Lamb Kebabs", 
        ingredients: ["2 lbs ground lamb", "1 onion", "3 cloves garlic", "1/4 cup parsley", "2 tsp cumin", "1 tsp coriander", "Pita bread", "Tzatziki sauce", "Tomatoes", "Cucumber"],
        instructions: "Mix lamb with minced onion, garlic, herbs and spices. Form into kebabs. Grill 12-15 minutes turning once. Serve with pita, tzatziki and vegetables.",
        prepTime: 25,
        diet: "omnivore",
        cuisine: "Mediterranean"
      }
    ]
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Helper functions for file-based storage
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, diet, allergies, cuisines } = req.body;
  console.log('Registration attempt:', { name, email, diet, allergies, cuisines });
  
  try {
    const data = readData();
    
    // Check if user already exists
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      diet: diet || '',
      allergies: allergies || [],
      cuisines: cuisines || [],
      createdAt: new Date()
    };
    
    data.users.push(newUser);
    writeData(data);
    
    console.log('User created successfully:', newUser._id);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  try {
    const data = readData();
    const user = data.users.find(u => u.email === email);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Recipe routes
app.get('/api/recipes', (req, res) => {
  try {
    const data = readData();
    const { diet, cuisine, prepTime, search } = req.query;
    
    let recipes = [...data.recipes];
    
    if (diet) recipes = recipes.filter(r => r.diet === diet);
    if (cuisine) recipes = recipes.filter(r => r.cuisine === cuisine);
    if (prepTime) recipes = recipes.filter(r => r.prepTime <= parseInt(prepTime));
    if (search) {
      recipes = recipes.filter(r => 
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.ingredients.some(ing => ing.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Transform recipes for frontend compatibility
    const transformedRecipes = recipes.map(transformRecipeForFrontend);
    res.json(transformedRecipes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Helper function to transform recipe data for frontend compatibility
function transformRecipeForFrontend(recipe) {
  return {
    ...recipe,
    name: recipe.title || recipe.name,
    dietType: recipe.diet || recipe.dietType,
    cookTime: recipe.cookTime || 15, // Default cook time
    servings: recipe.servings || 4,
    description: recipe.description || `Delicious ${recipe.title || recipe.name} recipe with authentic flavors and easy preparation.`,
    image: recipe.image || getDefaultImageForRecipe(recipe),
    // Transform ingredients from strings to structured format
    ingredients: recipe.ingredients.map((ing, index) => {
      if (typeof ing === 'string') {
        const parts = ing.match(/^(\d+(?:\/\d+)?)\s*(\w+)?\s*(.+)/) || [];
        return {
          amount: parts[1] || '1',
          unit: parts[2] || 'piece',
          name: parts[3] || ing
        };
      }
      return ing;
    }),
    // Transform instructions from string to array
    instructions: Array.isArray(recipe.instructions) 
      ? recipe.instructions 
      : recipe.instructions.split('. ').filter(inst => inst.trim()).map(inst => inst.trim() + (inst.endsWith('.') ? '' : '.'))
  };
}

// Helper function to get default images for recipes
function getDefaultImageForRecipe(recipe) {
  const imageMap = {
    'Mediterranean Quinoa Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    'Classic Margherita Pizza': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500',
    'Creamy Mushroom Risotto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500',
    'Indian Paneer Butter Masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500',
    'Vegan Chocolate Avocado Mousse': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500',
    'Vegan Buddha Bowl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    'Vegan Lentil Curry': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500',
    'Keto Salmon with Asparagus': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500',
    'Keto Chicken Alfredo Zucchini Noodles': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500',
    'Keto Avocado Bacon Salad': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    'Paleo Grilled Chicken with Sweet Potato': 'https://images.unsplash.com/photo-1598515213345-d710d121c709?w=500',
    'Paleo Beef and Vegetable Stir Fry': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500',
    'Gluten-Free Chicken Parmesan': 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=500',
    'Gluten-Free Quinoa Stuffed Bell Peppers': 'https://images.unsplash.com/photo-1563379091339-03246cea421d?w=500',
    'Spicy Thai Basil Stir Fry': 'https://images.unsplash.com/photo-1559847844-d724c5632a85?w=500',
    'Classic Beef Tacos': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
    'Honey Garlic Pork Chops': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
    'Mediterranean Lamb Kebabs': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500'
  };
  
  return imageMap[recipe.title] || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500';
}

app.get('/api/recipes/:id', (req, res) => {
  try {
    const data = readData();
    const recipe = data.recipes.find(r => r._id === req.params.id);
    if (!recipe) return res.status(404).json({ success: false, error: 'Recipe not found' });
    
    const transformedRecipe = transformRecipeForFrontend(recipe);
    res.json({ success: true, recipe: transformedRecipe });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Recipe reviews endpoints
app.get('/api/recipes/:id/reviews', (req, res) => {
  try {
    const data = readData();
    const reviews = data.reviews ? data.reviews.filter(r => r.recipeId === req.params.id) : [];
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/recipes/:id/reviews', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Access denied' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const data = readData();
    const user = data.users.find(u => u._id === decoded.id);
    
    if (!user) return res.status(401).json({ success: false, error: 'Invalid token' });
    
    const { rating, comment } = req.body;
    
    if (!data.reviews) data.reviews = [];
    
    // Check if user already reviewed this recipe
    const existingReview = data.reviews.find(r => r.recipeId === req.params.id && r.userId === user._id);
    if (existingReview) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this recipe' });
    }
    
    const review = {
      _id: Date.now().toString(),
      recipeId: req.params.id,
      userId: user._id,
      username: user.username,
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date().toISOString()
    };
    
    data.reviews.push(review);
    writeData(data);
    
    res.json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// User saved recipes endpoints
app.get('/api/user/saved', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Access denied' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const data = readData();
    const user = data.users.find(u => u._id === decoded.id);
    
    if (!user) return res.status(401).json({ success: false, error: 'Invalid token' });
    
    const savedRecipes = user.savedRecipes || [];
    res.json({ success: true, savedRecipes });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/user/recipes/save', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Access denied' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const data = readData();
    const userIndex = data.users.findIndex(u => u._id === decoded.id);
    
    if (userIndex === -1) return res.status(401).json({ success: false, error: 'Invalid token' });
    
    const { recipeId } = req.body;
    
    if (!data.users[userIndex].savedRecipes) {
      data.users[userIndex].savedRecipes = [];
    }
    
    if (!data.users[userIndex].savedRecipes.includes(recipeId)) {
      data.users[userIndex].savedRecipes.push(recipeId);
      writeData(data);
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/user/recipes/unsave', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Access denied' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const data = readData();
    const userIndex = data.users.findIndex(u => u._id === decoded.id);
    
    if (userIndex === -1) return res.status(401).json({ success: false, error: 'Invalid token' });
    
    const { recipeId } = req.body;
    
    if (data.users[userIndex].savedRecipes) {
      data.users[userIndex].savedRecipes = data.users[userIndex].savedRecipes.filter(id => id !== recipeId);
      writeData(data);
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// User profile route (requires authentication)
app.get('/api/users/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const data = readData();
    const user = data.users.find(u => u._id === decoded.id);
    
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

console.log('🚀 TasteTrail Backend started');
console.log('📁 Using file-based storage (data.json)');
console.log('🍽️  18 recipes loaded across all diet categories');

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📖 Recipes API: http://localhost:${PORT}/api/recipes`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/register`);
});
