import datetime
from google_auth_httplib2 import Request
import requests
from typing import List, Dict
from copy import deepcopy
from .Blocks import Block
from rest_framework.response import Response


def get_free_blocks(
    request,
    service,
    calendars: List[str],
    beginning_date: str,
    ending_date: str,
    beginning_hours: str,
    beginning_minutes: str,
    ending_hours: int,
    ending_minutes: int,
    duration_hours: int,
    duration_minutes: int,
    ) -> Dict:
    meetings = []
    meetings_blocks = []
    all_events = dict()



    bdate = f"{beginning_date}T{beginning_hours}:{beginning_minutes}:00.000000Z"
    edate = f"{ending_date}T{ending_hours}:{ending_minutes}:00.000000Z"
    datetime_bdate = datetime.datetime.strptime(bdate[:-8],"%Y-%m-%dT%H:%M:%S")
    datetime_edate = datetime.datetime.strptime(edate[:-8],"%Y-%m-%dT%H:%M:%S")
    bdate_tmp = (datetime_bdate - datetime.timedelta(hours=7)).strftime("%Y-%m-%dT%H:%M:%S") + ".000000Z"
    delta_time = datetime.timedelta(hours=duration_hours, minutes=duration_minutes)

    for calendar in calendars:
        events_result = service.events().list(calendarId=calendar, 
                                            timeMin=bdate_tmp,
                                            timeMax=edate,
                                            singleEvents=True,
                                            orderBy='startTime').execute()
        all_events[calendar] = events_result.get('items', [])

    for e in all_events:
        for listing in all_events[e]:
            meetings.append({
                    'starts':datetime.datetime.strptime(listing["start"]["dateTime"][:-6],"%Y-%m-%dT%H:%M:%S"),
                    'ends':datetime.datetime.strptime(listing["end"]["dateTime"][:-6],"%Y-%m-%dT%H:%M:%S")
            })       
    sorted_meetings = sorted(meetings, key=lambda x: x['starts'])
    print(sorted_meetings)
    if len(sorted_meetings) > 0:
        meetings_blocks.append(Block(sorted_meetings[0]['starts'],sorted_meetings[0]['ends']))
        print("XD")
        for i in range(1, len(sorted_meetings)):
            if meetings_blocks[-1].ends >= sorted_meetings[i]['starts']:
                print(f"X {meetings_blocks} : {sorted_meetings[i]}\n")
                if meetings_blocks[-1].ends < sorted_meetings[i]['ends']:
                    meetings_blocks[-1].extend_block_ending(sorted_meetings[i]['ends'])
                else:
                    pass
            else:
                meetings_blocks.append(Block(sorted_meetings[i]['starts'], sorted_meetings[i]['ends']))
    
    meetings_blocks.append(Block(datetime_edate,datetime_edate))
    print(meetings_blocks)
    meetings_blocks_a = select_viable_blocks(meeting_blocks=meetings_blocks, complete_starting_date=datetime_bdate)

    for b in meetings_blocks:
        print(f"Start:{b.starts}, end: {b.ends}")

    generated_dates = generate_viable_starting_dates_a(meetings_blocks_a, datetime_bdate, datetime_edate, delta_time)
    print(type(generated_dates),"==============================")

    v_dates=limit_hours(generated_dates,int(beginning_hours),int(beginning_minutes), int(ending_hours), int(ending_minutes),duration_hours, duration_minutes)

    return {
        "calendars": calendars,
        "dates": v_dates,
        "duration_hours": duration_hours,
        "duration_minutes": duration_minutes,
    }


def select_viable_blocks(meeting_blocks: List, complete_starting_date):
    
    return [block for block in meeting_blocks 
            if (block.starts<complete_starting_date 
            and block.ends>complete_starting_date) 
            or block.starts > complete_starting_date]


