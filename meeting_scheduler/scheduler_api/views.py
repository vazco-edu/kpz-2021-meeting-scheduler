from rest_framework.decorators import parser_classes, api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
import datetime
import os.path
import json
import requests
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from dj_rest_auth.registration.views import SocialLoginView, SocialConnectView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

from .models import Calendar
from .Blocks import Block
from .alg import get_free_blocks 

def get_google_token(access_token, refresh_token, 
                    client_id=os.environ.get('CLIENT_ID'), 
                    client_secret=os.environ.get('SECRET_GOOGLE'),
                    uri=os.environ.get("REDIRECT_URI")):
    """
    Custom function responsible for generating credentials object
    based on the data provided by the user in request.
    """
    creds = Credentials(token=access_token,
                    refresh_token=refresh_token,
                    #token_uri=request.data["token_uri"],
                    token_uri=uri,
                    client_id=client_id,
                    client_secret=client_secret)
    return creds

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

@api_view(['POST'])
#@api_view(['GET'])
@parser_classes([JSONParser])
def get_calendars_list(request, format=None):
    """
    :param request:{
        access_token : string -> google API access token
        refresh_token : string -> google API refresh token
    }
    :param format:
    :return: calendars list in json
    """
    service = build('calendar', 'v3', credentials=get_google_token(request.data["access_token"], request.data["refresh_token"]))

    #service = build('calendar', 'v3', credentials=tmp_creds())

    calendar_list = service.calendarList().list().execute()

    calendars = []
    # # example how to get calendars objects
    # for item in calendar_list['items']: calendar = Calendar(id=item['id'],
    # etag=item['etag'], summary=item['summary'], accessRole=item['accessRole'], timeZone=item['timeZone'])
    # calendars.append(calendar.toJSON())
    print(calendar_list.get('items', []))

    return Response(calendar_list.get('items', []))

@api_view(['GET'])
#@api_view(['POST'])
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


@api_view(['GET', 'POST'])
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

@api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def google_data(request, format=None):
    """
    Provide necessary data to generate google API access and refresh token
    :param request: {
        code : string -> Code generated by Google Oauth  
    }
    :param format:
    :return:
    """

    if request.method == "GET":
        content ={
            'status':'request was permitted'
        }
        return Response(content)
    elif request.method == "POST":
        #print (f'=========================== received data: {request.data["x"]}')
        #print(f'token: {request.data["token"]}')
        print(os.environ.get('CLIENT_ID'))
        print(os.environ.get('SECRET_GOOGLE'))
        print(os.environ.get('REDIRECT_URI'))
        data = {
            "code": request.data['code'],
            "client_id": os.environ.get('CLIENT_ID'),
            "client_secret": os.environ.get('SECRET_GOOGLE'),
            "redirect_uri": os.environ.get('REDIRECT_URI'),
            "grant_type": "authorization_code"
        }

        #print(data)
        req = requests.post("https://oauth2.googleapis.com/token", data=data)
        #print(req)
        json_data = json.loads(req.text)

        return Response(data=json_data, status=200)

