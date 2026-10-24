/* ============================================================
   Arthur Lincoln — comportamento compartilhado entre as páginas
   ============================================================ */

// ------------------------------------------------------------
// CONTATOS: é só colar. Campo vazio não aparece no site.
// ------------------------------------------------------------
const LINKS = {
  github:    "https://github.com/LincolnArthur",
  linkedin:  "",   // https://www.linkedin.com/in/...
  instagram: "",   // https://www.instagram.com/...
  x:         "",   // https://x.com/...
  email:     "",   // nome@exemplo.com
  telefone:  ""    // +55 74 9xxxx-xxxx (vira link de WhatsApp)
};

// ------------------------------------------------------------
// Textos em inglês comuns a todas as páginas (o português já está no HTML)
// ------------------------------------------------------------
const EN_COMMON = {
  skip: "Skip to content",
  sideRole: "Computer Engineering student",
  navProjects: "Projects",
  navResume: "Résumé",
  navContact: "Contact",
  sideLinks: "Links",
  sideCta: "Download résumé (PDF)",
  footHome: "Home",
  footResume: "Résumé",
  footContact: "Contact",
  footPrivacy: "Privacy",
  footSource: "Site source code",
  stickyResume: "Résumé",
  stickyContact: "Get in touch",
  stickyPdf: "Download PDF",
  email: "Email",
  phone: "WhatsApp"
};
const PT_EXTRA = { email: "E-mail", phone: "WhatsApp" };

const FORM_MSG = {
  pt: {
    name: "Escreva seu nome.",
    email: "Escreva um e-mail válido, como nome@exemplo.com.",
    message: "A mensagem precisa ter pelo menos 10 caracteres.",
    summary: n => n === 1 ? "Corrija 1 campo destacado para enviar." : `Corrija os ${n} campos destacados para enviar.`,
    sending: "Enviando…",
    send: "Enviar mensagem",
    sent: "Mensagem enviada. Abrindo a confirmação…",
    failed: "Não foi possível enviar agora. Verifique sua conexão e tente de novo."
  },
  en: {
    name: "Enter your name.",
    email: "Enter a valid email, like name@example.com.",
    message: "The message needs at least 10 characters.",
    summary: n => n === 1 ? "Fix 1 highlighted field to send." : `Fix the ${n} highlighted fields to send.`,
    sending: "Sending…",
    send: "Send message",
    sent: "Message sent. Opening the confirmation…",
    failed: "The message couldn't be sent right now. Check your connection and try again."
  }
};

const SITE = (() => {
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let lang = (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
  const saved = store.get("lang");
  if (saved === "pt" || saved === "en") lang = saved;

  const EN = Object.assign({}, EN_COMMON, window.PAGE_EN || {});
  const PT = Object.assign({}, PT_EXTRA);
  const metaDesc = document.querySelector('meta[name="description"]');
  PT.metaTitle = document.title;
  if (metaDesc) PT.metaDesc = metaDesc.content;

  // guarda o texto em português que já está no HTML
  document.querySelectorAll("[data-i18n]").forEach(el => { PT[el.dataset.i18n] = el.innerHTML; });
  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    el.dataset.i18nAttr.split(";").forEach(pair => {
      const [attr, key] = pair.split(":");
      PT[key] = el.getAttribute(attr);
    });
  });

  function t(key) { const d = lang === "en" ? EN : PT; return d[key] !== undefined ? d[key] : PT[key]; }

  function renderLinks() {
    const names = { github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram", x: "X" };
    document.querySelectorAll("[data-links]").forEach(ul => {
      ul.innerHTML = "";
      for (const key of ["github", "linkedin", "instagram", "x", "email", "telefone"]) {
        const v = (LINKS[key] || "").trim();
        if (!v) continue;
        if (ul.dataset.links === "cv" && key === "github") continue; // o currículo já mostra o GitHub
        const full = ul.dataset.links === "full" || ul.dataset.links === "cv";
        const li = document.createElement("li");
        const a = document.createElement("a");
        if (key === "email") { a.href = "mailto:" + v; a.textContent = full ? v : t("email"); }
        else if (key === "telefone") {
          a.href = "https://wa.me/" + v.replace(/\D/g, "");
          a.textContent = full ? v : t("phone");
        }
        else { a.href = v; a.textContent = full ? v.replace(/^https?:\/\/(www\.)?/, "") : names[key]; a.rel = "me noopener"; }
        li.appendChild(a); ul.appendChild(li);
      }
    });
  }

  function apply(l) {
    lang = l;
    store.set("lang", l);
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
    document.querySelectorAll("[data-i18n]").forEach(el => { const v = t(el.dataset.i18n); if (typeof v === "string") el.innerHTML = v; });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => { const [attr, key] = pair.split(":"); const v = t(key); if (typeof v === "string") el.setAttribute(attr, v); });
    });
    if (t("metaTitle")) document.title = t("metaTitle");
    if (metaDesc && t("metaDesc")) metaDesc.content = t("metaDesc");
    document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
    renderLinks();
    document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
    document.documentElement.classList.remove("i18n-pending");
  }

  document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => apply(b.dataset.lang)));
  document.querySelectorAll(".year").forEach(el => { el.textContent = new Date().getFullYear(); });

  // CTA fixo no celular: some quando o destino já está na tela
  const sticky = document.querySelector(".sticky-cta");
  if (sticky) {
    document.body.classList.add("has-sticky");
    const targets = document.querySelectorAll("[data-hide-sticky]");
    if (targets.length && "IntersectionObserver" in window) {
      const visible = new Set();
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
        sticky.classList.toggle("hidden", visible.size > 0);
      }, { threshold: 0.05 });
      targets.forEach(el => io.observe(el));
    }
  }

  apply(lang);
  return { get lang() { return lang; }, t };
})();

