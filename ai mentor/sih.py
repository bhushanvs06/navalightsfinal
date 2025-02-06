"""
Install the Google AI Python SDK

$ pip install google-generativeai

See the getting started guide for more information:
https://ai.google.dev/gemini-api/docs/get-started/python
"""

from gtts import gTTS
import pygame
import io
import os
import speech_recognition as sr
import pyttsx3
import subprocess
import csv
import google.generativeai as genai
import math
import time

pygame.mixer.init()

genai.configure(api_key="AIzaSyAgEz9UFJdJe7-28tQzid-xHahLZirdXqk")

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 800,
    "response_mime_type": "text/plain",
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    safety_settings=safety_settings,
    generation_config=generation_config,
)

chat_session = model.start_chat(history=[])

def speak(text, engine):
    engine.say(text)
    engine.runAndWait()

def get_male_voice(engine):
    """Attempts to find a male voice from the available system voices."""
    voices = engine.getProperty('voices')
    for voice in voices:
        if "Zira" in voice.name:  # Adjusted to search for "Zira" in voice names (Windows)
            engine.setProperty('voice', voice.id)
            return

def speak_text(text):
    tts = gTTS(text=text, lang='en')
    speech_bytes = io.BytesIO()
    tts.write_to_fp(speech_bytes)
    speech_bytes.seek(0)
    pygame.mixer.music.load(speech_bytes, 'mp3')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            print("ask me: " + text)
            return text
        except sr.UnknownValueError:
            print("Could not understand. Please can you repeat?")
            return None
        except sr.RequestError:
            print("Could not request results from Google Speech Recognition service")
            return None

def youtubedrama():
    response3 = "What do you want to play on YouTube?"
    engine = pyttsx3.init()
    speak(response3, engine)
    response2 = recognize_speech()
    if response2:  # Ensure there's a response before processing
        q = response2.split()
        r = '+'.join(q)
        print(r)
        url = "https://www.youtube.com/results?search_query=" + r
        subprocess.Popen(["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", url])

while True:
    ask = recognize_speech()
    if ask:
        print(ask.split())
        a = ask.split()
        t = [i.upper() for i in a]
        print(t)

        if "OPEN" in t:
            print()
        else:
            print("else")
            li = ""
            kq = "The following dataset for you: please try to answer the question from this data provided. This should be your first priority, then search for answers generally. Also, keep the answer as short as possible and don't use this *."
            file_path = 'testdata.txt'
            with open(file_path, 'r',encoding="utf-8") as file:
                content = file.read()
                li += content
            qw = kq + li + ask
            response = chat_session.send_message(qw)
            # Initialize pygame
            pygame.init()
            engine = pyttsx3.init()
            engine.setProperty('rate', 175)  # Slow down the speech rate slightly

            # Set up display
            screen = pygame.display.set_mode((400, 400))
            pygame.display.set_caption("Professional Mentor Character")

            # Define colors
            WHITE = (255, 255, 255)
            BLACK = (0, 0, 0)
            SKIN = (255, 224, 189)
            SUIT_BLUE = (10, 40, 70)
            TIE_RED = (180, 0, 0)
            GRAY = (160, 160, 160)

            # Draw the professional mentor character
            def draw_professional_mentor(mouth_shape, eyebrow_offset, hand_position):
                screen.fill(WHITE)

                # Draw head with sharper, more defined features
                pygame.draw.circle(screen, SKIN, (200, 150), 70)  # Head
                pygame.draw.line(screen, BLACK, (165, 170), (175, 180), 2)  # Left jawline
                pygame.draw.line(screen, BLACK, (235, 170), (225, 180), 2)  # Right jawline

                # Draw eyes with more professional, confident look
                pygame.draw.circle(screen, WHITE, (175, 130), 10)  # Left eye white
                pygame.draw.circle(screen, WHITE, (225, 130), 10)  # Right eye white
                pygame.draw.circle(screen, BLACK, (175, 130), 4)   # Left pupil
                pygame.draw.circle(screen, BLACK, (225, 130), 4)   # Right pupil

                # Draw professional glasses
                pygame.draw.circle(screen, BLACK, (175, 130), 15, 2)  # Left glasses frame
                pygame.draw.circle(screen, BLACK, (225, 130), 15, 2)  # Right glasses frame
                pygame.draw.line(screen, BLACK, (185, 130), (215, 130), 2)  # Glasses bridge

                # Draw eyebrows with dynamic offset
                pygame.draw.line(screen, BLACK, (160, 110 + eyebrow_offset), (190, 110 + eyebrow_offset), 2)  # Left eyebrow
                pygame.draw.line(screen, BLACK, (210, 110 + eyebrow_offset), (240, 110 + eyebrow_offset), 2)  # Right eyebrow

                # Draw a confident, professional mouth shape
                if mouth_shape == 0:
                    pygame.draw.arc(screen, BLACK, (185, 160, 30, 10), math.pi, 2 * math.pi, 2)  # Subtle, confident smile
                elif mouth_shape == 1:
                    pygame.draw.line(screen, BLACK, (185, 170), (215, 170), 3)  # Slightly open for speaking
                elif mouth_shape == 2:
                    pygame.draw.ellipse(screen, BLACK, (185, 165, 25, 10))  # Open mouth for emphasis

                # Draw professional suit with tie
                pygame.draw.rect(screen, SUIT_BLUE, (140, 210, 120, 100), border_radius=20)  # Suit jacket
                pygame.draw.polygon(screen, TIE_RED, [(200, 210), (190, 260), (210, 260)])  # Tie knot
                pygame.draw.rect(screen, TIE_RED, (195, 250, 10, 20))  # Tie bottom

                # Draw arms with slight hand movement
                pygame.draw.rect(screen, SKIN, (140 + hand_position, 250, 20, 50), border_radius=10)  # Left arm
                pygame.draw.rect(screen, SKIN, (260 - hand_position, 250, 20, 50), border_radius=10)  # Right arm

                pygame.display.flip()

            # Function to animate the mentor speaking professionally
            def speak(text):
                # Configure pyttsx3 to play the speech and capture duration
                engine.save_to_file(text, 'speech.mp3')
                engine.runAndWait()

                pygame.mixer.init()
                sound = pygame.mixer.Sound('speech.mp3')
                sound.play()

                start_time = time.time()
                while time.time() - start_time < sound.get_length():
                    elapsed_time = time.time() - start_time
                    mouth_shape = int(elapsed_time * 5) % 3  # Change mouth shape for speaking
                    eyebrow_offset = int(5 * math.sin(elapsed_time * 3))  # Move eyebrows up and down
                    hand_position = int(5 * math.sin(elapsed_time * 2))  # Minor hand movement for emphasis

                    draw_professional_mentor(mouth_shape, eyebrow_offset, hand_position)

                    for event in pygame.event.get():
                        if event.type == pygame.QUIT:
                            pygame.quit()
                            return

                    pygame.time.delay(50)

                pygame.mixer.quit()

            # Main loop to run the animation
            print(response.text)
            speak(response.text)
            # Main loop
            

    print("nothing done")
