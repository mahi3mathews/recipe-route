from service.recommendation_service import RecommendationService


class RecommendationServiceSingleton:
    __instance = None

    @staticmethod
    def get_instance():
        if RecommendationServiceSingleton.__instance is None:
            RecommendationServiceSingleton()
        return RecommendationServiceSingleton.__instance

    def __init__(self):
        if RecommendationServiceSingleton.__instance is not None:
            raise Exception("This class is a singleton! Use 'get_instance()' to get the instance.")
        RecommendationServiceSingleton.__instance = RecommendationService()
