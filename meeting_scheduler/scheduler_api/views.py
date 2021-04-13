from rest_framework.decorators import parser_classes, api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

@api_view(['POST'])
@parser_classes([JSONParser])
def google_data(request, format=None):
    print (f'XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD received data: {request.data}')
    return Response({'received data': request.data})

@api_view(['GET'])
@parser_classes([JSONParser])
def google_data(request, format=None):
    print (f'XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD received data: {request.data}')
    return Response({'received data': request.data})
