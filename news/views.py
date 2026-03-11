from django.shortcuts import render
from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

def article_list(request):
    articles = Article.objects.order_by('-pub_date')
    return render(request, 'news/list.html', {'articles': articles})

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all().order_by('-pub_date')
    serializer_class = ArticleSerializer
