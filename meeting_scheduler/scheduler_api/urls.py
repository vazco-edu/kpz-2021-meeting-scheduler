from django.urls import path, include
from . import views

app_name = 'scheduler_api'

urlpatterns = [
    path('calendars/list', views.get_calendars_list, name='calendars-list'),
    path('calendar/<str:calendar>/events', views.get_events_from_calendar, name='events-list'),
    path('calendar/<str:calendar>/event/insert', views.insert_event_to_calendar, name='insert-event'),
    path('calendar/freebusy', views.is_free_or_busy, name='free-busy'),
]
