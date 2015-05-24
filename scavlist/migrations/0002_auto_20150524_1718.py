# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('scavlist', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactinfo',
            name='location',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='contactinfo',
            name='phone',
            field=models.TextField(blank=True, null=True),
        ),
    ]
