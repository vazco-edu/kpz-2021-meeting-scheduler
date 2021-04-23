from django.urls import path, include
from . import views

app_name = 'scheduler_api'

urlpatterns = [
    path('', views.google_data, name="googledata"),
    path('dj-rest-auth/google/', views.GoogleLogin.as_view(), name='google-login')
]