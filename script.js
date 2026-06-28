// Switch tabs in UI
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// Global Core AI Engine Function 
async function askGemini(prompt) {
    const apiKey = document.getElementById('apiKey').value.trim();
    const outputContainer = document.getElementById('outputContainer');
    const outputLoader = document.getElementById('outputLoader');
    const outputText = document.getElementById('outputText');

    if (!apiKey) {
        alert("🔑 Please configure your Gemini API Key in the left sidebar first!");
        return;
    }

    // Reveal UI container elements
    outputContainer.classList.remove('hidden');
    outputLoader.classList.remove('hidden');
    outputText.innerText = "";

    try {
        // Direct REST endpoint for the Gemini 2.5 Flash Model
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Drill down path specific to Gemini JSON response architecture
            const generatedText = data.candidates[0].content.parts[0].text;
            outputText.innerText = generatedText;
        } else {
            outputText.innerText = `❌ Error: ${data.error.message || "Failed to contact API"}`;
        }
    } catch (err) {
        outputText.innerText = `❌ Connection Error: ${err.message}`;
    } finally {
        outputLoader.classList.add('hidden');
    }
}

// Processing Feature 1: Content Generator
function handleGenerate() {
    const type = document.getElementById('genType').value;
    const topic = document.getElementById('genTopic').value.trim();
    const keywords = document.getElementById('genKeywords').value.trim();

    if (!topic) return alert("Please fill in the topic.");

    let prompt = `Write a high-quality, professional ${type} about: "${topic}".`;
    if (keywords) prompt += ` Make sure to naturally include these keywords: ${keywords}.`;

    askGemini(prompt);
}

// Processing Feature 2: Summarizer
function handleSummarize() {
    const text = document.getElementById('sumText').value.trim();
    const style = document.getElementById('sumStyle').value;

    if (!text) return alert("Please paste text to summarize.");

    const prompt = `Summarize the following text. Format the output exactly as a ${style}.\n\nText:\n${text}`;
    askGemini(prompt);
}

// Processing Feature 3: Tone Transformer
function handleTransform() {
    const text = document.getElementById('transText').value.trim();
    const tone = document.getElementById('transTone').value;

    if (!text) return alert("Please enter text to change tone.");

    const prompt = `Rewrite the following text to perfectly match a "${tone}" tone. Retain all original facts and details:\n\n${text}`;
    askGemini(prompt);
}