// ------------------------------------------------------------
// Formulário de contato (Netlify Forms)
// ------------------------------------------------------------
(() => {
  const form = document.getElementById("form-contato");
  if (!form) return;
  const msgBox = document.getElementById("form-msg");
  const submit = form.querySelector('button[type="submit"]');
  const M = () => FORM_MSG[SITE.lang];
  const fields = {
    name:    { el: form.elements.nome,     ok: v => v.trim().length >= 2 },
    email:   { el: form.elements.email,    ok: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) },
    message: { el: form.elements.mensagem, ok: v => v.trim().length >= 10 }
  };

  function setError(key, show) {
    const f = fields[key], wrap = f.el.closest(".field"), err = wrap.querySelector(".field-error");
    wrap.classList.toggle("invalid", show);
    f.el.setAttribute("aria-invalid", String(show));
    err.textContent = show ? M()[key] : "";
  }
  function showMsg(kind, text) { msgBox.className = "form-msg " + kind; msgBox.textContent = text; }
  function clearMsg() { msgBox.className = "form-msg"; msgBox.textContent = ""; }

  // valida o campo quando a pessoa sai dele, e reavalia enquanto corrige
  Object.keys(fields).forEach(key => {
    const f = fields[key];
    f.el.addEventListener("blur", () => { if (f.el.value) setError(key, !f.ok(f.el.value)); });
    f.el.addEventListener("input", () => { if (f.el.closest(".field").classList.contains("invalid")) setError(key, !f.ok(f.el.value)); });
  });

  document.addEventListener("langchange", () => {
    Object.keys(fields).forEach(key => { if (fields[key].el.closest(".field").classList.contains("invalid")) setError(key, true); });
    if (!submit.disabled) submit.textContent = M().send;
    if (msgBox.classList.contains("error") && msgBox.dataset.kind === "summary") showMsg("error", M().summary(form.querySelectorAll(".field.invalid").length));
    if (msgBox.classList.contains("error") && msgBox.dataset.kind === "failed") showMsg("error", M().failed);
  });

  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    let bad = 0, first = null;
    Object.keys(fields).forEach(key => {
      const invalid = !fields[key].ok(fields[key].el.value);
      setError(key, invalid);
      if (invalid) { bad++; if (!first) first = fields[key].el; }
    });
    if (bad) { msgBox.dataset.kind = "summary"; showMsg("error", M().summary(bad)); first.focus(); return; }

    clearMsg();
    submit.disabled = true; submit.textContent = M().sending;
    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      if (!res.ok) throw new Error("HTTP " + res.status);
      try { sessionStorage.setItem("contato-nome", fields.name.el.value.trim().split(/\s+/)[0]); } catch (e) {}
      msgBox.dataset.kind = "sent"; showMsg("ok", M().sent);
      form.reset();
      setTimeout(() => { location.href = "/obrigado/"; }, 700);
    } catch (e) {
      msgBox.dataset.kind = "failed"; showMsg("error", M().failed);
      submit.disabled = false; submit.textContent = M().send;
    }
  });
})();
