function calculateScores() {
    const allInputs = document.querySelectorAll('.score');
    allInputs.forEach(input => {
        let val = parseInt(input.value);
        if (val < 1) input.value = 1;
        if (val > 5) input.value = 5;
    });

    const s1 = Array.from(document.querySelectorAll('.sec1')).reduce((acc, i) => acc + parseInt(i.value || 0), 0);
    const s2 = Array.from(document.querySelectorAll('.sec2')).reduce((acc, i) => acc + parseInt(i.value || 0), 0);
    const s3 = Array.from(document.querySelectorAll('.sec3')).reduce((acc, i) => acc + parseInt(i.value || 0), 0);

    document.getElementById('pill-sec1').innerText = `${s1} / 20`;
    document.getElementById('pill-sec2').innerText = `${s2} / 15`;
    document.getElementById('pill-sec3').innerText = `${s3} / 15`;

    const total = s1 + s2 + s3;
    const max = 50;
    const percent = ((total / max) * 100).toFixed(1);
    
    document.getElementById('grandTotal').innerText = `${total} / ${max}`;
    document.getElementById('percentage').innerText = `${percent}%`;

    const standing = document.getElementById('standing-text');
    if (percent >= 90) { standing.innerText = "Excellent"; standing.style.color = "#27ae60"; }
    else if (percent >= 75) { standing.innerText = "Good"; standing.style.color = "#2ecc71"; }
    else if (percent >= 50) { standing.innerText = "Needs Improvement"; standing.style.color = "#f39c12"; }
    else { standing.innerText = "Poor"; standing.style.color = "#e74c3c"; }
}

window.onload = calculateScores;

async function runAISummary() {
    const apiKey = "AIzaSyAB53oOLC6Rn_4Gid2Ub6xLc8_p1H4ATWc";
    const output = document.getElementById('ai-output');
    const name = document.getElementById('empName').value || "the employee";
    const totalScore = document.getElementById('grandTotal').innerText;
    const status = document.getElementById('standing-text').innerText;

    output.innerText = "Analyzing performance standing and metrics...";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Summarize the performance of ${name}. Overall Score: ${totalScore}. Standing: ${status}. Focus on operational discipline, leadership ability, and growth impact.` }] }]
            })
        });
        const result = await response.json();
        output.innerText = result.candidates[0].content.parts[0].text;
    } catch (err) {
        output.innerText = "Error: Check your API key or internet connection.";
    }
}