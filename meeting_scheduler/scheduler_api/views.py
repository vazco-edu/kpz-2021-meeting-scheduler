from rest_framework.decorators import parser_classes, api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from dj_rest_auth.registration.views import SocialLoginView, SocialConnectView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

@api_view(['GET', 'POST'])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
def google_data(request, format=None):

    if request.method == "GET":
        content ={
            'status':'request was permitted'
        }
        return Response(content)
    elif request.method == "POST":
        print (f'=========================== received data: {request}')
        return Response(request.data)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter