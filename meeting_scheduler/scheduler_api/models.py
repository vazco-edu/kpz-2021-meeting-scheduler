import json

from django.db import models


# Create your models here.

class Calendar(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    etag = models.CharField(max_length=100)
    summary = models.CharField(max_length=1000)
    accessRole = models.CharField(max_length=100)
    timeZone = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)
