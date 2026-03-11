import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shikomori_core.settings')
django.setup()

from learning.models import Quiz, Question

def seed_learning():
    # Clear existing data
    Quiz.objects.all().delete()
    
    # Create Quiz 1
    quiz1 = Quiz.objects.create(
        title="Bases du Shikomori",
        description="Testez vos connaissances sur les salutations et les mots de base.",
        difficulty="Débutant"
    )
    
    Question.objects.create(
        quiz=quiz1,
        text="Comment dit-on 'Bonjour' en Shikomori ?",
        option1="Bariza asubuhi",
        option2="Jeje",
        option3="Kwaheri",
        option4="Hodi",
        correct_option=2
    )
    
    Question.objects.create(
        quiz=quiz1,
        text="Que signifie 'Ewa' ?",
        option1="Non",
        option2="Peut-être",
        option3="Oui",
        option4="Merci",
        correct_option=3
    )
    
    # Create Quiz 2
    quiz2 = Quiz.objects.create(
        title="La Famille",
        description="Apprenez les termes liés aux membres de la famille.",
        difficulty="Débutant"
    )
    
    Question.objects.create(
        quiz=quiz2,
        text="Comment dit-on 'La mère' ?",
        option1="Mdzadze",
        option2="Mbaba",
        option3="Mwana",
        option4="Koko",
        correct_option=1
    )

    print("Données d'apprentissage insérées avec succès !")

if __name__ == '__main__':
    seed_learning()
