document.getElementById('roadmapForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const goal = document.getElementById('goal').value.trim();
    if (goal) {
        generateRoadmap(goal);
    } else {
        alert("Please enter a goal!");
    }
});

async function generateRoadmap(goal) {
    const apiKey = 'AIzaSyBdwtsAYHB0GntXZ9vc2d8KMcGEnV2unS8'; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    // Generate Roadmap
    var datas = readDatasetFile()
    const roadmapPrompt = `Create a detailed roadmap to become: ${goal}. with which course to take? what skills to gain and also how to gain? Format the response in numbered steps without using '*' or bullet points.also "`;
    const roadmapResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: roadmapPrompt }] }]
        })
    });

    const roadmapData = await roadmapResponse.json();
    let roadmap = roadmapData?.candidates?.[0]?.content?.parts?.[0]?.text || "No roadmap available.";

    // Format the roadmap properly
    roadmap = roadmap.replace(/\*/g, '').replace(/\n/g, '<br>');

    document.getElementById('roadmapOutput').innerHTML = `<h3>Roadmap:</h3><p>${roadmap}</p>`;

    // Fetch YouTube Video Links
    var datas = readDatasetFile()
    const videoPrompt = `Provide 3 YouTube valid video links to become: ${goal} and study from this "${datas}". Format the response as plain URLs only.`;
    const videoResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: videoPrompt }] }]
        })
    });

    const videoData = await videoResponse.json();
    const videoText = videoData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract YouTube links
    const videoLinksArray = videoText.match(/https?:\/\/www\.youtube\.com\/watch\?v=[\w-]+/g);

    if (videoLinksArray) {
        const formattedLinks = videoLinksArray.map(link => `<a href="${link}" target="_blank">${link}</a>`).join('<br>');
        document.getElementById('videoLinks').innerHTML = `<h3>Recommended Videos:</h3>${formattedLinks}`;
    } else {
        document.getElementById('videoLinks').innerHTML = `<h3>No valid YouTube links found.</h3>`;
    }
}
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
