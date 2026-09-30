import os
try:
    from google.cloud import texttospeech
except ImportError:
    texttospeech = None

def synthesize_emergency_broadcast(message_text: str, output_path: str = "crow_advisory.mp3") -> tuple[str, bool]:
    """
    Generates a calm, authoritative guardian copilot warning using Google Cloud TTS with SSML.
    Returns: file_path, system_degraded flag
    """
    if texttospeech is None:
        print("google-cloud-texttospeech not installed. Mocking audio generation.")
        return output_path, True
        
    try:
        client = texttospeech.TextToSpeechClient()
        
        # Use a calm, empathetic, authoritative tone
        ssml_text = f"""
        <speak>
            <voice name="en-US-Journey-F">
                <prosody rate="slow" pitch="low">
                    This is your Project CROW Guardian. 
                    <break time="500ms"/>
                    {message_text}
                    <break time="500ms"/>
                    Please stay calm, and follow your evacuation plan.
                </prosody>
            </voice>
        </speak>
        """

        synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)

        # Build the voice request
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Journey-F" # Example of a potentially calmer/empathic voice if available, otherwise fallback to standard
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        # The response's audio_content is binary.
        with open(output_path, "wb") as out:
            out.write(response.audio_content)
            print(f'Audio content written to file "{output_path}"')
        
        return output_path, False
    except Exception as e:
        print(f"TTS API failed: {e}. Returning mock path.")
        return output_path, True