def generate_viable_starting_dates(
    meeting_blocks: List,
    complete_starting_date,
    complete_ending_date,
    meeting_duration
    ) -> str:

    _ = []
    tmp_date = complete_starting_date
    if(meeting_blocks[0].starts > complete_starting_date 
        and meeting_blocks[0].starts - complete_starting_date > meeting_duration):
        while not tmp_date + meeting_duration > meeting_blocks[0].starts:
            _.append((tmp_date).strftime("%Y-%m-%dT%H:%M:%S"))
            tmp_date += datetime.timedelta(minutes=5)
            #_.append((tmp_date + meeting_duration).str)
    if len(meeting_blocks) > 0:
        for i in range(1,len(meeting_blocks)):
            tmp_date = deepcopy(meeting_blocks[i-1].ends)
            while not tmp_date + meeting_duration > meeting_blocks[i].starts:
                _.append((tmp_date).strftime("%Y-%m-%dT%H:%M:%S"))
                tmp_date += datetime.timedelta(minutes=5)

        if(meeting_blocks[-1].ends < complete_ending_date
            and complete_ending_date - meeting_blocks[-1].ends > meeting_duration):
            while not tmp_date + meeting_duration > meeting_blocks[0].starts:
                _.append((tmp_date).strftime("%Y-%m-%dT%H:%M:%S"))
                tmp_date += datetime.timedelta(minutes=5)

    return _

def generate_viable_starting_dates_a(
    meeting_blocks: List,
    complete_starting_date,
    complete_ending_date,
    meeting_duration
    ) -> str:

    _ = []
    tmp_date = deepcopy(complete_starting_date)
    if(meeting_blocks[0].starts > complete_starting_date 
        and meeting_blocks[0].starts - complete_starting_date > meeting_duration):
        while not tmp_date + meeting_duration > meeting_blocks[0].starts:
            _.append((tmp_date).strftime("%Y-%m-%dT%H:%M:%S"))
            tmp_date += datetime.timedelta(minutes=5)
            #_.append((tmp_date + meeting_duration).str)
    if len(meeting_blocks) > 0:
        for i in range(1,len(meeting_blocks)):
            tmp_date = deepcopy(meeting_blocks[i-1].ends)
            while not tmp_date + meeting_duration > meeting_blocks[i].starts:
                _.append((tmp_date).strftime("%Y-%m-%dT%H:%M:%S"))
                tmp_date += datetime.timedelta(minutes=5)

    if(meeting_blocks[-1].ends < complete_ending_date
        and complete_ending_date - meeting_blocks[-1].ends > meeting_duration):
        while not tmp_date + meeting_duration > meeting_blocks[0].starts:
            _.append((tmp_date).strftime("%Y-%m-%dT%H:%M:%S"))
            tmp_date += datetime.timedelta(minutes=5)
    print(_)
    return _


def limit_hours(array, s_hr=0, s_min=0, e_hr=0, e_min=0, duration_hours=0, duration_minutes=0):
    print(f"starting_ hours: {array[0][-8:-6]}")
    print(f"starting_ mins: {array[0][-5:-3]}")
    print(array)
    result =[]
    print("Duration hrs: ", duration_hours)
    for elem in array:
        mtng_start_h = int(elem[-8:-6])
        mtng_start_m = round(int(elem[-5:-3])/60, 6)
        mtng_end_m = int(elem[-5:-3]) + int(duration_minutes)
        mtng_end_h = int(duration_hours) + mtng_start_h 
        add = 0
        if mtng_end_m >= 60:
            add=1
            mtng_end_m = round((mtng_end_m % 60) /60, 6)
        else:
            add = 0
            mtng_end_m = round((mtng_end_m) /60, 6)
        
        if mtng_end_h + add >= 24:
            continue
        else:
            #print(mtng_start_h, "+", mtng_start_m, "\n")
            if ( mtng_start_h + mtng_start_m >= round((int(s_hr)+int(s_min)/60), 6)) and mtng_end_h + mtng_end_m + add<= round((int(e_hr)+int(e_min)/60), 6):
                print(elem, "    ", f"{mtng_end_h + mtng_end_m} <= {round((int(e_hr)+int(e_min)/60), 6)}")
                result.append(elem)
    print(result)
    return result
