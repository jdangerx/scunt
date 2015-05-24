from django import forms
from scavlist.models import ContactInfo


class ClaimItemForm(forms.ModelForm):
    class Meta:
        model = ContactInfo
        fields = ["name", "email", "phone", "location"]
