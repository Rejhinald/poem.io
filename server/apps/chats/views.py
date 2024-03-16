import os

# Generative AI (Google Gemini)
import google.generativeai as genai

# Rest Framework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated 
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView


# Token Authorization
from rest_framework.authentication import TokenAuthentication


# Models
from .models import Chat

# Serializers
from .serializers import ChatSerializers

# Google Gemini Key
genai.configure(api_key=os.environ["API_KEY"])

class ChatCreateView(CreateAPIView):
    from rest_framework.authentication import TokenAuthentication
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializers = ChatSerializers(data=request.data)    
        serializers.is_valid(raise_exception=True)

        prompt = serializers.validated_data["prompt"]

        # Gemini Model Configuration
        generation_config = {
                "temperature": 0.9,
                "top_p": 1,
                "top_k": 1,
                "max_output_tokens": 2048,
            }

        safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]

        # Generate response using Gemini model
        model = genai.GenerativeModel(
                model_name="gemini-pro",
                generation_config=generation_config,
                safety_settings=safety_settings,
            )
        response = model.generate_content([prompt])
        generated_response = response.text.strip()

        # Create a new Chat object
        chat = Chat.objects.create(
            user=request.user if request.user.is_authenticated else None,
            prompt=prompt,
            message=generated_response
        )

        # Return response
        if isinstance(response, str):
            return Response({
                "status": "error",
                "prompt": generated_response,
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "status": "success",
                "response": generated_response,
                "message": "Chat created successfully!"
            }, status=status.HTTP_201_CREATED)

class AllChatLogsView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializers
    queryset = Chat.objects.all()

class UserChatLogsView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializers

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(user=user)


class SingleChatView(RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializers
    queryset = Chat.objects.all()