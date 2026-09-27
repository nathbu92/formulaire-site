// ATTENTION : ne mets jamais l'URL du webhook en clair ici.
// Ce placeholder est remplacé automatiquement par le workflow GitHub Actions
// au moment du déploiement, à partir du secret DISCORD_WEBHOOK_URL.
const WEBHOOK_URL = "__DISCORD_WEBHOOK_URL__";

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("status");
const btn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  btn.disabled = true;
  statusEl.textContent = "Envoi en cours...";
  statusEl.className = "";

  const nom = document.getElementById("nom").value.trim();
  const email = document.getElementById("email").value.trim();
  const sujet = document.getElementById("sujet").value.trim();
  const message = document.getElementById("message").value.trim();

  const payload = {
    embeds: [
      {
        title: "📬 Nouveau message de contact",
        color: 0x2e4fe0,
        fields: [
          { name: "👤 Nom", value: nom, inline: true },
          { name: "📧 Email", value: email, inline: true },
          { name: "📌 Sujet", value: sujet, inline: false },
          { name: "💬 Message", value: message, inline: false }
        ],
        footer: { text: "nathabu.fr — Formulaire de contact" },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      statusEl.textContent = "Message envoyé avec succès !";
      statusEl.className = "ok";
      form.reset();
    } else {
      throw new Error("Réponse webhook non OK: " + res.status);
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Erreur lors de l'envoi. Réessaie plus tard.";
    statusEl.className = "err";
  } finally {
    btn.disabled = false;
  }
});
