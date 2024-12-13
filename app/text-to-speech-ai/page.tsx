"use client";

import { useState, useCallback } from "react";

export default function Home() {
    const [text, setText] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [voice, setVoice] = useState("21m00Tcm4TlvDq8ikWAM");
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const voices = [
        { id: "21m00Tcm4TlvDq8ikWAM", name: "Adam" },
        { id: "2EiwWnXFnvU5mMDegDb5", name: "Domi" },
        { id: "AZnzlk1XvdvUeBnXmlld", name: "Charlie" },
        { id: "EXAVITQu4vr4xnSDxMaL", name: "Rachel" },
    ];

    const generateSpeech = async () => {
        if (!text.trim()) {
            alert("Please enter text to synthesize");
            return;
        }

        if (!apiKey) {
            alert("Please enter your ElevenLabs API Key");
            return;
        }

        setIsLoading(true);
        setAudioUrl(null);

        try {
            const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voice, {
                method: "POST",
                headers: {
                    "Accept": "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": apiKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${errorText}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
        } catch (error) {
            console.error("Speech synthesis error:", error);
            alert("Failed to generate speech: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    const playAudio = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    return (
    <div className="container">
        <h2 className="border-bottom p-3 fs-5">ElevenLabs Text to Speech</h2>

        {/* API Key Input */}
        <div className="m-4">
            <input 
                type="password"
                className="form-control mb-3"
                placeholder="Enter ElevenLabs API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />

            {/* Voice Selection */}
            <select 
                className="form-select mb-3"
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
            >
                {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                        {v.name}
                    </option>
                ))}
            </select>

            {/* Text Input */}
            <textarea
                id="textInput"
                className="form-control"
                rows={10}
                placeholder="Enter the text you want to convert to speech..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
        </div>

        {/* Control Buttons */}
        <div className="d-flex">
            <button 
                className="btn btn-primary mt-3 me-4 ms-auto" 
                onClick={generateSpeech}
                disabled={!text.trim() || !apiKey || isLoading}
            >
                {isLoading ? 'Generating...' : 'Generate Speech'}
            </button>
            {audioUrl && (
                <button 
                    className="btn btn-success mt-3 me-4" 
                    onClick={playAudio}
                >
                    Play Audio
                </button>
            )}
        </div>

        {/* Audio Player (Optional) */}
        {audioUrl && (
            <div className="m-4">
                <audio 
                    src={audioUrl} 
                    controls 
                    className="w-100"
                ></audio>
            </div>
        )}
    </div>
    );
}