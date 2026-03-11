from django.shortcuts import render
from .models import Article

def article_list(request):
    articles = Article.objects.order_by('-pub_date')
    return render(request, 'news/list.html', {'articles': articles})
