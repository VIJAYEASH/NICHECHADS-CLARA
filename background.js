const API_URL = "http://127.0.0.1:8000/analyze";

async function scanTab(tabId, url) {

    if (
        !url ||
        (!url.startsWith("http://") &&
         !url.startsWith("https://"))
    ) {
        return;
    }

    try {

        console.log("CLARA scanning:", url);

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url: url
            })
        });

        if (!response.ok) {
            throw new Error(
                `Backend error: ${response.status}`
            );
        }

        const data = await response.json();

        const result = {
            url: url,
            risk_score: data.risk_score ?? 0,
            ml_score: data.ml_score ?? 0,
            verdict: data.verdict ?? "unknown",
            reasons: data.reasons ?? [],
            timestamp: Date.now()
        };

        // Save latest result
        await chrome.storage.local.set({
            [`scan_${tabId}`]: result
        });

        // Badge
        const risk = Number(result.risk_score);

        await chrome.action.setBadgeText({
            tabId: tabId,
            text: String(risk)
        });

        if (result.verdict === "safe") {

            await chrome.action.setBadgeBackgroundColor({
                tabId: tabId,
                color: "#16a34a"
            });

        } else if (result.verdict === "suspicious") {

            await chrome.action.setBadgeBackgroundColor({
                tabId: tabId,
                color: "#f59e0b"
            });

        } else if (result.verdict === "malicious") {

            await chrome.action.setBadgeBackgroundColor({
                tabId: tabId,
                color: "#dc2626"
            });
        }

        // Send result to webpage
        try {

            await chrome.tabs.sendMessage(
                tabId,
                {
                    type: "CLARA_SCAN_RESULT",
                    data: result
                }
            );

        } catch (error) {

            console.log(
                "CLARA content script not ready yet."
            );
        }

    } catch (error) {

        console.error(
            "CLARA scan failed:",
            error
        );

        await chrome.action.setBadgeText({
            tabId: tabId,
            text: "!"
        });

        await chrome.action.setBadgeBackgroundColor({
            tabId: tabId,
            color: "#64748b"
        });
    }
}


// Automatically scan whenever a page finishes loading
chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => {

        if (
            changeInfo.status === "complete" &&
            tab.url
        ) {

            scanTab(tabId, tab.url);

        }
    }
);


// Send stored/current result when content.js asks
chrome.runtime.onMessage.addListener(
    async (message, sender) => {

        if (
            message.type === "GET_CURRENT_SCAN" &&
            sender.tab
        ) {

            const tabId = sender.tab.id;

            const stored =
                await chrome.storage.local.get(
                    `scan_${tabId}`
                );

            const result =
                stored[`scan_${tabId}`];

            if (result) {

                try {

                    await chrome.tabs.sendMessage(
                        tabId,
                        {
                            type: "CLARA_SCAN_RESULT",
                            data: result
                        }
                    );

                } catch (error) {

                    console.log(
                        "Unable to send stored result."
                    );
                }
            }
        }
    }
);