from rest_framework import serializers
from .models import Quiz, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option1', 'option2', 'option3', 'option4', 'correct_option']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'difficulty', 'questions']
