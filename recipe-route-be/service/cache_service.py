from repo.cache_repository import CacheRepository


class CacheService:
    def __init__(self):
        self.__repo = CacheRepository()

    def get_cache(self, key):
        cached_data = self.__repo.get_cache(key)
        return cached_data

    def set_cache(self, key, data):
        self.__repo.set_cache(key, data)
        pass

    def update_cache(self, key, data):
        self.__repo.update_cache(key, data)
        pass




