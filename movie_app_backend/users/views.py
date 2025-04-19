from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from .models import CustomUser
from .serializers import (
    UserSerializer, 
    UserCreateSerializer, 
    UserUpdateSerializer,
    ChangePasswordSerializer
)

class UserRegisterView(generics.CreateAPIView):
    
    queryset = CustomUser.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def create(self, request, *args, **kwargs):
        print("Registration request content type:", request.content_type)
        print("Registration FILES keys:", list(request.FILES.keys()))
        if 'profile_picture' in request.FILES:
            print("Registration profile picture found:", 
                  request.FILES['profile_picture'].name,
                  request.FILES['profile_picture'].size, "bytes",
                  "Content type:", request.FILES['profile_picture'].content_type)
        else:
            print("No profile_picture in registration request.FILES")
        print("Registration DATA keys:", list(request.data.keys()))
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        user_data = UserSerializer(serializer.instance).data
        
        return Response(
            {"message": "User registered successfully", "user": user_data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )



class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_object(self):
        return self.request.user
    
    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    def put(self, request, *args, **kwargs):
        user = self.get_object()
        
        print("Profile update content type:", request.content_type)
        print("Profile update FILES keys:", list(request.FILES.keys()))
        if 'profile_picture' in request.FILES:
            print("Profile picture found:", 
                  request.FILES['profile_picture'].name,
                  request.FILES['profile_picture'].size, "bytes",
                  "Content type:", request.FILES['profile_picture'].content_type)
        else:
            print("No profile_picture in profile update request.FILES")
        print("Profile update DATA keys:", list(request.data.keys()))
        
        serializer = UserUpdateSerializer(user, data=request.data, context={'request': request}, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(user).data)
        
        print("Serializer validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        return self.put(request, *args, **kwargs)


class ChangePasswordView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Wrong password."]}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {"message": "Password updated successfully"}, 
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAccountView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        user.delete()
        return Response(
            {"message": "Account deleted successfully"}, 
            status=status.HTTP_204_NO_CONTENT
        )