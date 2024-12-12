"use client";

import { useState, useCallback } from "react";

export default function Home() {
    const [text, setText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback(() => {
        // Check browser support
        if ('speechSynthesis' in window) {
            // Stop previous speech
            window.speechSynthesis.cancel();

            // Create speech synthesis object
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Select voice
            const voices = window.speechSynthesis.getVoices();
            
            // Try to find English voice (prioritize US English)
            const englishVoice = voices.find(
                voice => voice.lang === 'en-US' || 
                         voice.lang.startsWith('en-') ||
                         voice.name.includes('English')
            );

            if (englishVoice) {
                utterance.voice = englishVoice;
            }

            // Set parameters
            utterance.rate = 1.0;  // Speech rate
            utterance.pitch = 1.0; // Pitch
            utterance.volume = 1.0; // Volume

            // Event listeners
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (event) => {
                console.error('Speech synthesis error', event);
                setIsSpeaking(false);
            };

            // Start speech synthesis
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Your browser does not support text-to-speech");
        }
    }, [text]);

    // Initialize by loading available voices
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
    };

    return (
    <>
        <h2 className="border-bottom p-3 fs-5">Text to Speech</h2>

        {/* Text input area */}
        <div className="m-4">
            <textarea
                id="textInput"
                className="form-control"
                rows={10}
                placeholder="Enter the text you want to convert to speech..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
        </div>

        {/* Control buttons */}
        <div className="d-flex">
            <button 
                className="btn btn-primary mt-3 me-4 ms-auto" 
                onClick={speak}
                disabled={!text.trim() || isSpeaking}
            >
                {isSpeaking ? 'Speaking...' : 'Generate Speech'}
            </button>
            
        </div>
    </>
    );
}