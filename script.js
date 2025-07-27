:root {
    --bg-color: #f7f7f7; --container-bg: #fff; --text-color: #333; --secondary-text: #555;
    --border-color: #eee; --glass-border: #555; --accent-color: #4CAF50; --note-bg: #f0f0f0;
    --shadow-color: rgba(0,0,0,0.05); --active-btn-bg: #4CAF50; --active-btn-text: #fff;
}
.dark-mode {
    --bg-color: #121212; --container-bg: #1e1e1e; --text-color: #e0e0e0; --secondary-text: #aaa;
    --border-color: #333; --glass-border: #777; --accent-color: #5cb85c; --note-bg: #2a2a2a;
    --shadow-color: rgba(0,0,0,0.2); --active-btn-bg: #5cb85c;
}
body {
    font-family: 'Cairo', Arial, sans-serif; background-color: var(--bg-color); color: var(--text-color);
    text-align: center; padding: 20px; transition: background-color 0.3s, color 0.3s;
}
.container {
    position: relative; max-width: 800px; margin: 0 auto; background-color: var(--container-bg);
    padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px var(--shadow-color); transition: background-color 0.3s;
}
h1 { color: var(--accent-color); margin-bottom: 20px; }
#theme-toggle {
    position: absolute; top: 20px; right: 20px; background: none; border: 1px solid var(--border-color);
    color: var(--text-color); border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer;
    transition: background-color 0.3s, transform 0.2s; display: flex; justify-content: center; align-items: center;
}
#theme-toggle:hover { background-color: rgba(128,128,128,0.1); transform: scale(1.1); }

.input-area { display: flex; flex-direction: column; align-items: center; gap: 15px; margin-bottom: 20px; }
#input-label { font-weight: bold; font-size: 1.1em; margin-bottom: 0; }
input[type="text"], select {
    padding: 10px; width: 80%; max-width: 300px; font-size: 18px; border: 1px solid var(--border-color);
    background-color: var(--bg-color); color: var(--text-color); border-radius: 8px; text-align: center; font-family: 'Cairo', Arial, sans-serif;
}
select { text-align: center; padding-right: 29px; }
#waterSlider { width: 80%; max-width: 310px; cursor: pointer; }

.controls-container { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; width: 100%; max-width: 350px; }
.control-group { display: flex; justify-content: center; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); }
.control-group button {
    flex-grow: 1; background-color: transparent; border: none; padding: 10px; color: var(--text-color);
    font-family: 'Cairo', Arial, sans-serif; font-size: 16px; cursor: pointer; transition: background-color 0.3s;
    border-left: 1px solid var(--border-color);
}
.control-group button:last-child { border-left: none; }
.control-group button.active { background-color: var(--active-btn-bg); color: var(--active-btn-text); }
.control-label {
    font-weight: bold;
    color: var(--secondary-text);
    margin: 10px 0 5px 0;
}

.result { margin-top: 20px; font-size: 20px; padding: 15px; border-radius: 10px; display: inline-block; border: 1px solid var(--border-color); background-color: var(--bg-color); }
.result span, .note .value { color: red; font-weight: bold; }
.visual-container { display: flex; justify-content: center; gap: 100px; margin-top: 40px; flex-wrap: wrap; }
.glass-container { display: flex; flex-direction: column; align-items: center; }
.glass-title { font-size: 1.8em; font-weight: bold; margin-bottom: 15px; }
.glass {
    width: 168px; height: 225px; border-left: 2px dotted var(--glass-border); border-right: 2px dotted var(--glass-border);
    border-bottom: 2px solid var(--glass-border); position: relative; margin: 0 auto; border-radius: 0 0 15px 15px; background-color: transparent;
}
.scale { position: absolute; top: 0; height: 100%; width: 60px; }
.gram-scale { right: calc(100% + 5px); }
.percentage-scale { left: calc(100% + 5px); }
.scale div { position: absolute; width: 100%; font-size: 13px; font-weight: bold; white-space: nowrap; transform: translateY(50%); }
.gram-scale div { color: #007bff; padding-right: 15px; text-align: right; }
.dark-mode .gram-scale div { color: #58a6ff; }
.percentage-scale div { color: #28a745; padding-left: 15px; }
.dark-mode .percentage-scale div { color: #3fb950; }
.scale div::before { content: ''; position: absolute; width: 10px; height: 2px; background-color: var(--secondary-text); top: 50%; transform: translateY(-50%); }
.gram-scale div::before { right: 0; }
.percentage-scale div::before { left: 0; }

#sugarLevel, #teaLevel {
    position: absolute; left: 0; width: 100%; height: 0; background-color: rgba(230, 0, 0, 0.6);
    bottom: 0; border-radius: 0 0 13px 13px; transition: height 0.6s ease-out;
}
.note { margin-top: 15px; font-size: 1.1em; background-color: var(--note-bg); padding: 8px 15px; border-radius: 10px; font-weight: bold; }
.note .plus { color: blue; font-weight: bold; }
.footer-notes {
    margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color);
    font-size: 18px; line-height: 2; color: var(--text-color);
}
.footer-notes p { margin-bottom: 25px; }
.footer-notes .red-text { color: #dc3545; }
.dark-mode .footer-notes .red-text { color: #ff7b72; }
.footer-notes .green-text { color: #28a745; }
.dark-mode .footer-notes .green-text { color: #3fb950; }
.footer-notes .blue-text { color: #007bff; }
.dark-mode .footer-notes .blue-text { color: #58a6ff; }
.footer-notes .underlined-red {
    color: #dc3545; border-bottom: 2px solid var(--text-color); padding-bottom: 2px;
}
.dark-mode .footer-notes .underlined-red { color: #ff7b72; }
