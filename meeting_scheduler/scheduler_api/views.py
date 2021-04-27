from rest_framework.decorators import parser_classes, api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
import datetime
import os.path
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

from meeting_scheduler.scheduler_api.models import Calendar


def get_google_credentials():
    creds = None
    path = 'token.json'

    SCOPES = [
        "https://www.googleapis.com/auth/calendar.app.created",
        "https://www.googleapis.com/auth/calendar.events.freebusy",
        "https://www.googleapis.com/auth/calendar.freebusy",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.events.owned",
        "https://www.googleapis.com/auth/calendar.calendarlist",
        "https://www.googleapis.com/auth/calendar.calendars",
        "https://www.googleapis.com/auth/calendar.acls"
    ]

    if os.path.exists(path):
        creds = Credentials.from_authorized_user_file(path, SCOPES)
    else:
        print('No creds available')

    return creds


@api_view(['GET'])
@parser_classes([JSONParser])
def get_calendars_list(request, format=None):
    """
    :param request:
    :param format:
    :return: calendars list in json
    """
    service = build('calendar', 'v3', credentials=get_google_credentials())

    calendar_list = service.calendarList().list().execute()

    calendars = []
    # # example how to get calendars objects
    # for item in calendar_list['items']: calendar = Calendar(id=item['id'],
    # etag=item['etag'], summary=item['summary'], accessRole=item['accessRole'], timeZone=item['timeZone'])
    # calendars.append(calendar.toJSON())

    return Response(calendar_list.get('items', []))


@api_view(['GET'])
@parser_classes([JSONParser])
def get_events_from_calendar(request, calendar, format=None):
    """
    return events in calendar from given time interval
    :param request:{
        time_min : datetime
        time_max : datetime
    }
    :param calendar: calendar id
    :param format:
    :return:
    """
    service = build('calendar', 'v3', credentials=get_google_credentials())

    today = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    time_min = request.GET.get('time_min', today)

    today_plus_ten = (datetime.datetime.utcnow() + datetime.timedelta(days=10)).isoformat() + 'Z'  # 'Z' indicates UTC time
    time_max = request.GET.get('time_max', today_plus_ten)

    events_result = service.events().list(calendarId=calendar, timeMin=time_min, timeMax=time_max, singleEvents=True,
                                          orderBy='startTime').execute()
    events = events_result.get('items', [])

    if not events:
        return Response('No results', status=204)

    return Response(events)


@api_view(['POST'])
@parser_classes([JSONParser])
def insert_event_to_calendar(request, calendar, format=None):
    """
    Insert Event to calendar
    :param request: {
        summary: string
        location: string
        description: string
        start: datetime
        end: datetime
        attendees: list
    }
    :param calendar: calendar id
    :param format:
    :return:
    """
    service = build('calendar', 'v3', credentials=get_google_credentials())

    event = {
        'summary': request.GET.get('summary', ''),
        'location': request.GET.get('location', ''),
        'description': request.GET.get('description', ''),
        'start': request.GET.get('start', ''),
        'end': request.GET.get('end', ''),
        'attendees': request.GET.get('attendees', ''),
        'reminders': {
            'useDefault': True,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    # event = {
    #     'summary': 'Google I/O 2015',
    #     'location': '800 Howard St., San Francisco, CA 94103',
    #     'description': 'A chance to hear more about Google\'s developer products.',
    #     'start': {
    #         'dateTime': '2021-05-01T09:00:00-07:00',
    #         'timeZone': 'America/Los_Angeles',
    #     },
    #     'end': {
    #         'dateTime': '2021-05-01T17:00:00-07:00',
    #         'timeZone': 'America/Los_Angeles',
    #     },
    #     'recurrence': [
    #         'RRULE:FREQ=DAILY;COUNT=2'
    #     ],
    #     'attendees': [
    #         {'email': 'lpage@example.com'},
    #         {'email': 'sbrin@example.com'},
    #     ],
    #     'reminders': {
    #         'useDefault': False,
    #         'overrides': [
    #             {'method': 'email', 'minutes': 24 * 60},
    #             {'method': 'popup', 'minutes': 10},
    #         ],
    #     },
    # }

    event = service.events().insert(calendarId=calendar, body=event).execute()

    return Response({'Event created:': event.get('htmlLink')})


@api_view(['GET'])
@parser_classes([JSONParser])
def is_free_or_busy(request, format=None):
    """
    check if user is busy at given time
    :param request:{
        time_min : datetime
        time_max : datetime
        items : list
    }
    :param format:
    :return:
    """
    service = build('calendar', 'v3', credentials=get_google_credentials())

    today = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    time_min = request.GET.get('time_min', today)

    today_plus_ten = (datetime.datetime.utcnow() + datetime.timedelta(
        days=10)).isoformat() + 'Z'  # 'Z' indicates UTC time
    time_max = request.GET.get('time_max', today_plus_ten)

    # List of calendars and/or groups to query.
    items = request.GET.get('items', [{"id": 'primary'}])

    body = {
        "timeMin": time_min,
        "timeMax": time_max,
        "items": items
    }

    eventsResult = service.freebusy().query(body=body).execute()
    cal_dict = eventsResult[u'calendars']

    return Response(cal_dict)


