from rest_framework import serializers
from .models import Word, Translation, Example, Contribution
from django.contrib.auth.models import User

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = ['id', 'meaning_fr', 'dialect']

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ['id', 'sentence_shikomori', 'sentence_fr']

class WordSerializer(serializers.ModelSerializer):
    translations = TranslationSerializer(many=True, read_only=True)
    examples = ExampleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Word
        fields = ['id', 'term_shikomori', 'pos', 'phonetics', 'translations', 'examples']

class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = ['id', 'user', 'proposed_term', 'proposed_translation', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']
