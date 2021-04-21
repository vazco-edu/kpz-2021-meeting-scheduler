from rest_framework.decorators import parser_classes, api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_auth.registration.views import SocialLoginView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

@api_view(['POST'])
@parser_classes([JSONParser])
def google_data(request, format=None):
    print (f'XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD received data: {request.data}')
    return Response({'received data': request.data})

@api_view(['GET'])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
def google_data(request, format=None):
    content ={
        'status':'request was permitted'
    }
    return Response(content)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter