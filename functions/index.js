const functions = require("firebase-functions");
const https = require("https");

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve(data));
        }).on("error", reject);
    });
}

exports.fetchDCP = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");

    const clubId = req.query.clubId;
    const districtId = req.query.districtId;

    if (!clubId || !districtId) {
        res.status(400).json({ error: "clubId and districtId are required" });
        return;
    }

    try {
        const [clubHtml, districtHtml] = await Promise.all([
            fetchUrl(`https://dashboards.toastmasters.org/ClubReport.aspx?id=${clubId}`),
            fetchUrl(`https://dashboards.toastmasters.org/Club.aspx?id=${districtId}`)
        ]);

        res.json({ club: clubHtml, district: districtHtml });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});