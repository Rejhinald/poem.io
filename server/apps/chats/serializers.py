from rest_framework import serializers

# Models
from .models import Chat

class ChatSerializers(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = [
            "id",
            "prompt",
            "message",
            "created_at",
            "updated_at",
        ]