from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware
import ipaddress
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os
import joblib
import pandas as pd
load_dotenv(override=True)

SAFE_BROWSING_API_KEY = os.getenv("SAFE_BROWSING_API_KEY")

model = joblib.load("ml/phishing_model.pkl")
feature_columns = joblib.load("ml/feature_columns.pkl")
def extract_features(url):
    from urllib.parse import urlparse
    import re

    url = str(url)
    parsed = urlparse(url)
    domain = parsed.netloc

    return {
        "URLLength": len(url),
        "DomainLength": len(domain),
        "IsDomainIP": int(bool(re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain))),
        "NoOfSubDomain": max(len(domain.split(".")) - 2, 0),
        "HasObfuscation": int("@" in url or "%" in url),
        "NoOfObfuscatedChar": url.count("%"),
        "NoOfLettersInURL": sum(c.isalpha() for c in url),
        "NoOfDegitsInURL": sum(c.isdigit() for c in url),
        "NoOfEqualsInURL": url.count("="),
        "NoOfQMarkInURL": url.count("?"),
        "NoOfAmpersandInURL": url.count("&"),
        "NoOfOtherSpecialCharsInURL": sum(
            not c.isalnum() and c not in "/.:?&=_-%"
            for c in url
        ),
        "IsHTTPS": int(parsed.scheme == "https"),
        "HasLoginKeyword": int(any(
            word in url.lower()
            for word in ["login", "signin", "verify", "account", "secure", "update"]
        )),
        "HasSuspiciousKeyword": int(any(
            word in url.lower()
            for word in ["paypal", "bank", "password", "confirm", "wallet", "crypto"]
        )),
    }


def get_ml_prediction(url):
    features = extract_features(url)

    df = pd.DataFrame([features])

    df = df.reindex(columns=feature_columns, fill_value=0)

    probability = model.predict_proba(df)[0]

    # 0 = phishing, 1 = legitimate
    phishing_probability = probability[0]

    return round(float(phishing_probability) * 100, 2)
cred = credentials.Certificate("clara-41873-firebase-adminsdk-fbsvc-c3f72a9f80.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {
        "message": "PhishGuard AI Backend is running!"
    }


class URLRequest(BaseModel):
    url: HttpUrl

@app.post("/analyze")
def analyze_url(request: URLRequest):
    url = str(request.url)
    ml_score = get_ml_prediction(url)

    risk_score = 10
    reasons = []

    # HTTPS check
    if not url.startswith("https://"):
        risk_score += 30
        reasons.append("HTTPS is not enabled")
    else:
        reasons.append("HTTPS is enabled")

    # URL length check
    if len(url) > 75:
        risk_score += 20
        reasons.append("URL is unusually long")
    else:
        reasons.append("URL length is normal")
          # IP address check
    try:
        hostname = request.url.host
        ipaddress.ip_address(hostname)
        risk_score += 25
        reasons.append("IP address is used instead of a domain name")
    except ValueError:
        reasons.append("Normal domain name is used")
         # Suspicious @ symbol check
    if "@" in url:
        risk_score += 25
        reasons.append("Suspicious @ symbol detected in URL")
    else:
        reasons.append("No suspicious @ symbol detected")
            # Suspicious keywords
    suspicious_keywords = [
        "login", "verify", "verification", "secure",
        "account", "update", "password", "bank",
        "wallet", "confirm", "signin"
    ]

    found_keywords = []

    for keyword in suspicious_keywords:
        if keyword in url.lower():
            found_keywords.append(keyword)

    if found_keywords:
        risk_score += min(len(found_keywords) * 5, 20)
        reasons.append(
            f"Suspicious keywords detected: {', '.join(found_keywords)}"
        )

    # Too many subdomains
    hostname = request.url.host

    if hostname and hostname.count(".") >= 3:
        risk_score += 15
        reasons.append("Too many subdomains detected")

    # Hyphen check
    if hostname and hostname.count("-") >= 2:
        risk_score += 10
        reasons.append("Multiple hyphens detected in domain")

    # Final score limit
   
   
        # Google Safe Browsing check
    safe_browsing_url = (
        "https://safebrowsing.googleapis.com/v4/threatMatches:find"
        f"?key={SAFE_BROWSING_API_KEY}"
    )

    payload = {
        "client": {
            "clientId": "clara",
            "clientVersion": "1.0"
        },
       "threatInfo": {
    "threatTypes": [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION"
    ],
    "threatEntryTypes": ["URL"],
    "threatEntries": [
        {"url": url}
    ]
}
    }

    try:
        sb_response = requests.post(
            safe_browsing_url,
            json=payload,
            timeout=5
        )

        if sb_response.status_code == 200:
            threats = sb_response.json().get("matches", [])

            if threats:
                risk_score += 50
                reasons.append(
                    "Google Safe Browsing detected this URL as unsafe"
                )
            else:
                reasons.append(
                    "Google Safe Browsing found no known threat"
                )
        else:
            reasons.append(
                f"Google Safe Browsing error: "
                f"{sb_response.status_code} - {sb_response.text}"
            )

    except requests.RequestException:
        reasons.append("Google Safe Browsing request failed")
        
        # Keep risk score between 0 and 100
        risk_score = min(risk_score, 100)

    # Live URL check
    try:
        response = requests.get(
            url,
            timeout=5,
            allow_redirects=True
        )

        reasons.append(f"Website responded with status {response.status_code}")

        if response.url != url:
            reasons.append(f"Redirected to: {response.url}")

    except requests.RequestException:
        reasons.append("Website could not be reached")

    

    # Final verdict
    if risk_score >= 80:
        verdict = "malicious"
    elif risk_score >= 30:
        verdict = "suspicious"
    else:
        verdict = "safe"
    db.collection("scan_history").add({
    "url": url,
    "verdict": verdict,
    "risk_score": risk_score,
    "reasons": reasons,
    "timestamp": firestore.SERVER_TIMESTAMP
})
    return {
    "url": str(url),
    "risk_score": risk_score,
    "ml_score": ml_score,
    "verdict": verdict,
    "reasons": reasons
}