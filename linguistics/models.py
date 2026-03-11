from django.db import models
from django.contrib.auth.models import User

class Word(models.Model):
    CATEGORY_CHOICES = [
        ('nom', 'Nom'),
        ('verbe', 'Verbe'),
        ('adj', 'Adjectif'),
        ('adv', 'Adverbe'),
        ('pron', 'Pronom'),
        ('prep', 'Préposition'),
        ('conj', 'Conjonction'),
        ('interj', 'Interjection'),
    ]
    
    term_shikomori = models.CharField(max_length=255, unique=True)
    pos = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Partie du discours")
    phonetics = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.term_shikomori

class Translation(models.Model):
    DIALECT_CHOICES = [
        ('grand_comore', 'Shingazidja (Grande Comore)'),
        ('anjouan', 'Shindzuani (Anjouan)'),
        ('moheli', 'Shimwali (Mohéli)'),
        ('mayotte', 'Shimaore (Mayotte)'),
        ('standard', 'Standard'),
    ]
    
    word = models.ForeignKey(Word, related_name='translations', on_delete=models.CASCADE)
    meaning_fr = models.TextField()
    dialect = models.CharField(max_length=50, choices=DIALECT_CHOICES, default='standard')

    def __str__(self):
        return f"{self.meaning_fr} ({self.dialect})"

class Example(models.Model):
    word = models.ForeignKey(Word, related_name='examples', on_delete=models.CASCADE)
    sentence_shikomori = models.TextField()
    sentence_fr = models.TextField()

    def __str__(self):
        return f"Exemple for {self.word.term_shikomori}"

class Contribution(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    proposed_term = models.CharField(max_length=255)
    proposed_translation = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contribution: {self.proposed_term}"
