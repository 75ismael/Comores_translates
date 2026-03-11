import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shikomori_core.settings')
django.setup()

from linguistics.models import Word, Translation, Example

def seed():
    data = [
        {
            "term": "Nadjisoma",
            "pos": "verbe",
            "translations": [
                {"meaning": "J'apprends / Je lis", "dialect": "standard"},
                {"meaning": "Apprendre", "dialect": "standard"}
            ],
            "examples": [
                {"sh": "Nadjisoma shikomori", "fr": "J'apprends le shikomori"}
            ]
        },
        {
            "term": "Eka",
            "pos": "conj",
            "translations": [
                {"meaning": "Si", "dialect": "standard"}
            ],
            "examples": [
                {"sh": "Eka kwandza...", "fr": "Si tu veux..."}
            ]
        },
        {
            "term": "Bariza dagoni",
            "pos": "nom",
            "translations": [
                {"meaning": "Les nouvelles de la maison", "dialect": "grand_comore"}
            ],
            "examples": [
                {"sh": "Bariza dagoni ? Ndjema.", "fr": "Quelles sont les nouvelles de la maison ? Elles sont bonnes."}
            ]
        },
        {
            "term": "Ye mbaba",
            "pos": "nom",
            "translations": [
                {"meaning": "Le papa", "dialect": "standard"}
            ],
            "examples": [
                {"sh": "Ye mbaba ngu dagoni", "fr": "Le papa est à la maison"}
            ]
        },
        {
            "term": "Maesha",
            "pos": "nom",
            "translations": [
                {"meaning": "La vie", "dialect": "standard"}
            ],
            "examples": [
                {"sh": "Maesha mema", "fr": "Une bonne vie"}
            ]
        }
    ]

    print("Seeding data...")
    for item in data:
        word, created = Word.objects.get_or_create(
            term_shikomori=item["term"],
            defaults={"pos": item["pos"]}
        )
        if created:
            for t in item["translations"]:
                Translation.objects.get_or_create(
                    word=word,
                    meaning_fr=t["meaning"],
                    dialect=t["dialect"]
                )
            for e in item["examples"]:
                Example.objects.get_or_create(
                    word=word,
                    sentence_shikomori=e["sh"],
                    sentence_fr=e["fr"]
                )
            print(f"Added word: {item['term']}")
        else:
            print(f"Word already exists: {item['term']}")

    print("Seeding complete!")

if __name__ == "__main__":
    seed()
