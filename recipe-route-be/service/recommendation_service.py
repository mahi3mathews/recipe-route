import pandas as pd
import re
from fractions import Fraction
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from flask_pymongo import ObjectId

from service.recipe_service import RecipeService
from service.user_service import UserService
from service.cache_service import CacheService
from service.ingredient_service import IngredientService
from schemas.users import users_preferences_entity, user_preferences_entity
from schemas.recipes import recipe_list_entity
from enums.record_count import RecordCount


class RecommendationService:
    def __init__(self, cache_service=None, recipe_service=None, ingredient_service=None, is_service_provided=False,
                 user_service=None):
        self.__cache = CacheService()
        self.__recipe_service = RecipeService()
        self.__ingredient_service = IngredientService()
        self.__df = None
        self.__all_records = []
        self.__user_service = UserService()
        self.__stop_words = None

        if is_service_provided:
            self.__cache = cache_service
            self.__recipe_service = recipe_service
            self.__ingredient_service = ingredient_service
            self.__user_service = user_service
        self.__load_df()

    def __setup_df(self):
        self.__all_records = self.__recipe_service.get_all_recipes(True)
        self.__df = pd.DataFrame(self.__all_records)
        self.__df.isnull().sum()
        self.__df.dropna(inplace=True)

        selected_features = ["title", "ingredients", "directions", "_id", "desc", "categories", "calories"]
        if "formatted_ingredients" in self.__df.columns:
            selected_features.append("formatted_ingredients")
        if "all_ingredients" in self.__df.columns:
            selected_features.append("all_ingredients")
        self.__df = self.__df[selected_features]

    def __load_df(self):
        if self.__df is None:
            self.__setup_df()
            if not self.__cache.get_cache('is_preprocessed'):
                self.__preprocess_model()
                self.__cache.update_cache('is_preprocessed', True)
                pass
        pass

    def __convert_ingredients(self, data):
        measurement_terms = [
            "sprigs", "cups", "cup", "cloves", "teaspoon", "teaspoons", "tsp",
            "tablespoon", "tablespoons", "tbsp", "ribs", "pound", "pounds",
            "piece", "pieces", "ounce", "pinch", "lb", "clove", "stick", "ounces", "heads", "head"
        ]
        converted_data = []
        ingredients = data
        ingredients_str = ''

        for ingredient in ingredients:

            ingredient_obj = {"ingredient": "", "qty": "", "measurement": ""}
            # Check if the ingredient is not equipment, garnish, or accompaniment
            if "equipment" not in ingredient.lower() and "garnish" not in ingredient.lower() \
                    and "accompaniment" not in ingredient.lower() and "water" not in ingredient.lower() \
                    and "ice" not in ingredient.lower() and "Available at Asian markets" not in ingredient.lower() and \
                    "optional" not in ingredient.lower() and "Optional" not in ingredient.lower():
                # Extract quantity and measurement
                amount_match = re.match(r"((\d+\s+)?\d+\s+\d+/\d+|\d+/\d+|\d+)", ingredient)
                measurement_match = re.search(r"\b(" + "|".join(measurement_terms) + r")\b", ingredient)

                if amount_match:
                    qty = amount_match.group(0)
                    # Convert fraction to float
                    if "/" in qty:
                        qty = str(round(float(sum(Fraction(s) for s in qty.split())), 2)).rstrip("0").rstrip(".")
                    ingredient_obj["qty"] = qty.strip()

                if measurement_match:
                    measurement = measurement_match.group(0)
                    ingredient_obj["measurement"] = measurement.strip()

                # Extract ingredient name
                ingredient_name = re.sub(r"(\d+(\s+\d+\/\d+)?)\s*(\b(" + "|".join(measurement_terms) + r")\b)?", "",
                                         ingredient).strip().lstrip("/")
                ingredient_obj["ingredient"] = ingredient_name
                ingredient_obj["id"] = self.__ingredient_service.get_ingredient_id(ingredient_name)
                ingredients_str = ingredients_str + " " + ingredient_name
                converted_data.append(ingredient_obj)
        return converted_data, ingredients_str

    def __remove_stopwords(self, stop_text):
        return ' '.join([word for word in stop_text.split() if word.lower() not in self.__stop_words])

    def __preprocess_model(self):
        self.__setup_df()
        # Handle missing values in specific columns
        self.__df['directions'] = self.__df['directions'].fillna('')
        self.__df['ingredients'] = self.__df['ingredients'].fillna('')
        self.__df["title"] = self.__df["title"].fillna('')

        # self.__df['title'] = self.__df['title'].str.lower()
        # self.__df['ingredients'] = self.__df['ingredients'].str.lower()
        # self.__df['directions'] = self.__df['directions'].str.lower()

        # Remove punctuation
        self.__df['title'] = self.__df['title'].str.translate(str.maketrans('', '', string.punctuation))
        self.__df['ingredients'] = self.__df['ingredients'].apply(
            lambda x: [s.translate(str.maketrans('', '', string.punctuation.replace('/', ''))) for s in
                       x] if isinstance(x, list) else x)
        self.__df['directions'] = self.__df['directions'].apply(
            lambda x: [s.translate(str.maketrans('', '', string.punctuation.replace('/', ''))) for s in
                       x] if isinstance(x, list) else x)

        # Remove stop words
        self.__stop_words = set(stopwords.words('english'))
        self.__df['title'] = self.__df['title'].apply(
            lambda x: ' '.join([word for word in word_tokenize(x) if word not in self.__stop_words]))
        self.__df['ingredients'] = self.__df['ingredients'].apply(
            lambda x: [self.__remove_stopwords(s) for s in x] if isinstance(x, list) else x)
        self.__df['directions'] = self.__df['directions'].apply(
            lambda x: [self.__remove_stopwords(s) for s in x] if isinstance(x, list) else x)

        if 'formatted_ingredients' not in self.__df.columns:
            self.__df["formatted_ingredients"], self.__df["all_ingredients"] = zip(
                *self.__df["ingredients"].apply(self.__convert_ingredients))
            data_list = self.__df.to_dict(orient="records")
            self.__recipe_service.update_all_recipes(data_list)
        pass

    @staticmethod
    def __is_allergen_np_in_ingredients(ingredients, allergens_np):
        ingredient_ids = [ingredient["id"] for ingredient in ingredients]
        is_allergen = [allergen in ingredient_ids for allergen in allergens_np]
        return True in is_allergen

    # Content-Based Filtering
    def __content_based_filtering(self, user):
        # Remove recipes with allergens and not preferred ingredients

        filtered_df = self.__df[
            ~self.__df['formatted_ingredients'].apply(self.__is_allergen_np_in_ingredients,
                                                      allergens_np=user["allergens_and_not_preferred"])]
        # Calculate content-based similarity score
        tfidf = TfidfVectorizer()
        recipe_profiles = tfidf.fit_transform(filtered_df['all_ingredients'])

        # Create a user profile based on their favorite recipes
        favorite_ids = [ObjectId(fav_id) for fav_id in user["favorites"]]
        print(favorite_ids, 'FAV IDS')
        print(filtered_df['_id'].values, 'f_df')
        user_favorites = filtered_df[filtered_df["_id"].isin(favorite_ids)]
        user_profile = user_favorites['all_ingredients'].str.cat(sep=' ')

        # Calculate cosine similarity between user profile and recipe profiles
        user_profile_vec = tfidf.transform([user_profile])
        similarity_scores = cosine_similarity(recipe_profiles, user_profile_vec)
        # Rank recipes based on similarity scores
        filtered_df.loc[:, 'similarity_score'] = similarity_scores.flatten()
        filtered_df = filtered_df.sort_values(by='similarity_score', ascending=False)

        return filtered_df

    # Collaborative Filtering
    def __collaborative_filtering(self, other_users, user):
        # Filter user preferences to exclude the current user
        other_users_preferences = [prefs for prefs in other_users if prefs['id'] != user['id']]

        # Find users with similar preferences
        similar_users = []
        for prefs in other_users_preferences:
            common_favorites = set(user['favorites']).intersection(prefs['favorites'])
            common_not_preferred = set(user['allergens_and_not_preferred']).intersection(
                prefs['allergens_and_not_preferred'])
            if len(common_favorites) > 0 or len(common_not_preferred) > 0:
                similarity = len(common_favorites) - len(common_not_preferred)
                similar_users.append((prefs['id'], similarity))

        # Sort similar users based on similarity score
        similar_users = sorted(similar_users, key=lambda x: x[1], reverse=True)

        # Generate collaborative filtering recommendation list
        recommendation_list = []
        for user_id, similarity in similar_users:
            for prefs in other_users:
                if prefs['id'] == user_id:
                    pref_obj_ids = [ObjectId(str_id) for str_id in prefs['favorites']]
                    user_recipes = self.__df.loc[self.__df['_id'].isin(pref_obj_ids)]
                    new_recipes = [str(recipe) for recipe in user_recipes['_id'].tolist() if
                                   recipe not in recommendation_list]
                    recommendation_list.extend(new_recipes)
                    break
        return recommendation_list

    @staticmethod
    def __get_index_by_recipe_id(recipe_id, content_based):
        condition = content_based['_id'] == ObjectId(recipe_id)
        index = content_based[condition].index
        if not index.empty:
            return index.item()
        else:
            print("No rows found with the specified condition.")
        # index = content_based.loc[str(content_based['_id']) is str(recipe_id)].index
        # return index

    def __recommendation_system(self, other_users, user):
        # Content-based filtering
        content_based_results = self.__content_based_filtering(user)

        # Collaborative filtering
        collaborative_results = self.__collaborative_filtering(other_users, user)
        recommendation_list = \
            [str(recipe_id) for recipe_id in content_based_results["_id"].tolist()] + collaborative_results
        recommendation_list = list(recommendation_list)

        content_based_ids = [str(r_id) for r_id in content_based_results["_id"].tolist()]
        # Sort recipes based on the final scores
        final_scores = []
        filtered_recommendation_list = []  # New list to store the filtered recommendation indices
        for recipe_id in recommendation_list:
            if recipe_id in content_based_ids and ObjectId(recipe_id) not in filtered_recommendation_list:
                recipe_index = self.__get_index_by_recipe_id(recipe_id, content_based_results)
                content_score = content_based_results.loc[recipe_index, 'similarity_score']
                final_scores.append(content_score)
                filtered_recommendation_list.append(ObjectId(recipe_id))  # Add the recipe index to the filtered list

        recommendation_df = self.__df.loc[self.__df['_id'].isin(filtered_recommendation_list)]
        recommendation_df['final_score'] = final_scores
        recommendation_df = recommendation_df.sort_values(by='final_score', ascending=False)
        return recommendation_df

    def get_user_recommendations(self, user_id, page_no):
        response = {}
        current_user = user_preferences_entity(self.__user_service.get_user_details(user_id, is_raw_data=True))
        all_users = users_preferences_entity(self.__user_service.get_all_users())
        recommendation_list = self.__recommendation_system(all_users, current_user)
        list_records = recipe_list_entity(recommendation_list.to_dict(orient="records"))

        if not page_no:
            page_number = 1
        else:
            page_number = int(page_no)

        record_count = RecordCount.RECIPES.value
        start_index = (page_number - 1) * record_count
        end_index = start_index + record_count
        response.update({"data": list_records[start_index:end_index], "total_records": len(list_records)})

        if len(list_records) <= 0:
            response.update({
                "message": 'Something went wrong. Try again after sometime.',
                "status": 'fail'
            })
            code = 404
        else:
            response.update({
                "message": 'Successfully fetched personalized recipes',
                "status": 'success'
            })
            code = 200

        return {"response": response, "code": code}
