from django.db import models

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=50, choices=[('Débutant', 'Débutant'), ('Intermédiaire', 'Intermédiaire'), ('Avancé', 'Avancé')])

    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    option1 = models.CharField(max_length=200)
    option2 = models.CharField(max_length=200)
    option3 = models.CharField(max_length=200)
    option4 = models.CharField(max_length=200)
    correct_option = models.IntegerField(help_text="Index de l'option correcte (1-4)")

    def __str__(self):
        return self.text
