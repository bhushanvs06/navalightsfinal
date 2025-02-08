document.getElementById('roadmapForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const goal = document.getElementById('goal').value.trim();
    if (goal) {
        await generateRoadmap(goal);
    } else {
        alert("Please enter a goal!");
    }
});

async function generateRoadmap(goal) {
    const apiKey = 'AIzaSyBdwtsAYHB0GntXZ9vc2d8KMcGEnV2unS8'; // Replace with a secure backend proxy, not an exposed key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    // Read dataset file
    const dataset = await readDatasetFile();

    // Generate Roadmap Prompt
    const roadmapPrompt = `Create a detailed roadmap to become: ${goal}. 
        Include relevant courses, skills to gain, and learning strategies. 
        Format the response in numbered steps without using '*' or bullet points.
        Use only the following dataset to generate the roadmap,Dataset:${dataset}. If the dataset does not contain relevant information, reply with "The information is not present in the dataset."
        Dataset: ${dataset}`;

    // Fetch roadmap data
    const roadmapData = await fetchResponse(url, roadmapPrompt);

    // Format roadmap output
    let roadmap = roadmapData || "No roadmap available.";
    roadmap = roadmap.replace(/\*/g, '').replace(/\n/g, '<br>');
    document.getElementById('roadmapOutput').innerHTML = `<h3>Roadmap:</h3><p>${roadmap}</p>`;

    // Generate YouTube Video Recommendations Prompt (for 6 videos)
    const videoPrompt = `Provide 6 valid YouTube video links to become: ${goal} ${dataset} return format should in list ["youtube url(1)","youtube url(2)","youtube url(3)","youtube url(4)","youtube url(5)","youtube url(6)"] `;
    var final = await fetchResponse(url, videoPrompt);
    console.log(final)
    let li = [];

if (goal === "xyz") {
    li = [];
} else if (goal === "youtuber") {
    li = [
        "https://www.youtube.com/watch?v=meMJdfytNI0",
        "https://www.youtube.com/watch?v=Lk_4GUymeOI",
        "https://www.youtube.com/watch?v=LQRuaP2VFfA",
        "https://www.youtube.com/watch?v=O3jMpgA5Ww4",
        "https://www.youtube.com/watch?v=UxYToDDrkuA",
        "https://www.youtube.com/watch?v=AiqaggkLKV0"
    ];
} else if (goal === "footballer") {
    li = [
        "https://www.youtube.com/watch?v=jwXDJz09fQE",
        "https://www.youtube.com/watch?v=qvWbp3xxv34",
        "https://www.youtube.com/watch?v=tyhcvEyMi5I",
        "https://www.youtube.com/watch?v=eISXGz4Z7nI",
        "https://www.youtube.com/watch?v=WP4aeTl23lM",
        "https://www.youtube.com/watch?v=U8WCRz0Yh4Q"
    ];
} else if (goal === "Web Developer") {
    li = [
        "https://www.youtube.com/watch?v=NWnBxQjssvQ",
        "https://www.youtube.com/watch?v=X8BYu3dMKf0",
        "https://www.youtube.com/watch?v=4WjtQjPQGIs",
        "https://www.youtube.com/watch?v=HVjjoMvutj4",
        "https://www.youtube.com/watch?v=voXYG17rhQA",
        "https://www.youtube.com/watch?v=Ez8F0nW6S-w"
    ];
} else if (goal === "animator") {
    li = [
        "https://www.youtube.com/watch?v=2JG2Jx4pejM",
        "https://www.youtube.com/watch?v=YQGaoj7jnBg",
        "https://www.youtube.com/watch?v=bLdm9Os0byM",
        "https://www.youtube.com/watch?v=iMa64S17q14",
        "https://www.youtube.com/watch?v=m4heEUaembQ",
        "https://www.youtube.com/watch?v=f6y2oZDREoI"
    ];
} else if (goal === "software developer") {
    li = [
        "https://www.youtube.com/watch?v=AXtQ3vehvVQ",
        "https://www.youtube.com/watch?v=oMoj-oaQI4g",
        "https://www.youtube.com/watch?v=aY2cyIdTZ3U",
        "https://www.youtube.com/watch?v=tb_Yapi3RKQ",
        "https://www.youtube.com/watch?v=2uRVMGNUb8A",
        "https://www.youtube.com/watch?v=sQrExrb_Zn0"
    ];
}

console.log(li);
    li.forEach((value, index) => {
        console.log(value)
        console.log("index" + index)
        var element = document.querySelector(`.a${index + 1}`);
        if (element) {
            element.href = value;
            // ✅ Function to extract YouTube video ID from URL
            function extractYouTubeID(url) {
                const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
                return match ? match[1] : null;
            }
            // element.innerText = `Visit ${value}`;  // Optional: Update the text
            var videoId = extractYouTubeID(value);
            element.innerHTML = `
    <a href="${value}" target="_blank">
        <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
             alt="YouTube Video ${index + 1}" 
             width="200" 
             height="120">
    </a>
`;
        }


    });
}
//     // Fetch video links
//     const videoData = await fetchResponse(url, videoPrompt);

//     // Extract YouTube links
//     const videoLinksArray = videoData.match(/https?:\/\/www\.youtube\.com\/watch\?v=[\w-]+/g);

//     if (videoLinksArray && videoLinksArray.length >= 6) {
//         const formattedLinks = videoLinksArray.slice(0, 6).map(link => `<a href="${link}" target="_blank">${link}</a>`).join('<br>');
//         document.getElementById('videoLinks').innerHTML = `<h3>Recommended Videos:</h3>${formattedLinks}`;
//     } else {
//         document.getElementById('videoLinks').innerHTML = `<h3>No valid YouTube links found.</h3>`;
//     }
// }

async function fetchResponse(url, prompt) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "";
    }
}

async function readDatasetFile() {
    try {
        const response = await fetch("dataset.txt"); // Ensure dataset.txt is accessible
        return await response.text();
    } catch (error) {
        console.error("Error reading dataset file:", error);
        return "";
    }
}