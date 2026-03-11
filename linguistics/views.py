from rest_framework import viewsets, filters
from .models import Word, Contribution
from .serializers import WordSerializer, ContributionSerializer

class WordViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Word.objects.all().prefetch_related('translations', 'examples')
    serializer_class = WordSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['term_shikomori', 'translations__meaning_fr']

class ContributionViewSet(viewsets.ModelViewSet):
    queryset = Contribution.objects.all()
    serializer_class = ContributionSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
