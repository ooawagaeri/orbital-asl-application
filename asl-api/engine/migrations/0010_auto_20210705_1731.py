# Generated by Django 3.2.3 on 2021-07-05 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0009_quizattempt_images'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quizattempt',
            name='images',
        ),
        migrations.AddField(
            model_name='quizchoice',
            name='images',
            field=models.ManyToManyField(blank=True, to='engine.Gesture'),
        ),
    ]