# @permission_classes([IsAuthenticated])
@api_view(["POST"])
@parser_classes([JSONParser])      
def simple_algorithm(request):
    """
    Provide necessary data to generate google API access and refresh token
    :param request: {
        "access_token": string,
        "refresh_token": string,
        "calendars": list[str],
        "beginning_date": "2021-06-15 15:50:52.236664Z",
        "ending_date": "2021-06-16 15:50:52.236664Z",
        "beggining_hours": 12,
        "beggining_minutes": 30,
        "ending_hours": 16,
        "ending_minutes": 00,
        "meeting_duration_hours": 2,
        "meeting_duration_minutes": 30,
        "meeting_name": "meeting_name"
        }
    :param format:
    :return:
    """
    service = build('calendar', 'v3', credentials=get_google_token(request.data["access_token"], request.data["refresh_token"]))
    meetings_date = []
    meetings_blocks = []
    all_members_events = dict()
    
    today = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    time_min = request.GET.get('time_min', today)

    today_plus_ten = (datetime.datetime.utcnow() + datetime.timedelta(days=1)).isoformat() + 'Z'  # 'Z' indicates UTC time
    time_max = request.GET.get('time_max', today_plus_ten)
    
    for calendar in request.data["calendars"]:
        events_result = service.events().list(calendarId=calendar, 
                                            timeMin=time_min,
                                            timeMax=time_max, 
                                            singleEvents=True,
                                            orderBy='startTime').execute()
        all_members_events[calendar] = events_result.get('items', [])
    #if not events:
    #    return Response('No results', status=204)
    for e in all_members_events:
        for listing in all_members_events[e]:
            meetings_date.append(
                {
                    'starts':datetime.datetime.strptime(listing["start"]["dateTime"][:-6],"%Y-%m-%dT%H:%M:%S"),
                    'ends':datetime.datetime.strptime(listing["end"]["dateTime"][:-6],"%Y-%m-%dT%H:%M:%S")
                }
            )       
    sorted_meetings = sorted(
        meetings_date,
        key=lambda x: x['starts']
    )
    meetings_blocks.append(Block(sorted_meetings[0]['starts'],sorted_meetings[0]['ends']))

    for i in range(1, len(sorted_meetings)):
        found_overlaping = False
        for block in meetings_blocks:
            if sorted_meetings[i]['starts'] <= block.ends:
                found_overlaping = True
                if sorted_meetings[i]['ends'] >= block.ends:
                    block.extend_block_ending(sorted_meetings[i]['ends'])
                else:
                    pass
        if not found_overlaping:
            meetings_blocks.append(Block(sorted_meetings[i]['starts'],sorted_meetings[i]['ends']))

    today = (datetime.datetime.utcnow() + datetime.timedelta(hours=2)).isoformat() + 'Z'
    print(today)
    today = datetime.datetime.strptime(today[:-8],"%Y-%m-%dT%H:%M:%S")

    today_in_5hrs = (datetime.datetime.utcnow() + datetime.timedelta(hours=7)).isoformat()
    today_in_5hrs = datetime.datetime.strptime(today_in_5hrs[:-8],"%Y-%m-%dT%H:%M:%S")

    duration = datetime.timedelta(hours=2)
    
    for m in meetings_blocks:
        print(m)
    if meetings_blocks[0].starts - today > duration:

        return Response(f"Jest taki termin, przed wszystkimi, {meetings_blocks[0].starts - today}")
    else:
        for idx in range(1,len(meetings_blocks)):
            if meetings_blocks[idx-1].ends - meetings_blocks[idx-1].starts > duration:
                return Response(f"znaleziono termin między blokami, o godzinie {meetings_blocks[idx-1].ends}")
    if meetings_blocks[-1].ends - today_in_5hrs > duration:
        return Response("Jest taki termin po wszystkich blokach")

    return Response("Nie znaleziono nic")


    print(sorted_meetings)
    events_json = json.dumps(all_members_events)

    return Response(events_json)


@api_view(["POST"])
@parser_classes([JSONParser])      
def simple_algorithm_v2(request):
    
    service = build('calendar', 'v3', credentials=get_google_token(request.data["access_token"], request.data["refresh_token"]))
    today = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    time_min = request.GET.get('beginning_date', today)

    today_plus_seven = (datetime.datetime.utcnow() + datetime.timedelta(days=7)).isoformat() + 'Z'  # 'Z' indicates UTC time
    time_max = request.GET.get('ending_date', today_plus_seven)
    
    response = get_free_blocks(
        request=request,
        service=service,
        calendars=request.data["calendars"],
        #beginning_date="2021-06-15T07:40:00.000000Z",
        beginning_date="2021-06-15",
        ending_date="2021-06-15",
        beginning_hours=6,
        beginning_minutes=40,
        ending_hours=19,
        ending_minutes=00,
        duration_hours=1,
        duration_minutes=0,
    )
    
    # return Response(f"{today} --- type --- {type(today)}")
    return response

@api_view(["POST"])
@parser_classes([JSONParser])  
def insert_meetings(request):
    service = build('calendar', 'v3', credentials=get_google_token(request.data["access_token"], request.data["refresh_token"]))

    hours = request.data["duration_hours"]
    minutes = request.data["duration_minutes"]

    start = request.data["date"]
    end = datetime.datetime.strptime(start,"%Y-%m-%dT%H:%M:%S")+datetime.timedelta(hours=hours,minutes=minutes)
    end = datetime.datetime.strftime(end,"%Y-%m-%dT%H:%M:%S") + ".000000Z"
    start = request.data["date"] + ".000000Z"

    event = {
        'summary': 'Test',
        'location': 'Wroclaw, Poland',
        'description': 'desc',
        'start': {
            'dateTime': '2021-06-17T09:00:00+02:00',
            'timeZone': 'Europe/Warsaw',
        },
        'end': {
            'dateTime': '2021-06-17T17:00:00+02:00',
            'timeZone': 'Europe/Warsaw',
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
            {'email': 'hulewicz.k@gmail.com'},
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    # for calendar in request.data["calendars"]:
    event = service.events().insert(calendarId=request.data["calendars"][0], body=event).execute()
    return Response(data=event, status=200)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter