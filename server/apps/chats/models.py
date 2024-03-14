from uuid import uuid4
from django.db import models
from apps.user.models import CustomUser

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True) 

    # Chat Details
    prompt = models.TextField(blank=False, null=True)
    message = models.TextField(blank=False, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.id)

    class Meta:
        db_table = "chats"
        ordering = ["-created_at"]
        verbose_name = "Chat"
        verbose_name_plural ="Chats"

    
class UserChat(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)

    class Meta:
        db_table = "user_chats"