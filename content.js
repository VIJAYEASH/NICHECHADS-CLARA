(function () {

    // Prevent duplicate CLARA panels
    if (document.getElementById("clara-security-panel")) {
        return;
    }

    function createPanel(data) {

        if (document.getElementById("clara-security-panel")) {
            return;
        }

        const risk = Number(data.risk_score ?? 0);
        const verdict = data.verdict || "unknown";

        let color = "#22c55e";
        let icon = "✓";

        if (verdict === "suspicious") {
            color = "#f59e0b";
            icon = "!";
        }

        if (verdict === "malicious") {
            color = "#ef4444";
            icon = "!";
        }

        const panel = document.createElement("div");

        panel.id = "clara-security-panel";

        panel.innerHTML = `
            <div style="
                font-family: Arial, sans-serif;
                width: 330px;
                padding: 18px;
                border-radius: 18px;
                background: #07101d;
                color: #f8fafc;
                border: 1px solid ${color}55;
                box-shadow: 0 15px 45px rgba(0,0,0,.45);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:14px;
                ">

                    <div style="
                        display:flex;
                        align-items:center;
                        gap:9px;
                    ">

                        <img
                            src="${chrome.runtime.getURL("clara-logo.png")}"
                            style="
                                width:35px;
                                height:35px;
                                object-fit:contain;
                                border-radius:9px;
                            "
                        >

                        <div>
                            <div style="
                                font-size:18px;
                                font-weight:800;
                            ">
                                CLARA
                            </div>

                            <div style="
                                color:#22d3ee;
                                font-size:9px;
                            ">
                                signal cathedral
                            </div>
                        </div>

                    </div>

                    <button id="clara-close" style="
                        background:none;
                        border:none;
                        color:#64748b;
                        font-size:20px;
                        cursor:pointer;
                    ">
                        ×
                    </button>

                </div>


                <div style="
                    display:flex;
                    align-items:center;
                    gap:12px;
                    padding:13px;
                    border-radius:13px;
                    background:${color}12;
                    border:1px solid ${color}25;
                ">

                    <div style="
                        width:43px;
                        height:43px;
                        border-radius:50%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:${color}20;
                        border:2px solid ${color};
                        color:${color};
                        font-size:22px;
                        font-weight:bold;
                    ">
                        ${icon}
                    </div>

                    <div>

                        <div style="
                            color:${color};
                            font-size:17px;
                            font-weight:800;
                        ">
                            ${verdict.toUpperCase()}
                        </div>

                        <div style="
                            color:#94a3b8;
                            font-size:10px;
                            margin-top:3px;
                        ">
                            Risk Score: ${risk}/100
                        </div>

                    </div>

                </div>


                <div style="
                    margin-top:14px;
                    font-size:11px;
                    font-weight:800;
                    color:#22d3ee;
                ">
                    CLARA EXPLAIN
                </div>


                <div id="clara-reasons" style="
                    margin-top:7px;
                    max-height:125px;
                    overflow:auto;
                ">
                </div>


                <div style="
                    margin-top:12px;
                    color:#475569;
                    font-size:8px;
                    text-align:center;
                ">
                    Automatic AI-powered website analysis
                </div>

            </div>
        `;


        panel.style.position = "fixed";
        panel.style.top = "20px";
        panel.style.right = "20px";
        panel.style.zIndex = "2147483647";


        document.body.appendChild(panel);


        const reasonsContainer =
            document.getElementById("clara-reasons");


        const reasons =
            Array.isArray(data.reasons)
                ? data.reasons
                : [];


        if (reasons.length === 0) {

            reasonsContainer.innerHTML = `
                <div style="
                    color:#cbd5e1;
                    font-size:10px;
                    padding:6px 0;
                ">
                    ✓ No suspicious indicators detected
                </div>
            `;

        } else {

            reasons.forEach(reason => {

                const item =
                    document.createElement("div");

                item.style.cssText = `
                    display:flex;
                    gap:7px;
                    align-items:flex-start;
                    padding:5px 0;
                    color:#cbd5e1;
                    font-size:9px;
                    line-height:14px;
                `;

                item.innerHTML = `
                    <span style="
                        color:${color};
                        font-weight:bold;
                    ">
                        ${verdict === "safe" ? "✓" : "!"}
                    </span>

                    <span></span>
                `;

                item.querySelector("span:last-child")
                    .textContent = reason;

                reasonsContainer.appendChild(item);

            });

        }


        document
            .getElementById("clara-close")
            .addEventListener(
                "click",
                () => panel.remove()
            );

    }


    // Ask background service worker for
    // the current tab's latest scan result.

    chrome.runtime.sendMessage({
        type: "GET_CURRENT_SCAN"
    });


    chrome.runtime.onMessage.addListener(
        (message) => {

            if (
                message.type === "CLARA_SCAN_RESULT" &&
                message.data
            ) {

                createPanel(message.data);

            }

        }
    );

})();