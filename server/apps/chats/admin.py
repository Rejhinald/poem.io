from django.contrib import admin

# Models
from .models import Chat

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("id", "user")  # change 'user_id' to 'user'
    readonly_fields = ("id", "created_at", "updated_at")

    fieldsets = (
        (None,
            {"fields": ("id", "user")}  # change 'user_id' to 'user'
        ),
        ("Chat Details", 
            {
                "fields": (
                    "prompt",
                    "message",
                )
            } 
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        )
    )
