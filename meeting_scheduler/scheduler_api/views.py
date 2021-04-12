from rest_framework import generics
from .serializers import PostSerializer


class PostAPIView(generics.ListAPIView):
    serializer_class = PostSerializer


class PostDetail(generics.RetrieveDestroyAPIView):
    pass