/* Consent-first GA4 for the dashboard only. Never inspect resume/form contents. */
(() => {
    "use strict";
    if (window.MechIntelAnalytics) return;
    const config = window.MECHINTEL_ANALYTICS_CONFIG || {};
    const id = typeof config.measurementId === "string" ? config.measurementId : "";
    const configured = /^G-[A-Z0-9]{6,20}$/.test(id) && !/^G-X+$/.test(id)
        && config.enhancedMeasurementDisabled === true;
    const storageKey = "mechintel.analytics-consent.v1";
    const consentAge = 180 * 86400000;
    const base = new URL(".", document.querySelector('link[rel="canonical"]').href);
    // Fixed canonical location and title: no query string, hash or user input.
    const page = { page_location: base.href, page_title: "MechIntel Engineering Career Dashboard" };
    let referrer = "";
    try { referrer = document.referrer ? new URL(document.referrer).origin + "/" : ""; } catch (_) {}
    const protectedBrowser = () => navigator.globalPrivacyControl === true
        || navigator.doNotTrack === "1" || window.doNotTrack === "1";
    let choice = null, started = false, failed = false;
    function readChoice() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            if (saved && ["granted", "denied"].includes(saved.value)
                && Number.isFinite(saved.at) && Date.now() >= saved.at && Date.now() - saved.at < consentAge) return saved.value;
        } catch (_) {}
        return null;
    }
    choice = readChoice();
    const events = Object.freeze({
        resume_uploaded: { input_type: ["pdf"] },
        analysis_started: { analysis_type: ["career_assessment"] },
        analysis_completed: { analysis_type: ["career_assessment"] },
        analysis_failed: { analysis_type: ["career_assessment"] },
        report_downloaded: { report_type: ["competency_matrix", "visual_portfolio"], file_format: ["csv", "html"] }
    });
    function allowed() { return configured && choice === "granted" && !protectedBrowser() && !failed; }
    function start() {
        if (!allowed() || started) return;
        started = true;
        window["ga-disable-" + id] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        // Basic consent mode: these commands are queued locally; the Google
        // library is not requested at all until affirmative consent is present.
        window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
        window.gtag("consent", "update", { analytics_storage: "granted" });
        window.gtag("js", new Date());
        window.gtag("config", id, {
            send_page_view: false, ...page, page_referrer: referrer,
            allow_google_signals: false, allow_ad_personalization_signals: false,
            cookie_domain: location.hostname, cookie_path: base.pathname,
            cookie_prefix: "mechintel", cookie_expires: 180 * 86400,
            cookie_flags: "SameSite=Lax;Secure",
            ...(config.debug === true ? { debug_mode: true } : {})
        });
        window.gtag("event", "page_view", { ...page, page_referrer: referrer, send_to: id });
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
        script.id = "mechintel-ga4-tag";
        script.onerror = () => { failed = true; window["ga-disable-" + id] = true; };
        document.head.append(script);
    }
    function track(name, values = {}) {
        if (!allowed() || !started || !Object.hasOwn(events, name)) return false;
        const params = { ...page, page_referrer: referrer, send_to: id };
        for (const [key, choices] of Object.entries(events[name])) {
            if (!choices.includes(values[key])) return false;
            params[key] = values[key];
        }
        // Arbitrary parameters, errors, filenames and user properties are dropped.
        window.gtag("event", name, params);
        return true;
    }
    function clearCookies() {
        for (const item of document.cookie.split(";")) {
            const name = item.trim().split("=")[0];
            if (!/^mechintel_ga(?:_|$)/.test(name)) continue;
            for (const path of new Set(["/", base.pathname])) {
                for (const domain of ["", ";Domain=" + location.hostname, ";Domain=." + location.hostname]) {
                    document.cookie = name + "=;Max-Age=0;Path=" + path + domain + ";SameSite=Lax;Secure";
                }
            }
        }
    }
    function setConsent(value) {
        if (!["granted", "denied"].includes(value)) return;
        choice = value;
        try { localStorage.setItem(storageKey, JSON.stringify({ value, at: Date.now() })); } catch (_) {}
        if (value === "denied") {
            window["ga-disable-" + id] = true;
            clearCookies();
            // Fully unload Google's library and its automatic engagement timers.
            if (started) { location.reload(); return; }
        } else start();
        panel.hidden = true;
    }
    window.MechIntelAnalytics = Object.freeze({ track,
        status: () => ({ configured, consent: choice, blockedByBrowser: protectedBrowser(), tagRequested: started, tagFailed: failed })
    });
    const panel = document.createElement("section");
    panel.id = "analytics-consent-panel";
    panel.className = "analytics-consent-panel";
    panel.setAttribute("aria-label", "Optional analytics preferences");
    panel.hidden = true;
    const text = document.createElement("p");
    text.textContent = "Optional Google Analytics helps us understand dashboard usage, traffic sources, approximate regions and engagement. Google receives device and network information and uses analytics cookies. Resume contents, names and contact details are excluded. You can change your choice here anytime.";
    const statusText = document.createElement("p");
    statusText.className = "analytics-consent-status";
    const accept = document.createElement("button");
    accept.type = "button"; accept.textContent = "Accept analytics";
    accept.addEventListener("click", () => setConsent("granted"));
    const reject = document.createElement("button");
    reject.type = "button"; reject.textContent = "Reject analytics";
    reject.addEventListener("click", () => setConsent("denied"));
    const privacy = document.createElement("a");
    privacy.href = "https://policies.google.com/privacy"; privacy.textContent = "Google privacy policy";
    const controls = document.createElement("div"); controls.append(accept, reject, privacy);
    panel.append(text, statusText, controls);
    document.body.append(panel);
    const settings = document.createElement("button");
    settings.type = "button"; settings.className = "analytics-settings";
    settings.textContent = "Analytics preferences";
    function show() {
        accept.disabled = !configured || protectedBrowser();
        statusText.textContent = !configured ? "Analytics is not configured; no Google Analytics requests are made."
            : protectedBrowser() ? "Your browser privacy signal blocks analytics."
            : "Current preference: " + (choice || "not selected") + ".";
        panel.hidden = false;
    }
    settings.addEventListener("click", show);
    document.body.append(settings);
    // Consent decisions apply across tabs. Revocation unloads any running tag.
    window.addEventListener("storage", event => {
        if (event.key !== storageKey) return;
        choice = readChoice();
        if (!allowed() && started) { window["ga-disable-" + id] = true; clearCookies(); location.reload(); }
        else if (allowed()) start();
    });
    start();
    if (configured && !choice && !protectedBrowser()) show();
})();
