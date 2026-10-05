import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const STORAGE_KEY = '@foodie/recipes-and-favorites';
const ACCENT = '#F16B45';
const CATEGORIES = [
  'All recipes',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Vegan',
  'Vegetarian',
  'Pasta',
  'Seafood',
  'Snacks',
  'My Food',
  'Favorites',
];

const STARTER_RECIPES = [
  {
    id: 'starter-avocado-toast',
    name: 'Avocado toast with poached egg',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1000',
    ingredients: ['2 slices sourdough bread', '1 ripe avocado', '2 eggs', '1 tsp lemon juice', 'Chili flakes, salt and pepper'],
    instructions: ['Toast the sourdough until golden.', 'Mash avocado with lemon juice, salt and pepper, then spread over the toast.', 'Poach the eggs and place one on each slice.', 'Finish with chili flakes and serve.'],
    prepTime: '15 min',
    servings: '2',
    calories: '320',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-pancakes',
    name: 'Fluffy blueberry pancakes',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=1000',
    ingredients: ['1 cup all-purpose flour', '1 tbsp sugar', '1 tsp baking powder', '¾ cup milk', '1 egg', '½ cup blueberries'],
    instructions: ['Whisk flour, sugar and baking powder in a bowl.', 'Add milk and egg; stir until just combined.', 'Fold in the blueberries.', 'Cook small portions on a warm, lightly oiled pan until bubbles form, then flip and cook until golden.'],
    prepTime: '20 min',
    servings: '3',
    calories: '280',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-chickpea-bowl',
    name: 'Roasted chickpea power bowl',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000',
    ingredients: ['1 can chickpeas, drained', '2 cups cooked quinoa', '1 cucumber, chopped', '1 cup cherry tomatoes', '2 tbsp olive oil', 'Lemon tahini dressing'],
    instructions: ['Toss chickpeas with olive oil, salt and paprika.', 'Roast at 220°C (425°F) for 20 minutes.', 'Divide quinoa, cucumber and tomatoes between bowls.', 'Top with crispy chickpeas and drizzle with tahini dressing.'],
    prepTime: '30 min',
    servings: '2',
    calories: '410',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-tacos',
    name: 'Smoky black bean tacos',
    category: 'Vegan',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=1000',
    ingredients: ['1 can black beans, rinsed', '6 corn tortillas', '1 tsp smoked paprika', '1 avocado', '½ red onion', 'Lime wedges'],
    instructions: ['Warm the beans with smoked paprika and a splash of water.', 'Heat tortillas in a dry skillet.', 'Fill each tortilla with beans, sliced avocado and red onion.', 'Serve with fresh lime.'],
    prepTime: '25 min',
    servings: '3',
    calories: '350',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-salmon',
    name: 'Lemon herb salmon',
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000',
    ingredients: ['2 salmon fillets', '1 lemon', '1 tbsp olive oil', '1 tbsp chopped dill', '2 cups green beans', 'Salt and pepper'],
    instructions: ['Heat the oven to 200°C (400°F).', 'Place salmon and green beans on a lined tray; season and drizzle with olive oil.', 'Bake for 12–15 minutes, until the salmon flakes easily.', 'Squeeze lemon over the fish and scatter with dill.'],
    prepTime: '25 min',
    servings: '2',
    calories: '390',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-pasta',
    name: 'Creamy tomato basil pasta',
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1000',
    ingredients: ['250 g pasta', '1 cup cherry tomatoes', '½ cup cream', '2 garlic cloves', '¼ cup grated parmesan', 'Fresh basil'],
    instructions: ['Cook pasta in salted water according to the packet.', 'Sauté garlic and tomatoes until the tomatoes soften.', 'Stir in cream and a splash of pasta water.', 'Toss with pasta, parmesan and fresh basil.'],
    prepTime: '25 min',
    servings: '2',
    calories: '480',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-soup',
    name: 'Cozy roasted tomato soup',
    category: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000',
    ingredients: ['700 g ripe tomatoes', '1 small onion', '3 garlic cloves', '2 cups vegetable stock', '1 tbsp olive oil', 'Fresh basil'],
    instructions: ['Halve the tomatoes and place on a tray with onion and garlic.', 'Drizzle with oil and roast at 220°C (425°F) for 25 minutes.', 'Blend with vegetable stock until smooth.', 'Warm gently, season to taste and serve with basil.'],
    prepTime: '40 min',
    servings: '4',
    calories: '190',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-curry',
    name: 'Coconut lentil curry',
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1000',
    ingredients: ['1 cup red lentils', '1 can coconut milk', '1 onion, diced', '2 tbsp curry paste', '2 cups vegetable stock', 'Fresh coriander'],
    instructions: ['Soften the onion in a large pot.', 'Stir in curry paste, lentils, coconut milk and stock.', 'Simmer for 20–25 minutes, stirring occasionally, until lentils are tender.', 'Season and serve with coriander and rice.'],
    prepTime: '35 min',
    servings: '4',
    calories: '430',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-brownies',
    name: 'One-bowl chocolate brownies',
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1000',
    ingredients: ['½ cup melted butter', '1 cup sugar', '2 eggs', '⅓ cup cocoa powder', '½ cup flour', '½ cup chocolate chips'],
    instructions: ['Heat the oven to 175°C (350°F) and line a small baking pan.', 'Whisk melted butter, sugar and eggs together.', 'Fold in cocoa, flour and chocolate chips.', 'Bake for 20–25 minutes. Cool before slicing.'],
    prepTime: '35 min',
    servings: '9',
    calories: '230',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-energy-bites',
    name: 'No-bake oat energy bites',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000',
    ingredients: ['1 cup rolled oats', '½ cup peanut butter', '¼ cup honey', '2 tbsp chia seeds', '¼ cup mini chocolate chips'],
    instructions: ['Mix all ingredients in a bowl until evenly combined.', 'Chill the mixture for 20 minutes.', 'Roll into bite-size balls.', 'Keep refrigerated in an airtight container.'],
    prepTime: '30 min',
    servings: '12 bites',
    calories: '110',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-greens',
    name: 'Green goddess salad',
    category: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000',
    ingredients: ['4 cups chopped greens', '1 cucumber', '1 avocado', '½ cup Greek yogurt', '1 lemon', 'Fresh herbs'],
    instructions: ['Blend yogurt, lemon juice, avocado and herbs into a smooth dressing.', 'Chop the cucumber and greens.', 'Toss vegetables with dressing just before serving.', 'Finish with cracked black pepper.'],
    prepTime: '15 min',
    servings: '2',
    calories: '260',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
  {
    id: 'starter-mushroom-pasta',
    name: 'Garlic mushroom pasta',
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1000',
    ingredients: ['250 g pasta', '250 g mushrooms, sliced', '3 garlic cloves', '2 tbsp olive oil', '½ cup parmesan', 'Parsley'],
    instructions: ['Cook pasta until al dente, reserving a cup of pasta water.', 'Sauté mushrooms until browned, then add garlic.', 'Add pasta, parmesan and a splash of pasta water.', 'Toss until glossy and finish with parsley.'],
    prepTime: '25 min',
    servings: '2',
    calories: '450',
    difficulty: 'Easy',
    isUserRecipe: false,
  },
];

const splitLines = (value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

function RecipeImage({ uri, style, fallback = '🍽️' }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return (
      <View style={[style, styles.imageFallback]}>
        <Text style={styles.imageFallbackEmoji}>{fallback}</Text>
      </View>
    );
  }
  return <Image source={{ uri }} style={style} onError={() => setFailed(true)} />;
}

function RecipeCard({ recipe, onPress, onFavorite, isFavorite, compact = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${recipe.name}`}
      onPress={onPress}
      style={[styles.recipeCard, compact && styles.compactCard]}
    >
      <View style={styles.cardImageWrap}>
        <RecipeImage uri={recipe.image} style={styles.cardImage} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          hitSlop={8}
          onPress={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          style={styles.cardHeart}
        >
          <Text style={[styles.heartText, isFavorite && styles.heartActive]}>{isFavorite ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.cardCategory}>{recipe.category.toUpperCase()}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{recipe.name}</Text>
        <Text style={styles.cardMeta}>◷  {recipe.prepTime}   ·   {recipe.difficulty}</Text>
      </View>
    </Pressable>
  );
}

function RecipeForm({ recipe, onCancel, onSave }) {
  const [name, setName] = useState(recipe ? recipe.name : '');
  const [category, setCategory] = useState(recipe ? recipe.category : 'Dinner');
  const [image, setImage] = useState(recipe ? recipe.image : '');
  const [ingredients, setIngredients] = useState(recipe ? recipe.ingredients.join('\n') : '');
  const [instructions, setInstructions] = useState(recipe ? recipe.instructions.join('\n') : '');
  const [prepTime, setPrepTime] = useState(recipe ? recipe.prepTime : '');
  const [servings, setServings] = useState(recipe ? recipe.servings : '');
  const [calories, setCalories] = useState(recipe ? recipe.calories : '');
  const [difficulty, setDifficulty] = useState(recipe ? recipe.difficulty : 'Easy');

  const chooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow photo library access to add a recipe image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) setImage(result.assets[0].uri);
  };

  const submit = () => {
    const ingredientList = splitLines(ingredients);
    const instructionList = splitLines(instructions);
    if (!name.trim() || ingredientList.length === 0 || instructionList.length === 0) {
      Alert.alert('A few details are missing', 'Please enter a recipe name, at least one ingredient, and at least one instruction.');
      return;
    }
    onSave({
      ...(recipe || {}),
      id: recipe ? recipe.id : `recipe-${Date.now()}`,
      name: name.trim(),
      category,
      image: image.trim(),
      ingredients: ingredientList,
      instructions: instructionList,
      prepTime: prepTime.trim() || '30 min',
      servings: servings.trim() || '2',
      calories: calories.trim() || '—',
      difficulty,
      isUserRecipe: true,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formHeader}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onCancel} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.formHeading}>{recipe ? 'Edit recipe' : 'Add a recipe'}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.formIntro}>Share something delicious with your recipe box.</Text>

        <Text style={styles.inputLabel}>RECIPE NAME *</Text>
        <TextInput value={name} onChangeText={setName} placeholder="e.g. Sunday lemon cake" placeholderTextColor="#A5A29D" style={styles.input} />

        <Text style={styles.inputLabel}>RECIPE PHOTO</Text>
        {image ? <RecipeImage uri={image} style={styles.formImage} /> : null}
        <Pressable onPress={chooseImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>＋  {image ? 'Choose a different photo' : 'Upload a photo'}</Text>
        </Pressable>
        <Text style={styles.helperText}>Choose an image from your photo library. You can also paste an image URL below.</Text>
        <TextInput value={image} onChangeText={setImage} placeholder="Image URL (optional)" placeholderTextColor="#A5A29D" autoCapitalize="none" style={styles.input} />

        <Text style={styles.inputLabel}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.formChips}>
          {CATEGORIES.slice(1, 10).map((item) => (
            <Pressable key={item} onPress={() => setCategory(item)} style={[styles.formChip, category === item && styles.formChipSelected]}>
              <Text style={[styles.formChipText, category === item && styles.formChipTextSelected]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.inputLabel}>INGREDIENTS * <Text style={styles.labelHint}>(one per line)</Text></Text>
        <TextInput
          value={ingredients}
          onChangeText={setIngredients}
          placeholder={'2 cups flour\n1 cup milk\n2 eggs'}
          placeholderTextColor="#A5A29D"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.multilineInput]}
        />

        <Text style={styles.inputLabel}>STEP-BY-STEP INSTRUCTIONS * <Text style={styles.labelHint}>(one step per line)</Text></Text>
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder={'Preheat the oven.\nMix the dry ingredients.\nBake until golden.'}
          placeholderTextColor="#A5A29D"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.multilineInput, styles.instructionsInput]}
        />

        <Text style={styles.inputLabel}>RECIPE DETAILS</Text>
        <View style={styles.detailsInputRow}>
          <TextInput value={prepTime} onChangeText={setPrepTime} placeholder="Prep time (e.g. 30 min)" placeholderTextColor="#A5A29D" style={[styles.input, styles.halfInput]} />
          <TextInput value={servings} onChangeText={setServings} placeholder="Servings" placeholderTextColor="#A5A29D" style={[styles.input, styles.halfInput]} />
        </View>
        <View style={styles.detailsInputRow}>
          <TextInput value={calories} onChangeText={setCalories} placeholder="Calories" placeholderTextColor="#A5A29D" keyboardType="numeric" style={[styles.input, styles.halfInput]} />
          <Pressable onPress={() => setDifficulty(difficulty === 'Easy' ? 'Medium' : difficulty === 'Medium' ? 'Hard' : 'Easy')} style={[styles.input, styles.halfInput, styles.difficultyInput]}>
            <Text style={styles.difficultyText}>Difficulty: {difficulty}  ↻</Text>
          </Pressable>
        </View>

        <Pressable onPress={submit} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{recipe ? 'Save Changes' : 'Save Recipe'}</Text>
        </Pressable>
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(STARTER_RECIPES);
  const [favorites, setFavorites] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [category, setCategory] = useState('All recipes');
  const [query, setQuery] = useState('');
  const [screen, setScreen] = useState('feed');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.recipes)) setRecipes([...STARTER_RECIPES, ...parsed.recipes.filter((item) => item.isUserRecipe)]);
          if (Array.isArray(parsed.favorites)) setFavorites(parsed.favorites);
        }
      } catch (error) {
        console.error('Unable to load saved Foodie recipes:', error);
        Alert.alert('Could not load saved recipes', 'Your built-in recipes are still available. Check device storage and try again.');
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      recipes: recipes.filter((item) => item.isUserRecipe),
      favorites,
    })).catch((error) => {
      console.error('Unable to save Foodie recipes:', error);
      Alert.alert('Could not save changes', 'Please check device storage and try again.');
    });
  }, [recipes, favorites, hydrated]);

  const userRecipes = useMemo(() => recipes.filter((recipe) => recipe.isUserRecipe), [recipes]);
  const visibleRecipes = useMemo(() => {
    let result = recipes;
    if (category === 'My Food') result = userRecipes;
    else if (category === 'Favorites') result = recipes.filter((recipe) => favorites.includes(recipe.id));
    else if (category !== 'All recipes') result = recipes.filter((recipe) => recipe.category === category);
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) result = result.filter((recipe) => recipe.name.toLowerCase().includes(normalizedQuery));
    return result;
  }, [category, favorites, query, recipes, userRecipes]);

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const goBack = () => {
    if (screen === 'detail') {
      setScreen('feed');
      setSelectedRecipe(null);
    } else if (screen === 'form') {
      setScreen('feed');
      setEditingRecipe(null);
    } else if (category !== 'All recipes') {
      setCategory('All recipes');
    }
  };

  const openRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setScreen('detail');
  };

  const startNewRecipe = () => {
    setEditingRecipe(null);
    setScreen('form');
  };

  const saveRecipe = (recipe) => {
    setRecipes((current) => editingRecipe
      ? current.map((item) => item.id === recipe.id ? recipe : item)
      : [recipe, ...current]);
    setCategory('My Food');
    setEditingRecipe(null);
    setScreen('feed');
    Alert.alert('Recipe saved', `${recipe.name} is now in My Recipes.`);
  };

  const editRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setScreen('form');
  };

  const deleteRecipe = (recipe) => {
    Alert.alert('Delete recipe?', `“${recipe.name}” will be removed from My Recipes.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setRecipes((current) => current.filter((item) => item.id !== recipe.id));
          setFavorites((current) => current.filter((item) => item !== recipe.id));
          if (selectedRecipe && selectedRecipe.id === recipe.id) {
            setSelectedRecipe(null);
            setScreen('feed');
          }
        },
      },
    ]);
  };

  if (screen === 'form') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF9" />
        <RecipeForm recipe={editingRecipe} onCancel={goBack} onSave={saveRecipe} />
      </SafeAreaView>
    );
  }

  if (screen === 'detail' && selectedRecipe) {
    const recipe = recipes.find((item) => item.id === selectedRecipe.id) || selectedRecipe;
    const isFavorite = favorites.includes(recipe.id);
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF9" />
        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.detailHero}>
            <RecipeImage uri={recipe.image} style={styles.detailImage} />
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={styles.detailBack}>
              <Text style={styles.detailBackText}>‹</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'} onPress={() => toggleFavorite(recipe.id)} style={styles.detailHeart}>
              <Text style={[styles.detailHeartText, isFavorite && styles.heartActive]}>{isFavorite ? '♥' : '♡'}</Text>
            </Pressable>
          </View>
          <View style={styles.detailBody}>
            <Text style={styles.detailCategory}>{recipe.category.toUpperCase()}</Text>
            <Text style={styles.detailTitle}>{recipe.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}><Text style={styles.statValue}>◷ {recipe.prepTime}</Text><Text style={styles.statLabel}>PREP TIME</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>♧ {recipe.servings}</Text><Text style={styles.statLabel}>SERVINGS</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>♨ {recipe.calories}</Text><Text style={styles.statLabel}>CALORIES</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>✦ {recipe.difficulty}</Text><Text style={styles.statLabel}>DIFFICULTY</Text></View>
            </View>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((item, index) => (
              <View key={`${recipe.id}-ingredient-${index}`} style={styles.listRow}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
            <Text style={[styles.sectionTitle, styles.instructionsHeading]}>Instructions</Text>
            {recipe.instructions.map((step, index) => (
              <View key={`${recipe.id}-step-${index}`} style={styles.stepRow}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
            {recipe.isUserRecipe ? (
              <View style={styles.managementRow}>
                <Pressable onPress={() => editRecipe(recipe)} style={styles.editButton}><Text style={styles.editButtonText}>Edit Recipe</Text></Pressable>
                <Pressable onPress={() => deleteRecipe(recipe)} style={styles.deleteButton}><Text style={styles.deleteButtonText}>Delete</Text></Pressable>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const sectionHeading = category === 'Favorites' ? 'Your favorites' : category === 'My Food' ? 'My Recipes' : category === 'All recipes' ? 'Popular this week' : `${category} recipes`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF9" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.feedContent}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}><Text style={styles.brandMark}>●</Text> foodie</Text>
            <Text style={styles.greeting}>GOOD FOOD, GOOD MOOD</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>f</Text></View>
        </View>
        <Text style={styles.welcomeTitle}>What are you{'\n'}cooking today?</Text>
        <Text style={styles.welcomeSubtitle}>Find a little inspiration for your next meal.</Text>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search recipes"
            placeholderTextColor="#A5A29D"
            returnKeyType="search"
            style={styles.searchInput}
          />
          {query ? <Pressable onPress={() => setQuery('')}><Text style={styles.clearSearch}>×</Text></Pressable> : null}
        </View>

        <View style={styles.categoryHeadingRow}>
          <Text style={styles.categoryHeading}>Explore categories</Text>
          <Text style={styles.categoryCount}>12</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroller}>
          {CATEGORIES.map((item) => (
            <Pressable key={item} onPress={() => setCategory(item)} style={[styles.categoryChip, category === item && styles.categoryChipSelected]}>
              <Text style={[styles.categoryChipText, category === item && styles.categoryChipTextSelected]}>
                {item === 'My Food' ? '＋ My Food' : item === 'Favorites' ? '♥ Favorites' : item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{sectionHeading}</Text>
            <Text style={styles.resultCount}>{visibleRecipes.length} {visibleRecipes.length === 1 ? 'recipe' : 'recipes'} to try</Text>
          </View>
          {category === 'My Food' ? (
            <Pressable onPress={startNewRecipe} style={styles.addSmallButton}>
              <Text style={styles.addSmallText}>＋ Add new</Text>
            </Pressable>
          ) : null}
        </View>

        {category === 'My Food' ? (
          <Pressable onPress={startNewRecipe} style={styles.addRecipeCard}>
            <View style={styles.addRecipeIcon}><Text style={styles.addRecipeIconText}>＋</Text></View>
            <View style={styles.addRecipeCopy}>
              <Text style={styles.addRecipeTitle}>Add New Recipe</Text>
              <Text style={styles.addRecipeSubtitle}>Save a favorite from your own kitchen</Text>
            </View>
            <Text style={styles.addRecipeArrow}>›</Text>
          </Pressable>
        ) : null}

        {visibleRecipes.length > 0 ? (
          <View style={styles.recipeGrid}>
            {visibleRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.id)}
                onFavorite={() => toggleFavorite(recipe.id)}
                onPress={() => openRecipe(recipe)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{category === 'Favorites' ? '♡' : category === 'My Food' ? '🍲' : '🔎'}</Text>
            <Text style={styles.emptyTitle}>{category === 'Favorites' ? 'No favorites yet' : category === 'My Food' ? 'Your recipe box is empty' : 'No recipes found'}</Text>
            <Text style={styles.emptyBody}>{category === 'Favorites' ? 'Tap the heart on any recipe to save it here.' : category === 'My Food' ? 'Add your first recipe and keep it close at hand.' : 'Try another search or choose a different category.'}</Text>
            {category === 'My Food' ? <Pressable onPress={startNewRecipe} style={styles.emptyAddButton}><Text style={styles.emptyAddText}>＋ Add New Recipe</Text></Pressable> : null}
          </View>
        )}
        <Text style={styles.footerNote}>Made with a little extra love. ♡</Text>
      </ScrollView>
      {!hydrated ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color={ACCENT} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#FFFDF9' },
  feedContent: { paddingBottom: 30 },
  topBar: { paddingHorizontal: 22, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: '#272723', fontSize: 23, fontWeight: '800', letterSpacing: -0.8 },
  brandMark: { color: ACCENT, fontSize: 13 },
  greeting: { marginTop: 3, color: '#A29E96', fontSize: 9, fontWeight: '700', letterSpacing: 1.6 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8E7DC', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: ACCENT, fontWeight: '800', fontSize: 19 },
  welcomeTitle: { marginTop: 27, marginHorizontal: 22, color: '#24231F', fontWeight: '800', fontSize: 32, letterSpacing: -1.1, lineHeight: 37 },
  welcomeSubtitle: { marginHorizontal: 22, marginTop: 8, color: '#89867F', fontSize: 13 },
  searchBar: { marginHorizontal: 22, marginTop: 22, height: 48, borderRadius: 14, backgroundColor: '#F5F2EC', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  searchIcon: { color: '#8E8980', fontSize: 24, marginRight: 9, marginTop: -4 },
  searchInput: { flex: 1, color: '#272723', fontSize: 14, paddingVertical: 0 },
  clearSearch: { fontSize: 23, color: '#88837B', paddingHorizontal: 3 },
  categoryHeadingRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, marginTop: 25, marginBottom: 12 },
  categoryHeading: { fontSize: 15, color: '#302E29', fontWeight: '700' },
  categoryCount: { marginLeft: 8, color: ACCENT, fontWeight: '700', fontSize: 11, backgroundColor: '#FCE9E1', overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  categoryScroller: { paddingHorizontal: 22, paddingBottom: 2 },
  categoryChip: { paddingVertical: 9, paddingHorizontal: 14, marginRight: 8, borderRadius: 20, backgroundColor: '#F4F1EB', borderWidth: 1, borderColor: '#F4F1EB' },
  categoryChipSelected: { backgroundColor: ACCENT, borderColor: ACCENT },
  categoryChipText: { color: '#77736D', fontSize: 12, fontWeight: '600' },
  categoryChipTextSelected: { color: '#FFFFFF' },
  sectionHeader: { marginHorizontal: 22, marginTop: 25, marginBottom: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#292823', fontSize: 19, fontWeight: '800', letterSpacing: -0.35 },
  resultCount: { color: '#9B978F', fontSize: 11, marginTop: 3 },
  addSmallButton: { backgroundColor: '#FCE9E1', paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12 },
  addSmallText: { color: ACCENT, fontWeight: '700', fontSize: 12 },
  recipeGrid: { paddingHorizontal: 18, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recipeCard: { width: '48.3%', borderRadius: 16, backgroundColor: '#FFFFFF', marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#F1EEE8' },
  compactCard: { width: '48%' },
  cardImageWrap: { width: '100%', height: 130, backgroundColor: '#EEE8DE' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardHeart: { position: 'absolute', top: 9, right: 9, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  heartText: { color: '#645F58', fontSize: 22, lineHeight: 25 },
  heartActive: { color: ACCENT },
  cardCopy: { paddingHorizontal: 11, paddingTop: 10, paddingBottom: 12 },
  cardCategory: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: ACCENT, marginBottom: 5 },
  cardTitle: { color: '#2D2B26', fontSize: 13, lineHeight: 17, fontWeight: '700', minHeight: 34 },
  cardMeta: { color: '#99948B', marginTop: 8, fontSize: 10 },
  imageFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0E6D9' },
  imageFallbackEmoji: { fontSize: 36 },
  addRecipeCard: { marginHorizontal: 22, marginBottom: 15, padding: 14, borderRadius: 16, backgroundColor: '#FFF3ED', borderWidth: 1, borderColor: '#F9E2D7', flexDirection: 'row', alignItems: 'center' },
  addRecipeIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  addRecipeIconText: { color: ACCENT, fontSize: 24, lineHeight: 27 },
  addRecipeCopy: { flex: 1, marginLeft: 12 },
  addRecipeTitle: { color: '#37322D', fontWeight: '700', fontSize: 14 },
  addRecipeSubtitle: { marginTop: 3, color: '#968B83', fontSize: 10 },
  addRecipeArrow: { color: ACCENT, fontSize: 27 },
  emptyState: { marginHorizontal: 22, marginTop: 12, paddingVertical: 42, paddingHorizontal: 24, alignItems: 'center', backgroundColor: '#F8F5EF', borderRadius: 18 },
  emptyEmoji: { fontSize: 34, color: ACCENT },
  emptyTitle: { marginTop: 12, fontSize: 17, fontWeight: '700', color: '#37342F' },
  emptyBody: { marginTop: 6, textAlign: 'center', color: '#8E8980', fontSize: 12, lineHeight: 18 },
  emptyAddButton: { marginTop: 17, backgroundColor: ACCENT, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 16 },
  emptyAddText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  footerNote: { marginTop: 15, color: '#B2ADA4', fontSize: 10, textAlign: 'center' },
  detailContent: { paddingBottom: 34 },
  detailHero: { height: 275, backgroundColor: '#EEE8DE' },
  detailImage: { height: '100%', width: '100%', resizeMode: 'cover' },
  detailBack: { position: 'absolute', top: 14, left: 18, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  detailBackText: { color: '#2E2B26', fontSize: 33, lineHeight: 37, marginTop: -5 },
  detailHeart: { position: 'absolute', top: 14, right: 18, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  detailHeartText: { color: '#645F58', fontSize: 25, lineHeight: 28 },
  detailBody: { paddingHorizontal: 22, paddingTop: 21 },
  detailCategory: { color: ACCENT, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  detailTitle: { marginTop: 6, color: '#292823', fontSize: 27, lineHeight: 32, fontWeight: '800', letterSpacing: -0.6 },
  statsRow: { marginTop: 18, paddingVertical: 13, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EEEAE3', flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: '#3E3B35', fontSize: 11, fontWeight: '700' },
  statLabel: { color: '#A09A91', fontSize: 7, fontWeight: '800', letterSpacing: 0.65, marginTop: 5 },
  sectionTitle: { color: '#292823', fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  instructionsHeading: { marginTop: 24, marginBottom: 13 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, paddingRight: 5 },
  bullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: ACCENT, marginTop: 6, marginRight: 11 },
  listText: { flex: 1, color: '#615D56', fontSize: 13, lineHeight: 19 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  stepNumber: { width: 25, height: 25, borderRadius: 13, backgroundColor: '#FCE9E1', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  stepNumberText: { color: ACCENT, fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1, color: '#615D56', fontSize: 13, lineHeight: 19, paddingTop: 2 },
  managementRow: { flexDirection: 'row', marginTop: 13 },
  editButton: { flex: 1, alignItems: 'center', backgroundColor: ACCENT, paddingVertical: 13, borderRadius: 12, marginRight: 8 },
  editButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  deleteButton: { alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#E8D7CE', paddingHorizontal: 18 },
  deleteButtonText: { color: '#AD5340', fontSize: 13, fontWeight: '700' },
  formContent: { paddingHorizontal: 22, paddingBottom: 32 },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 },
  backButton: { height: 40, width: 40, borderRadius: 20, backgroundColor: '#F4F1EB', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#2E2B26', fontSize: 32, lineHeight: 36, marginTop: -5 },
  formHeading: { color: '#292823', fontSize: 19, fontWeight: '800' },
  headerSpacer: { width: 40 },
  formIntro: { color: '#8E8980', fontSize: 12, marginTop: 5, marginBottom: 23 },
  inputLabel: { color: '#666158', fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8, marginTop: 15 },
  labelHint: { color: '#A29D94', fontWeight: '500', letterSpacing: 0, fontSize: 9 },
  input: { minHeight: 46, borderWidth: 1, borderColor: '#EBE6DE', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11, backgroundColor: '#FFFFFF', fontSize: 13, color: '#302D28' },
  multilineInput: { minHeight: 115, lineHeight: 20 },
  instructionsInput: { minHeight: 145 },
  formImage: { height: 160, width: '100%', borderRadius: 13, marginBottom: 9 },
  uploadButton: { minHeight: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#F4C9B9', backgroundColor: '#FFF7F3' },
  uploadButtonText: { color: ACCENT, fontSize: 13, fontWeight: '700' },
  helperText: { color: '#A09A91', fontSize: 10, marginTop: 6 },
  formChips: { paddingVertical: 2 },
  formChip: { marginRight: 7, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F4F1EB' },
  formChipSelected: { backgroundColor: ACCENT },
  formChipText: { color: '#77736D', fontSize: 11, fontWeight: '600' },
  formChipTextSelected: { color: '#FFFFFF' },
  halfInput: { flex: 1 },
  detailsInputRow: { flexDirection: 'row', marginTop: 8 },
  difficultyInput: { marginLeft: 8, justifyContent: 'center', paddingVertical: 0 },
  difficultyText: { color: '#625E57', fontSize: 12 },
  saveButton: { marginTop: 24, backgroundColor: ACCENT, minHeight: 49, alignItems: 'center', justifyContent: 'center', borderRadius: 13 },
  saveButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  cancelButton: { padding: 13, alignItems: 'center' },
  cancelButtonText: { color: '#8A857C', fontWeight: '600', fontSize: 12 },
  loadingOverlay: { position: 'absolute', top: 8, right: 10, padding: 5 },
});
