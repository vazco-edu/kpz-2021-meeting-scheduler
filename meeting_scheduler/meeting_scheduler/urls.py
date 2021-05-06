"""meeting_scheduler URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from scheduler_api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('scheduler.urls', namespace='scheduler')),
    path('api/', include('scheduler_api.urls', namespace='scheduler_api')),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('dj-rest-auth/google/', views.GoogleLogin.as_view(), name='google-login'),
    path('dj-rest-auth/', include("dj_rest_auth.urls"))
    #path('accounts/', include('allauth.urls')),
]
