from django.urls import path

# Views
from .views import ChatCreateView

urlpatterns = [
    path("create/", ChatCreateView.as_view(), name="create_chat"),
]