from django.urls import path

# Views
from .views import *

urlpatterns = [
    path("create/", ChatCreateView.as_view(), name="create_chat"),
    path('all', AllChatLogsView.as_view(), name='all-chats'),
    path('user/', UserChatLogsView.as_view(), name='user-chats'),
    path('user/<uuid:pk>/', SingleChatView.as_view(), name='single-chat'),

]