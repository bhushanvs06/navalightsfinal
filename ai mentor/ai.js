const API_KEY = "AIzaSyAgEz9UFJdJe7-28tQzid-xHahLZirdXqk";
const speakBtn = document.getElementById("speak-btn");
const stopBtn = document.getElementById("stop-btn");
const responseText = document.getElementById("response");
let recognition;

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
}

function stopResponse() {
    speechSynthesis.cancel(); // Stop speech synthesis
    if (recognition) {
        recognition.abort(); // Stop voice recognition if active
    }
    responseText.innerText = "Response stopped.";
}

function listenSpeech() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        responseText.innerText = `You said: ${transcript}`;
        fetchAIResponse(transcript);
    };

    recognition.start();
}

async function fetchAIResponse(query) {
    try {
        const dataset = await fetch('dataset.txt')
            .then(res => res.text())
            .catch(err => { throw new Error("Failed to load dataset: " + err); });

        console.log("Dataset Loaded:", dataset);

        const datasetLines = dataset.toLowerCase().split("\n").map(line => line.trim());
        const queryLower = query.toLowerCase();
        const matchingLines = datasetLines.filter(line => queryLower.includes(line) || line.includes(queryLower));

        if (matchingLines.length === 0) {
            responseText.innerText = "Sorry, I can only answer based on the dataset.";
            return;
        }

        const prompt = `Dataset: ${dataset}\nUser Query: ${query}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
            throw new Error("Invalid AI response structure.");
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        responseText.innerText = aiResponse;
        speakText(aiResponse);

    } catch (error) {
        console.error("Error:", error);
        responseText.innerText = "Error fetching AI response. Check console for details.";
    }
}

speakBtn.addEventListener("click", listenSpeech);
stopBtn.addEventListener("click", stopResponse);
