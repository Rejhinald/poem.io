import os

# Generative AI (Google Gemini)
import google.generativeai as genai

# Rest Framework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

# Models
from .models import Chat

# Serializers
from .serializers import ChatSerializers

# Google Gemini Key
genai.configure(api_key=os.environ["API_KEY"])

class ChatCreateView(CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializers = ChatSerializers(data=request.data)    
        serializers.is_valid(raise_exception=True)

        prompt = serializers.validated_data["prompt"]

        # Gemini Model Configuration

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
