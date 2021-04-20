from django.urls import path, include
from . import views

app_name = 'scheduler_api'

urlpatterns = [
    path('', views.google_data, name="googledata"),
]