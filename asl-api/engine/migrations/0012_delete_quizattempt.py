# Generated by Django 3.2.3 on 2021-07-18 04:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0011_remove_quizchoice_images'),
    ]

    operations = [
        migrations.DeleteModel(
            name='QuizAttempt',
        ),
    ]
