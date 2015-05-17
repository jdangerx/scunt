# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import taggit.managers
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('taggit', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('name', models.TextField()),
                ('email', models.TextField()),
                ('phone', models.TextField()),
                ('location', models.TextField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('number', models.IntegerField()),
                ('page', models.IntegerField()),
                ('text', models.TextField()),
                ('point_txt', models.TextField()),
                ('min_val', models.FloatField()),
                ('max_val', models.FloatField()),
                ('earlysub', models.BooleanField()),
                ('due', models.DateTimeField(default=datetime.datetime(2015, 5, 10, 17, 51, tzinfo=utc))),
                ('complete', models.BooleanField(default=False)),
                ('roadtrip', models.BooleanField(default=False)),
                ('location', models.TextField()),
                ('updated', models.DateTimeField(auto_now=True, null=True)),
                ('contacts', models.ManyToManyField(to='scavlist.ContactInfo')),
                ('tags', taggit.managers.TaggableManager(verbose_name='Tags', help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag')),
            ],
        ),
        migrations.CreateModel(
            name='PageCaptain',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('page', models.IntegerField()),
                ('contact', models.ForeignKey(to='scavlist.ContactInfo')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
