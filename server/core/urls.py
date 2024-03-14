
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Chats
    path("api/v1/chats/", include("apps.chats.urls")),
    path("api/v1/user/", include("apps.user.urls")),
]
