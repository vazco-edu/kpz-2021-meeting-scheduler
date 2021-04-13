from django.urls import path
from .views import PostAPIView

app_name = 'scheduler_api'

urlpatterns = [
    path('', PostAPIView.as_view(), name='list')
]