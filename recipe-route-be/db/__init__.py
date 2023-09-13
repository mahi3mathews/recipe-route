from pathlib import Path
import os
from pymongo import MongoClient
from dotenv import load_dotenv


env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

username1 = os.getenv("DB_USERNAME")
password2 = os.getenv("DB_PWD")
cluster3 = os.getenv("DB_CLUSTER")
username = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PWD")
cluster = os.environ.get("DB_CLUSTER")
client = MongoClient(f"mongodb+srv://{username}:{password}@{cluster}")
db = client["recipe-route"]
user_collection = db["users"]
meal_plans_collection = db['meal-plans']
stores_collection = db["stores"]
ingredients_collection = db["ingredients"]
recipes_collection = db["recipes"]
cache_collection = db["cache"]
cart_collection = db["cart"]
store_inventory_collection = db["store-inventory"]
order_collection = db["orders"]
