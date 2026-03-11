from django.contrib import admin
from .models import Word, Translation, Example, Contribution

class TranslationInline(admin.TabularInline):
    model = Translation
    extra = 1

class ExampleInline(admin.TabularInline):
    model = Example
    extra = 1

@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ('term_shikomori', 'pos', 'phonetics')
    search_fields = ('term_shikomori',)
    inlines = [TranslationInline, ExampleInline]

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('proposed_term', 'status', 'created_at')
    list_filter = ('status',)
    actions = ['approve_contributions']

    def approve_contributions(self, request, queryset):
        for contribution in queryset:
            # Simple logic to convert contribution to a Word
            word, created = Word.objects.get_or_create(
                term_shikomori=contribution.proposed_term,
                defaults={'pos': 'nom'} # Default POS
            )
            Translation.objects.create(
                word=word,
                meaning_fr=contribution.proposed_translation,
                dialect='standard'
            )
            contribution.status = 'approved'
            contribution.save()
        self.message_user(request, "Les contributions sélectionnées ont été approuvées et ajoutées au dictionnaire.")
    approve_contributions.short_description = "Approuver et ajouter au dictionnaire"
