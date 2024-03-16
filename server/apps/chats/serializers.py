from rest_framework import serializers

# Models
from .models import Chat

# User Model
from apps.user.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email'] 

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