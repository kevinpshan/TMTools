/**
 * ROSTER MODULE v3.0.3
 * Handles Speaker list, Live Filtering, and Data Persistence
 */

// Load speakers from localStorage or start empty
let allSpeakers = JSON.parse(localStorage.getItem('prod_sdtm_speakers') || "[]");

/**
 * Renders the roster list with blue interactive names
 * @param {string} filter - The text to filter the names by
 */
function refreshRoster(filter = "") {
    const area = document.getElementById('speakerArea');
    if (!area) return;

    // Filter logic: match typing against the speaker list
    const filtered = allSpeakers.filter(n => 
        n.toLowerCase().includes(filter.toLowerCase())
    );

    // Generate HTML with Production Blue Names and Red X
    area.innerHTML = filtered.map(n => `
        <div class="roster-item">
            <span class="roster-name" onclick="selectSpeaker('${n}')">${n}</span>
            <span style="color:var(--red); font-weight:800; cursor:pointer; padding:10px; font-size:24px;" 
                  onclick="delSpeaker('${n}')">✕</span>
        </div>
    `).join('');
}

/**
 * Triggered by 'oninput' in index.html to filter results as you type
 */
function filterRoster() {
    const val = document.getElementById('nameInput').value;
    refreshRoster(val);
}

/**
 * Fills the input box when a blue name is tapped
 */
function selectSpeaker(name) {
    document.getElementById('nameInput').value = name;
    // Snap the list to only show the selected name (Production behavior)
    refreshRoster(name);
}

/**
 * Saves a new name to the list
 */
function saveSpeaker() {
    const input = document.getElementById('nameInput');
    const n = input.value.trim().toUpperCase();

    if (n && !allSpeakers.includes(n)) {
        allSpeakers.push(n);
        allSpeakers.sort();
        localStorage.setItem('prod_sdtm_speakers', JSON.stringify(allSpeakers));
        
        // Clear input and refresh
        input.value = "";
        refreshRoster();
    }
}

/**
 * Deletes a speaker using the Custom Modal instead of standard alert
 */
function delSpeaker(n) {
    // This calls the global modal function defined in app.js
    openCustomModal(
        "Delete Speaker?", 
        `Are you sure you want to remove ${n} from your permanent roster?`, 
        () => {
            allSpeakers = allSpeakers.filter(s => s !== n);
            localStorage.setItem('prod_sdtm_speakers', JSON.stringify(allSpeakers));
            refreshRoster();
        }
    );
}

// Initial draw of the roster when the script loads
refreshRoster();
