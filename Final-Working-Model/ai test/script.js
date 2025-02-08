const API_KEY = "AIzaSyAgEz9UFJdJe7-28tQzid-xHahLZirdXqk"; // Replace with your actual API key
const chatBox = document.getElementById("chat-box");
const stopBtn = document.getElementById("stop-btn");

let recognitionInstance = null; // Store recognition globally

async function getGeminiResponse(prompt) {
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + API_KEY,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
    );

    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
}

function speak(text) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.onend = resolve;
        speechSynthesis.speak(utterance);
    });
}

function listen() {
    return new Promise((resolve) => {
        recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognitionInstance.lang = "en-US";
        recognitionInstance.start();

        recognitionInstance.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognitionInstance.onerror = (err) => {
            console.error("Speech recognition error:", err);
            resolve("");
        };

        recognitionInstance.onend = () => {
            resolve(""); // Resolve even if the recognition ends without results
        };
    });
}

function stopResponse() {
    speechSynthesis.cancel(); // Stop speech synthesis
    if (recognitionInstance) {
        recognitionInstance.abort(); // Stop voice recognition if active
    }
    const responseText = document.getElementById("response-text");
    if (responseText) {
        responseText.innerText = "Response stopped.";
    }
}

// Ensure stop button exists before adding event listener
if (stopBtn) {
    stopBtn.addEventListener("click", stopResponse);
}

// Read dataset file using fetch instead of fs (For Browsers)
async function readDatasetFile() {
    try {
        const response = await fetch("dataset.txt"); // Ensure dataset.txt is in the same folder as your HTML file
        const data = await response.text();
        console.log("Dataset Content:", data);
        return data;
    } catch (error) {
        console.error("Error reading dataset file:", error);
        return "";
    }
}

async function startTest() {
    const answers = {};
    let question = "What do you enjoy doing in your free time?";
    let datasetValue = await readDatasetFile(); // Fetch dataset content

    console.log(datasetValue); // Debugging

    for (let questionCount = 0; questionCount < 5; questionCount++) {
        chatBox.innerHTML += `<p class="ai-message"><strong>AI:</strong> ${question}</p>`;
        await speak(question); // AI speaks the question

        const userAnswer = await listen(); // User speaks their answer
        chatBox.innerHTML += `<p class="user-message"><strong>You:</strong> ${userAnswer}</p>`;
        answers[`Question ${questionCount + 1}`] = userAnswer;

        if (questionCount < 4) {
            const prompt = datasetValue + 
                ` Based on these answers: ${JSON.stringify(
                    answers
                )}, generate a follow-up question to understand the user’s interests and career preferences better.`;
            question = (await getGeminiResponse(prompt)).trim();
        }
    }

    const careerPrompt = `Based on these responses: ${JSON.stringify(
        answers
    )}, suggest the most suitable career path.`;
    const careerSuggestion = await getGeminiResponse(careerPrompt);

    chatBox.innerHTML += `<p class="ai-message"><strong>AI:</strong> Based on your responses, a suitable career for you is: ${careerSuggestion}</p>`;
    await speak("Based on your responses, a suitable career for you is " + careerSuggestion);
}
