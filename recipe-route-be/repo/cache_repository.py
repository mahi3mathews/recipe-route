from db import cache_collection


class CacheRepository:
    def __init__(self):
        self.cache = cache_collection

    def get_cache(self, key):
        cache_data = self.cache.find_one({"key": key})
        if cache_data:
            return cache_data["value"]
        else:
            return None

    def set_cache(self, key, value):
        self.cache.insert_one({"key": key, "value": value})

    def update_cache(self, key, value):
        self.cache.update_one({"key": key}, {"$set": {"value": value}})



