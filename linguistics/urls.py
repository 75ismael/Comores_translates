from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WordViewSet, ContributionViewSet

router = DefaultRouter()
router.register(r'words', WordViewSet)
router.register(r'contributions', ContributionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
