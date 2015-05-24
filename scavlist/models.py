from django.db import models
from django.contrib.auth.models import User
from taggit.managers import TaggableManager

from scunt.settings import JUDGMENT


class ContactInfo(models.Model):
    name = models.TextField(null=False)
    email = models.TextField(null=False)
    phone = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)


class PageCaptain(models.Model):
    user = models.ForeignKey(User)
    contact = models.ForeignKey(ContactInfo)
    page = models.IntegerField(null=False)


class Item(models.Model):
    number = models.IntegerField(null=False)
    page = models.IntegerField(null=False)
    text = models.TextField(null=False)
    point_txt = models.TextField(null=False)
    min_val = models.FloatField(null=False)
    max_val = models.FloatField(null=False)
    earlysub = models.BooleanField(null=False)
    due = models.DateTimeField(default=JUDGMENT)
    complete = models.BooleanField(default=False)
    roadtrip = models.BooleanField(default=False)
    location = models.TextField()
    tags = TaggableManager()
    contacts = models.ManyToManyField(ContactInfo)
    updated = models.DateTimeField(null=True, blank=True, auto_now=True)

    @property
    def claimed(self):
        return len(self.contacts) > 0

    def __repr__(self):
        return "<Item {number}: {text} {point_txt}>".format(**self.__dict__)
