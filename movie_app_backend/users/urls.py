from django.urls import path
from .views import (
    UserRegisterView,
    UserProfileView,
    ChangePasswordView,
    DeleteAccountView
)

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
]