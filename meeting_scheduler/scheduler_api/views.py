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
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
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
                    client_secret=client_secret,
                    scopes=[
                        "https://www.googleapis.com/auth/calendar.app.created",
                        "https://www.googleapis.com/auth/calendar.events.freebusy",
                        "https://www.googleapis.com/auth/calendar.freebusy",
                        "https://www.googleapis.com/auth/calendar",
                        "https://www.googleapis.com/auth/calendar.events",
                        "https://www.googleapis.com/auth/calendar.events.owned",
                        "https://www.googleapis.com/auth/calendar.calendarlist",
                        "https://www.googleapis.com/auth/calendar.calendars",
                        "https://www.googleapis.com/auth/calendar.acls"])
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

@swagger_auto_schema(method='GET', 
manual_parameters=[openapi.Parameter("time_min", openapi.IN_QUERY, description="Enter meetings beginning date", type=openapi.TYPE_STRING),
                    openapi.Parameter("time_max", openapi.IN_QUERY, description="Enter meetings ending date", type=openapi.TYPE_STRING)
                    ],
responses={200: "Received data from calednars",
            401: "Unauthorised access",
            403: "Forbidden access",
            501: "An error occured during receiving calendars"})
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
#test_param = openapi.Parameter("summary", openapi.IN_QUERY, description="Enter meeting summary")
@swagger_auto_schema(method='GET', 
manual_parameters=[openapi.Parameter("time_min", openapi.IN_QUERY, description="Enter meetings beginning date", type=openapi.TYPE_STRING),
                    openapi.Parameter("time_max", openapi.IN_QUERY, description="Enter meetings ending date", type=openapi.TYPE_STRING)
                    ],
responses={200: "Received data from calednars",
            401: "Unauthorised access",
            403: "Forbidden access",
            501: "An error occured during receiving calendars"})
@api_view(['GET'])
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

@swagger_auto_schema(method='GET', 
manual_parameters=[openapi.Parameter("time_min", openapi.IN_QUERY, description="Enter meetings beginning date", type=openapi.TYPE_STRING),
                    openapi.Parameter("time_max", openapi.IN_QUERY, description="Enter meetings ending date", type=openapi.TYPE_STRING)
                    ],
responses={200: "Received data from calednars",
            401: "Unauthorised access",
            403: "Forbidden access",
            501: "An error occured during receiving calendars"})
            
@api_view(['GET'])
@parser_classes([JSONParser])
def is_free_or_busy(request, format=None):
    """
    Check if user is busy at given time
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
@swagger_auto_schema(method='POST', 
manual_parameters=[openapi.Parameter("time_min", openapi.IN_QUERY, description="Enter meetings beginning date", type=openapi.TYPE_STRING),
                    openapi.Parameter("time_max", openapi.IN_QUERY, description="Enter meetings ending date", type=openapi.TYPE_STRING)
                    ],
responses={200: "Received data from calednars",
            401: "Unauthorised access",
            403: "Forbidden access",
            501: "An error occured during receiving calendars"})
@swagger_auto_schema(method='GET', 
responses={200: "Received data from calednars",
            401: "Unauthorised access",
            403: "Forbidden access",
            501: "An error occured during receiving calendars"})
@api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def google_data(request, format=None):
    """
    Provide necessary data to receinve data from Google Calendar API endpoint
    :param request: {
        code : string  
    }
    :param format:
    :return:
    """
#################################################################
    if request.method == "GET":
        content ={
            'status':'request was permitted'
        }
        return Response(content)
##################################################################
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
    Provide necessary data to execute simple algorithm
    :param request: {
        "access_token": string,
        "refresh_token": string,
        "calendars": list[string],
        "beginning_date": string,
        "ending_date": string,
        "beggining_hours": string,
        "beggining_minutes": string,
        "ending_hours": string,
        "ending_minutes": string,
        "meeting_duration_hours": string,
        "meeting_duration_minutes": string,
        "meeting_name": string
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

        return Response(f"Jest taki termin, przed wszystkimi, {meetings_blocks[0].starts - today}", status=201)
    else:
        for idx in range(1,len(meetings_blocks)):
            if meetings_blocks[idx-1].ends - meetings_blocks[idx-1].starts > duration:
                return Response(f"znaleziono termin między blokami, o godzinie {meetings_blocks[idx-1].ends}", status=202)
    if meetings_blocks[-1].ends - today_in_5hrs > duration:
        return Response("Jest taki termin po wszystkich blokach", status=202)

    return Response("Nie znaleziono nic", status=301)


    print(sorted_meetings)
    events_json = json.dumps(all_members_events)

    return Response(events_json)


@api_view(["POST"])
@parser_classes([JSONParser])      
def simple_algorithm_v2(request):
    """
    Provide necessary data to execute complex algorithm
    :param request: {
        "access_token": string,
        "refresh_token": string,
        "calendars": list[string],
        "beginning_date": string,
        "ending_date": string,
        "beggining_hours": string,
        "beggining_minutes": string,
        "ending_hours": string,
        "ending_minutes": string,
        "meeting_duration_hours": string,
        "meeting_duration_minutes": string,
        "meeting_name": string
        }
    :param format:
    :return:
    """
    service = build('calendar', 'v3', credentials=get_google_token(request.data["access_token"], request.data["refresh_token"]))
    today = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    time_min = request.GET.get('beginning_date', today)

    today_plus_seven = (datetime.datetime.utcnow() + datetime.timedelta(days=7)).isoformat() + 'Z'  # 'Z' indicates UTC time
    time_max = request.GET.get('ending_date', today_plus_seven)
    data = get_free_blocks(
        service=service,
        calendars=request.data["calendars"],
        #beginning_date="2021-06-15T07:40:00.000000Z",
        beginning_date=request.data["beginning_date"],
        ending_date=request.data["ending_date"],
        beginning_hours=int(request.data["beginning_hours"]),
        beginning_minutes=int(request.data["beginning_minutes"]),
        ending_hours=int(request.data["ending_hours"]),
        ending_minutes=int(request.data["ending_minutes"]),
        duration_hours=int(request.data["meeting_duration_hours"]),
        duration_minutes=int(request.data["meeting_duration_minutes"]),
    )
    
    # return Response(f"{today} --- type --- {type(today)}")
    
    print(data)
    
    return Response(data,status=200)

@api_view(["POST"])
@parser_classes([JSONParser])  
def insert_meetings(request):
    service = build('calendar', 'v3', credentials=get_google_token(request.data["access_token"], request.data["refresh_token"]))

    hours = request.data["duration_hours"]
    minutes = request.data["duration_minutes"]

    start = request.data["date"]
    end = datetime.datetime.strptime(start,"%Y-%m-%dT%H:%M:%S")+datetime.timedelta(hours=int(hours),minutes=int(minutes))
    end = datetime.datetime.strftime(end,"%Y-%m-%dT%H:%M:%S") + "+02:00"
    start = request.data["date"] + "+02:00"

    event = {
        'summary': request.data["title"],
        #'location': 'Wroclaw, Poland',
        'description': request.data["description"],
        'start': {
            'dateTime': start,
            'timeZone': 'Europe/Warsaw',
        },
        'end': {
            'dateTime': end,
            'timeZone': 'Europe/Warsaw',
        },
        # 'recurrence': [
        #     'RRULE:FREQ=DAILY;COUNT=2'
        # ],
        'attendees': [
            #{'email': 'hulewicz.k@gmail.com'},
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    for calendar in request.data["calendars"]:
        try:
            event = service.events().insert(calendarId=calendar, body=event).execute()
        except:
            return Response(status=500, data="Error")
    
    return Response(data=event, status=200)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter