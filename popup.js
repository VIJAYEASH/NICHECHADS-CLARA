async function showScanResult(data) {

    const verdictElement = document.getElementById("verdict");
    const scoreElement = document.getElementById("score");
    const riskRing = document.getElementById("riskRing");
    const mlElement = document.getElementById("ml");
    const securityElement = document.getElementById("security");
    const lastCheckedElement = document.getElementById("lastChecked");
    const iconElement = document.getElementById("icon");
    const reasonsElement = document.getElementById("reasons");
    const descriptionElement = document.getElementById("statusDescription");
    const urlElement = document.getElementById("url");

    const verdict = data.verdict || "unknown";
    const risk = Number(data.risk_score ?? 0);
    const ml = Number(data.ml_score ?? 0);

    scoreElement.textContent = `${risk}/100`;
    mlElement.textContent = `${ml}/100`;
    urlElement.textContent = data.url || "Unknown website";

    const degrees = Math.min(risk, 100) * 3.6;

    let mainColor = "#4ade80";

    if (verdict === "suspicious") {
        mainColor = "#f59e0b";
    }

    if (verdict === "malicious") {
        mainColor = "#ef4444";
    }

    riskRing.style.background = `
        conic-gradient(
            ${mainColor} 0deg,
            ${mainColor} ${degrees}deg,
            #1e293b ${degrees}deg,
            #1e293b 360deg
        )
    `;

    if (verdict === "safe") {

        iconElement.textContent = "✓";
        verdictElement.textContent = "SAFE";
        verdictElement.style.color = "#4ade80";

        securityElement.textContent = "Protected";
        securityElement.style.color = "#4ade80";

        descriptionElement.textContent =
            "This website appears safe to browse.";

    } else if (verdict === "suspicious") {

        iconElement.textContent = "!";
        verdictElement.textContent = "SUSPICIOUS";
        verdictElement.style.color = "#f59e0b";

        securityElement.textContent = "Be Careful";
        securityElement.style.color = "#f59e0b";

        descriptionElement.textContent =
            "Potential security risks detected.";

    } else if (verdict === "malicious") {

        iconElement.textContent = "!";
        verdictElement.textContent = "MALICIOUS";
        verdictElement.style.color = "#ef4444";

        securityElement.textContent = "Danger";
        securityElement.style.color = "#ef4444";

        descriptionElement.textContent =
            "This website may be dangerous.";

    }

    iconElement.style.borderColor = mainColor;
    iconElement.style.boxShadow =
        `0 0 30px ${mainColor}55`;

    reasonsElement.innerHTML = "";

    const reasons = Array.isArray(data.reasons)
        ? data.reasons
        : [];

    if (reasons.length === 0) {

        reasonsElement.innerHTML = `
            <div class="reason">
                <span class="reason-icon">✓</span>
                <span>No additional security information available.</span>
            </div>
        `;

    } else {

        reasons.forEach(reason => {

            const item = document.createElement("div");
            item.className = "reason";

            const icon = document.createElement("span");
            icon.className = "reason-icon";

            const text = document.createElement("span");
            text.textContent = reason;

            if (verdict === "safe") {
                icon.textContent = "✓";
                icon.style.background = "#22c55e";
            } else {
                icon.textContent = "!";
                icon.style.background = mainColor;
            }

            item.appendChild(icon);
            item.appendChild(text);

            reasonsElement.appendChild(item);
        });
    }

    const checkedTime = new Date(
        data.timestamp || Date.now()
    );

    lastCheckedElement.textContent =
        checkedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}


async function loadCurrentScan() {

    try {

        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const tab = tabs[0];

        if (!tab || !tab.id) {
            throw new Error("No active tab found.");
        }

        const currentUrl = tab.url;

        if (
            !currentUrl ||
            (
                !currentUrl.startsWith("http://") &&
                !currentUrl.startsWith("https://")
            )
        ) {
            throw new Error(
                "This page cannot be scanned."
            );
        }

        const stored = await chrome.storage.local.get(
            `scan_${tab.id}`
        );

        const result = stored[`scan_${tab.id}`];

        if (!result) {

            document.getElementById("verdict").textContent =
                "SCANNING...";

            document.getElementById("url").textContent =
                currentUrl;

            return;

        }

        await showScanResult(result);

    } catch (error) {

        document.getElementById("icon").textContent = "!";

        document.getElementById("verdict").textContent =
            "ERROR";

        document.getElementById("verdict").style.color =
            "#ef4444";

        document.getElementById("security").textContent =
            "Unavailable";

        document.getElementById("reasons").innerHTML = `
            <div class="reason">
                <span
                    class="reason-icon"
                    style="background:#ef4444;color:white;"
                >
                    !
                </span>

                <span>${error.message}</span>
            </div>
        `;
    }
}


document
    .getElementById("scanBtn")
    .addEventListener(
        "click",
        loadCurrentScan
    );


loadCurrentScan();