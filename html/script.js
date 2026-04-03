let audioOn = false;
const ALL_SND = ["snd-rain", "snd-wind", "snd-thunder", "snd-zombie", "snd-meteor", "snd-ai", "snd-sun", "snd-cloudy", "snd-snow"];

function toggleAudio() {
    audioOn = !audioOn;
    const btn = document.getElementById('audio-btn');
    if (audioOn) {
        btn.innerText = "🔊 SOUND ON";
        ALL_SND.forEach(id => {
            const s = document.getElementById(id);
            if (s) s.play().then(() => s.pause()).catch(() => {});
        });
        applyFX(document.getElementById('status').innerText);
    } else {
        btn.innerText = "🔇 ENABLE SOUND";
        stopAllS();
    }
}

function stopAllS() {
    ALL_SND.forEach(id => {
        const s = document.getElementById(id);
        if (s) { s.pause(); s.currentTime = 0; }
    });
}

function playS(id) { if(audioOn) { const s = document.getElementById(id); if (s) s.play().catch(() => {}); } }

const MAP = { 0: "Clear", 3: "Cloudy", 63: "Rainy", 71: "Snowy", 95: "Stormy" };
const ICONS = { 0: "☀️", 3: "☁️", 63: "🌧️", 71: "❄️", 95: "⚡" };

async function init() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max');
        const data = await res.json();
        updateDisp(Math.round(data.current.temperature_2m), MAP[data.current.weather_code] || "Clear");
        const rf = document.getElementById('real-f');
        for (let i = 1; i <= 5; i++) createDay(rf, new Date(data.daily.time[i]).toLocaleDateString('en', { weekday: 'short' }), Math.round(data.daily.temperature_2m_max[i]), data.daily.weather_code[i]);
        const df = document.getElementById('demo-f');
        Object.entries(MAP).forEach(([c, s]) => createDay(df, "Demo", 25, c, s));
        applyFX(MAP[data.current.weather_code] || "Clear");
    } catch (e) { document.getElementById('status').innerText = "Offline"; }
}

function createDay(p, n, t, c, fs = null) {
    const s = fs || MAP[c] || "Clear";
    const el = document.createElement('div');
    el.className = 'day-card';
    el.innerHTML = `<div>${n}</div><div style="font-size:1.5rem;margin:5px 0">${ICONS[c] || "☀️"}</div><div>${t}°</div>`;
    el.onclick = () => { updateDisp(t, s); applyFX(s); };
    p.appendChild(el);
}

function updateDisp(t, s) { document.getElementById('current-temp').innerText = `${t}°C`; document.getElementById('status').innerText = s; }

function applyFX(s) {
    stopAllS();
    const bg = document.getElementById('effects-bg');
    bg.innerHTML = '';
    document.getElementById('lightning-bolt').style.animation = 'none';
    document.getElementById('blood-fog').style.opacity = '0';
    document.getElementById('scanner').style.display = 'none';
    document.getElementById('main-cont').classList.remove('shake');
    document.body.style.background = "#02040a";

    if (s === "Clear") {
        document.body.style.background = "#0c4a6e";
        playS('snd-sun');
        spawn(bg, 'sun-aura');
    } else if (s === "Cloudy") {
        document.body.style.background = "#334155";
        playS('snd-cloudy');
        for (let i = 0; i < 6; i++) spawn(bg, 'cloud');
    } else if (s.includes("Rainy")) {
        document.body.style.background = "#0f172a";
        playS('snd-rain');
        for (let i = 0; i < 100; i++) spawn(bg, 'rain-drop');
    } else if (s.includes("Snowy")) {
        document.body.style.background = "#1e293b";
        playS('snd-snow');
        for (let i = 0; i < 60; i++) spawn(bg, 'snow-flake');
    } else if (s === "Stormy") {
        document.body.style.background = "#020617";
        playS('snd-thunder');
        playS('snd-rain');
        document.getElementById('lightning-bolt').style.animation = 'flash 5s infinite';
        for (let i = 0; i < 120; i++) spawn(bg, 'rain-drop');
    }
}

function spawn(p, c, txt = null) {
    const el = document.createElement('div');
    el.className = c;
    el.style.left = Math.random() * 100 + 'vw';
    if (c === 'snow-flake') {
        el.style.width = el.style.height = Math.random() * 6 + 4 + 'px';
        el.style.animationDuration = Math.random() * 4 + 3 + 's';
    } else if (c === 'cloud') {
        el.style.top = Math.random() * 70 + 'vh';
        el.style.width = '400px';
        el.style.height = '200px';
        el.style.animationDuration = (Math.random() * 20 + 20) + 's';
        el.style.left = '-500px';
    } else {
        el.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
    }
    if (txt) el.innerText = txt;
    p.appendChild(el);
}

window.activateSpace = () => { applyFX('None'); playS('snd-meteor'); document.body.style.background = "#000"; document.getElementById('status').innerText = "METEOR SHOWER"; for (let i = 0; i < 25; i++) { const m = document.createElement('div'); m.className = 'meteor'; m.style.left = Math.random() * 100 + 'vw'; m.style.animationDelay = Math.random() * 5 + 's'; document.getElementById('effects-bg').appendChild(m); } };
window.activateZom = () => { isEggActive = true; applyFX('None'); playS('snd-zombie'); document.getElementById('blood-fog').style.opacity = '1'; document.getElementById('main-cont').classList.add('shake'); document.getElementById('status').innerText = "ZOMBIE FOG"; };
window.activateAI = () => { applyFX('None'); playS('snd-ai'); document.body.style.background = "#000"; document.getElementById('status').innerText = "AI OVERRIDE"; document.getElementById('scanner').style.display = 'block'; for (let i = 0; i < 50; i++) spawn(document.getElementById('effects-bg'), 'matrix', Math.random() > 0.5 ? 'SYSTEM_FAILURE' : '1010101'); };

init();
