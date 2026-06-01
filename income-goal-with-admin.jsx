import { useState } from "react";

const C = {
  primary: "#5b21b6", primaryLight: "#7c3aed", primaryDark: "#3b0764",
  accent: "#d97706", green: "#059669", red: "#dc2626",
  bg: "#f3f0ff", bgAlt: "#ede9fe", white: "#ffffff",
  text: "#0f0a1e", textMid: "#3d3458", textLight: "#7c6f9e", border: "#c4b5fd",
};

const PLATFORMS = [
  { name: "Meesho", commission: "0", note: "0% commission, shipping only", color: "#9333ea", bg: "#faf5ff" },
  { name: "Amazon", commission: "10", note: "Avg — varies by category", color: "#ea580c", bg: "#fff7ed" },
  { name: "Flipkart", commission: "12", note: "Avg — varies by category", color: "#2563eb", bg: "#eff6ff" },
  { name: "Myntra", commission: "20", note: "Approx avg", color: "#db2777", bg: "#fdf2f8" },
  { name: "Nykaa", commission: "18", note: "Approx avg", color: "#111827", bg: "#f9fafb" },
  { name: "Ajio", commission: "22", note: "Approx avg", color: "#dc2626", bg: "#fff1f2" },
];

const defaultValues = {
  targetIncome: "", productCost: "", packagingCost: "", shippingCharge: "",
  returnRate: "", gstRate: "", profitMargin: "", commission: "", otherExpenses: "",
};

// ===================== AUTH HELPERS =====================
function getUsers() {
  try { return JSON.parse(localStorage.getItem("yp_users") || "[]"); } catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem("yp_users", JSON.stringify(users));
}
function getLoggedIn() {
  try { return JSON.parse(localStorage.getItem("yp_loggedin") || "null"); } catch { return null; }
}
function setLoggedIn(user) {
  localStorage.setItem("yp_loggedin", JSON.stringify(user));
}
function clearLoggedIn() {
  localStorage.removeItem("yp_loggedin");
}
// =========================================================

function Navbar({ page, setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dotOpen, setDotOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // "login" | "signup"
  const [loggedUser, setLoggedUser] = useState(() => getLoggedIn());
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleAuth = () => {
    setAuthError(""); setAuthSuccess("");
    const { name, email, password } = authForm;
    if (!email || !password) { setAuthError("Email ও Password দিন।"); return; }

    if (authTab === "signup") {
      if (!name) { setAuthError("নাম দিন।"); return; }
      const users = getUsers();
      if (users.find(u => u.email === email)) { setAuthError("এই email দিয়ে আগেই account আছে।"); return; }
      const newUser = { name, email, password, joinedAt: new Date().toISOString() };
      saveUsers([...users, newUser]);
      setLoggedIn(newUser); setLoggedUser(newUser);
      setAuthSuccess("Account তৈরি হয়েছে! 🎉"); 
      setTimeout(() => setShowLogin(false), 1200);
    } else {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) { setAuthError("Email বা Password ভুল।"); return; }
      setLoggedIn(user); setLoggedUser(user);
      setAuthSuccess("Login সফল! ✓");
      setTimeout(() => setShowLogin(false), 900);
    }
  };

  const handleLogout = () => {
    clearLoggedIn(); setLoggedUser(null); setDotOpen(false);
  };

  const openModal = (tab = "login") => {
    setAuthTab(tab); setAuthError(""); setAuthSuccess("");
    setAuthForm({ name: "", email: "", password: "" }); setShowLogin(true);
  };

  const links = [
    { id: "home", label: "Home" },
    { id: "tools", label: "Tools" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
    { id: "blog", label: "Blog" },
    { id: "about", label: "About" },
  ];

  return (
    <>
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          
          {/* Logo */}
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0f0a1e, #3b0764)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(91,33,182,0.5)", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="#a78bfa" strokeWidth="2"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, textAlign: "left" }}>
              <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #0f0a1e, #5b21b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your<span style={{ WebkitTextFillColor: "#e11d48" }}>Price</span></span>
              <span style={{ fontSize: 9, color: "#7c6f9e", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Pricing Tool</span>
            </div>
          </button>

          {/* Desktop Nav - only show Calculate button + 3dot */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="nav-desktop">
            <button onClick={() => setPage("home")} style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
              border: "none", borderRadius: 10, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}>Calculate Free →</button>

            {/* 3-dot menu */}
            <div style={{ position: "relative", marginLeft: 4 }}>
              <button onClick={() => setDotOpen(!dotOpen)} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 8, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.textMid }}>
                ⋮
              </button>
              {dotOpen && (
                <div style={{ position: "absolute", right: 0, top: 42, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 200, zIndex: 200, overflow: "hidden" }}>
                  {loggedUser ? (
                    <>
                      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{loggedUser.name}</p>
                        <p style={{ fontSize: 11, color: C.textLight }}>{loggedUser.email}</p>
                      </div>
                      <button onClick={handleLogout} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, color: C.red, display: "flex", alignItems: "center", gap: 8 }}>
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { openModal("login"); setDotOpen(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>👤</span> Login
                      </button>
                      <button onClick={() => { openModal("signup"); setDotOpen(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 600, color: C.primary, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>✨</span> Sign Up
                      </button>
                    </>
                  )}
                  <div style={{ height: 1, background: C.border }} />
                  {[{ id: "privacy", label: "🔒 Privacy Policy" }, { id: "terms", label: "📄 Terms & Conditions" }, { id: "disclaimer", label: "⚠️ Disclaimer" }].map(item => (
                    <button key={item.id} onClick={() => { setPage(item.id); setDotOpen(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 500, color: C.textMid, display: "flex", alignItems: "center", gap: 8 }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile right side */}
          <div style={{ display: "none", alignItems: "center", gap: 8 }} className="mob-right">
            <div style={{ position: "relative" }}>
              <button onClick={() => setDotOpen(!dotOpen)} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 8, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.textMid }}>⋮</button>
              {dotOpen && (
                <div style={{ position: "absolute", right: 0, top: 42, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 200, zIndex: 200, overflow: "hidden" }}>
                  {loggedUser ? (
                    <>
                      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{loggedUser.name}</p>
                        <p style={{ fontSize: 11, color: C.textLight }}>{loggedUser.email}</p>
                      </div>
                      <button onClick={handleLogout} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, color: C.red }}>🚪 Logout</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { openModal("login"); setDotOpen(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>👤</span> Login
                      </button>
                      <button onClick={() => { openModal("signup"); setDotOpen(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 600, color: C.primary, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>✨</span> Sign Up
                      </button>
                    </>
                  )}
                  <div style={{ height: 1, background: C.border }} />
                  {[{ id: "privacy", label: "🔒 Privacy Policy" }, { id: "terms", label: "📄 Terms" }, { id: "disclaimer", label: "⚠️ Disclaimer" }].map(item => (
                    <button key={item.id} onClick={() => { setPage(item.id); setDotOpen(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 500, color: C.textMid }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.text }}>☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map(l => (
              <button key={l.id} onClick={() => { setPage(l.id); setMobileOpen(false); }} style={{
                background: page === l.id ? C.bgAlt : "none", border: "none", cursor: "pointer",
                padding: "10px 14px", borderRadius: 8, fontSize: 15, fontWeight: 600,
                color: page === l.id ? C.primary : C.text, textAlign: "left",
              }}>{l.label}</button>
            ))}
            {loggedUser ? (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 14px", borderRadius: 8, fontSize: 15, fontWeight: 600, color: C.red, textAlign: "left" }}>
                🚪 Logout ({loggedUser.name})
              </button>
            ) : (
              <button onClick={() => { openModal("login"); setMobileOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 14px", borderRadius: 8, fontSize: 15, fontWeight: 600, color: C.text, textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
                👤 Login / Sign Up
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Secondary Nav Bar */}
      <div style={{ background: "#1a0533", borderBottom: "1px solid rgba(167,139,250,0.25)", overflowX: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "max-content", margin: "0 auto" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: page === l.id ? "rgba(167,139,250,0.15)" : "none",
              border: "none", cursor: "pointer",
              padding: "9px 13px", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap",
              color: page === l.id ? "#ffffff" : "rgba(255,255,255,0.65)",
              borderBottom: page === l.id ? "2px solid #c084fc" : "2px solid transparent",
              borderRadius: "0",
              transition: "all 0.15s",
              flexShrink: 0,
            }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowLogin(false)}>
          <div style={{ background: C.white, borderRadius: 22, padding: "32px 28px", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", position: "relative" }} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setShowLogin(false)} style={{ position: "absolute", top: 14, right: 14, background: C.bgAlt, border: "none", cursor: "pointer", width: 30, height: 30, borderRadius: "50%", fontSize: 14, color: C.textMid, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

            {/* Icon + Title */}
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ width: 54, height: 54, borderRadius: 15, background: "linear-gradient(135deg, #0f0a1e, #3b0764)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>
                {authTab === "login" ? "👤" : "✨"}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>
                {authTab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p style={{ fontSize: 13, color: C.textMid }}>
                {authTab === "login" ? "Login করুন calculations save করতে" : "Sign up করুন — একদম free!"}
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: C.bgAlt, borderRadius: 12, padding: 4, marginBottom: 20 }}>
              {["login", "signup"].map(tab => (
                <button key={tab} onClick={() => { setAuthTab(tab); setAuthError(""); setAuthSuccess(""); }} style={{
                  flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  background: authTab === tab ? C.white : "transparent",
                  color: authTab === tab ? C.primary : C.textMid,
                  boxShadow: authTab === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s",
                }}>{tab === "login" ? "🔑 Login" : "✨ Sign Up"}</button>
              ))}
            </div>

            <div style={{ display: "grid", gap: 13 }}>
              {authTab === "signup" && (
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>আপনার নাম</label>
                  <input type="text" placeholder="Rajarshi Majumdar" value={authForm.name} onChange={e => setAuthForm(v => ({ ...v, name: e.target.value }))}
                    style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Email</label>
                <input type="email" placeholder="you@example.com" value={authForm.email} onChange={e => setAuthForm(v => ({ ...v, email: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Password</label>
                <input type="password" placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm(v => ({ ...v, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                  style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>

              {authError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.red, fontWeight: 500 }}>❌ {authError}</div>}
              {authSuccess && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.green, fontWeight: 500 }}>✅ {authSuccess}</div>}

              <button onClick={handleAuth} style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 2, boxShadow: `0 4px 16px ${C.primary}40` }}>
                {authTab === "login" ? "Login →" : "Sign Up করুন →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Footer({ setPage }) {
  const links = [
    { id: "about", label: "About" }, { id: "blog", label: "Blog" },
    { id: "faq", label: "FAQ" }, { id: "tools", label: "Tools" },
    { id: "contact", label: "Contact" }, { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms" }, { id: "disclaimer", label: "Disclaimer" },
  ];
  return (
    <footer style={{ background: C.text, color: "#fff", padding: "40px 20px 24px", marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #0f0a1e, #3b0764)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="3" y1="6" x2="21" y2="6" stroke="#a78bfa" strokeWidth="2"/>
                    <path d="M16 10a4 4 0 01-8 0" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontWeight: 900, fontSize: 15, letterSpacing: "-0.02em" }}>Your<span style={{ color: "#e11d48" }}>Price</span></span>
                  <p style={{ fontSize: 9, color: "#7c6f9e", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginTop: 1 }}>Pricing Tool</p>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#a8a29e", lineHeight: 1.7 }}>Free tool for Indian ecommerce sellers. Set your income goal — get your selling price instantly.</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a8a29e" }}>Pages</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {links.map(l => <button key={l.id} onClick={() => setPage(l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d6d3d1", fontSize: 13, textAlign: "left", padding: 0 }}>{l.label}</button>)}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a8a29e" }}>Contact</p>
            <p style={{ fontSize: 13, color: "#d6d3d1", lineHeight: 1.8 }}>Rajarshi Majumdar<br />rajarshimajumder50@gmail.com<br />Howrah, West Bengal 🇮🇳</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #44403c", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 12, color: "#78716c" }}>© 2025 Income Goal Calculator · Made with ❤️ by Rajarshi Majumdar · Free for Indian Sellers</p>
          <button onClick={() => setPage("admin")} style={{ background: "none", border: "1px solid #292524", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 11, color: "#57534e", fontWeight: 600, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#78716c"; e.currentTarget.style.color = "#a8a29e"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#292524"; e.currentTarget.style.color = "#57534e"; }}>
            🛡️ Admin
          </button>
        </div>
      </div>
    </footer>
  );
}

function Calculator() {
  const [values, setValues] = useState(defaultValues);
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const handleChange = (key, val) => {
    setValues(v => ({ ...v, [key]: val }));
    setErrors(e => ({ ...e, [key]: false }));
    if (key === "commission") setSelectedPlatform("");
  };

  const handlePlatformSelect = (platform) => {
    if (selectedPlatform === platform.name) {
      setSelectedPlatform(""); setValues(v => ({ ...v, commission: "" }));
    } else {
      setSelectedPlatform(platform.name); setValues(v => ({ ...v, commission: platform.commission }));
    }
  };

  const calculate = () => {
    const required = ["targetIncome", "productCost", "packagingCost", "shippingCharge", "returnRate", "gstRate", "profitMargin"];
    const newErrors = {};
    required.forEach(k => { if (values[k] === "" || isNaN(Number(values[k]))) newErrors[k] = true; });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    const v = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, val === "" ? 0 : parseFloat(val)]));
    const costBeforeGst = (v.productCost + v.packagingCost + v.shippingCharge) / (1 - v.returnRate / 100);
    const totalCost = costBeforeGst * (1 + v.gstRate / 100);
    const finalCost = totalCost + (totalCost * v.commission / 100) + v.otherExpenses;
    const sellPrice = finalCost * (1 + v.profitMargin / 100);
    const profitPerOrder = sellPrice - finalCost;
    const unitsNeeded = v.targetIncome / profitPerOrder;
    const dailyOrders = Math.round(unitsNeeded / 30);
    const minCapital = (v.productCost + v.packagingCost + v.shippingCharge) * dailyOrders * 7 + v.otherExpenses;
    setResults({ finalCost, sellPrice, profitPerOrder, unitsNeeded: Math.round(unitsNeeded), dailyOrders, minCapital });
  };

  const reset = () => { setValues(defaultValues); setResults(null); setErrors({}); setSelectedPlatform(""); };
  const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
  const activePlatform = PLATFORMS.find(p => p.name === selectedPlatform);
  const emptyResults = !results;

  const buildShareText = () => {
    const platform = selectedPlatform ? `🏪 Platform: ${selectedPlatform}\n` : "";
    return `📊 Income Goal Calculator Result\n\n🎯 Monthly Target Income: ₹${parseFloat(values.targetIncome).toLocaleString()}\n${platform}💰 Selling Price: ₹${results?.sellPrice.toFixed(2)}\n📦 Total Cost: ₹${results?.finalCost.toFixed(2)}\n✅ Profit/Order: ₹${results?.profitPerOrder.toFixed(2)}\n📦 Orders: ${results?.unitsNeeded}/month (${results?.dailyOrders}/day)\n💰 Min Capital: ₹${results?.minCapital.toFixed(0)}\n\nhttps://income-goal-calculator-nu.vercel.app`;
  };

  const inp = (err) => ({
    width: "100%", background: err ? "#fff5f5" : C.white,
    border: `1.5px solid ${err ? C.red : C.border}`, borderRadius: 10,
    color: C.text, fontSize: 15, fontWeight: 500, outline: "none",
    transition: "all 0.2s", boxSizing: "border-box",
  });

  const Field = ({ label, prefix, suffix, optional, fieldKey, error }) => (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ color: C.textMid, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
        {optional && <span style={{ background: "#f1f5f9", color: C.textLight, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, textTransform: "uppercase" }}>Optional</span>}
        {error && <span style={{ color: C.red, fontSize: 10, fontWeight: 600 }}>Required</span>}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textLight, fontSize: 15, fontWeight: 600, pointerEvents: "none" }}>{prefix}</span>}
        <input type="number" min="0" value={values[fieldKey]} onChange={e => handleChange(fieldKey, e.target.value)}
          style={{ ...inp(error), padding: `13px ${suffix ? "44px" : "14px"} 13px ${prefix ? "32px" : "14px"}` }} />
        {suffix && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: C.textLight, fontSize: 13, fontWeight: 600, pointerEvents: "none" }}>{suffix}</span>}
      </div>
    </div>
  );

  const ResCard = ({ label, value, highlight, green, dimmed }) => (
    <div style={{
      background: highlight ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : green ? "linear-gradient(135deg, #ecfdf5, #d1fae5)" : dimmed ? "#f8f7ff" : C.white,
      border: highlight || green ? "none" : `1px solid ${dimmed ? C.border : C.border}`, borderRadius: 14,
      padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
      boxShadow: highlight ? `0 6px 24px rgba(124,58,237,0.25)` : "0 1px 4px rgba(0,0,0,0.05)",
      opacity: dimmed ? 0.6 : 1,
    }}>
      <span style={{ color: highlight ? "rgba(255,255,255,0.85)" : green ? "#065f46" : C.textMid, fontSize: 12, fontWeight: 500 }}>{label}</span>
      <span style={{ color: highlight ? "#fff" : green ? "#065f46" : dimmed ? C.textLight : C.text, fontSize: dimmed ? 18 : 20, fontWeight: 800, whiteSpace: "nowrap", letterSpacing: "-0.02em", fontStyle: dimmed ? "italic" : "normal" }}>{value}</span>
    </div>
  );

  return (
    <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: C.white, borderRadius: 20, padding: "28px 24px", border: `1px solid ${C.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="Monthly Target Income" prefix="₹" fieldKey="targetIncome" error={errors.targetIncome} />
          <Field label="Per Unit Raw Cost" prefix="₹" fieldKey="productCost" error={errors.productCost} />
          <Field label="Packaging Cost" prefix="₹" fieldKey="packagingCost" error={errors.packagingCost} />
          <Field label="Shipping Charge" prefix="₹" fieldKey="shippingCharge" error={errors.shippingCharge} />
          <Field label="Return Rate" suffix="%" fieldKey="returnRate" error={errors.returnRate} />
          <Field label="GST Rate" suffix="%" fieldKey="gstRate" error={errors.gstRate} />
          <Field label="Profit Margin" suffix="%" fieldKey="profitMargin" error={errors.profitMargin} />
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.primaryLight}40, transparent)`, margin: "4px 0" }} />
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ color: C.textMid, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Platform Commission</span>
              <span style={{ background: "#f1f5f9", color: C.textLight, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, textTransform: "uppercase" }}>Optional</span>
            </label>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <input type="number" min="0" value={values.commission} onChange={e => handleChange("commission", e.target.value)}
                style={{ ...inp(false), padding: "13px 44px 13px 14px" }} />
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: C.textLight, fontSize: 13, fontWeight: 600, pointerEvents: "none" }}>%</span>
            </div>
            <p style={{ fontSize: 10, color: C.textLight, marginBottom: 8, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Quick fill by platform</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {PLATFORMS.map(p => (
                <button key={p.name} onClick={() => handlePlatformSelect(p)} style={{
                  border: `1.5px solid ${selectedPlatform === p.name ? p.color : C.border}`,
                  background: selectedPlatform === p.name ? p.bg : "#f8fafc",
                  borderRadius: 100, padding: "5px 10px 5px 6px", fontSize: 12, fontWeight: 700,
                  color: selectedPlatform === p.name ? p.color : C.textMid, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: p.color, color: "#fff", fontSize: 8, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{p.name[0]}</span>
                  {p.name} {p.commission}%
                </button>
              ))}
            </div>
            {activePlatform && <p style={{ marginTop: 7, fontSize: 11, color: C.primary, fontWeight: 500 }}>⚠️ {activePlatform.note} — adjust manually if needed.</p>}
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ color: C.textMid, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Other Expenses</span>
              <span style={{ background: "#f1f5f9", color: C.textLight, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, textTransform: "uppercase" }}>Optional</span>
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textLight, fontSize: 15, fontWeight: 600, pointerEvents: "none" }}>₹</span>
              <input type="number" min="0" value={values.otherExpenses} onChange={e => handleChange("otherExpenses", e.target.value)}
                style={{ ...inp(false), padding: "13px 14px 13px 32px" }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button onClick={calculate} style={{
          flex: 1, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, border: "none",
          borderRadius: 12, padding: 16, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 4px 20px ${C.primary}40`,
        }}>Calculate →</button>
        <button onClick={reset} style={{
          background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12,
          padding: "16px 20px", color: C.textMid, fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>Reset</button>
      </div>
      {/* Always visible results section */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${C.primaryLight}60)` }} />
          <span style={{ color: C.primary, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
            {results ? "Your Results" : "Output Preview"}
          </span>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${C.primaryLight}60, transparent)` }} />
        </div>

        {!results && (
          <div style={{ background: C.bgAlt, borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <p style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}>Fill in your details above and click <strong>Calculate</strong> to see your results</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          <ResCard label="Total Cost (GST + Commission + Expenses)" value={results ? fmt(results.finalCost) : "---"} dimmed={!results} />
          <ResCard label="Recommended Selling Price" value={results ? fmt(results.sellPrice) : "---"} highlight={!!results} dimmed={!results} />
          <ResCard label="Net Profit per Order" value={results ? fmt(results.profitPerOrder) : "---"} dimmed={!results} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ResCard label="Orders / Month" value={results ? results.unitsNeeded.toLocaleString() : "---"} dimmed={!results} />
            <ResCard label="Daily Orders" value={results ? results.dailyOrders.toLocaleString() : "---"} dimmed={!results} />
          </div>
          <ResCard label="💰 Minimum Starting Capital (7-day buffer)" value={results ? fmt(results.minCapital) : "---"} green={!!results} dimmed={!results} />
        </div>

        {/* Cost Breakdown — always visible */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: C.primary, marginBottom: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>📊 Cost Breakdown</p>
          <div style={{ display: "grid", gap: 0 }}>
            {(() => {
              const pc = parseFloat(values.productCost) || 0;
              const pkg = parseFloat(values.packagingCost) || 0;
              const ship = parseFloat(values.shippingCharge) || 0;
              const gstRate = parseFloat(values.gstRate) || 0;
              const commRate = parseFloat(values.commission) || 0;
              const other = parseFloat(values.otherExpenses) || 0;
              const retRate = parseFloat(values.returnRate) || 0;
              const baseCost = (pc + pkg + ship) / (1 - retRate / 100) || (pc + pkg + ship);
              const gstAmt = results ? (baseCost * gstRate / 100) : 0;
              const totalBeforeComm = baseCost + gstAmt;
              const commAmt = results ? (totalBeforeComm * commRate / 100) : 0;
              const retBuffer = results ? (baseCost - (pc + pkg + ship)) : 0;
              const items = [
                { label: "Raw Material", value: pc },
                { label: "Packaging", value: pkg },
                { label: "Shipping", value: ship },
                { label: `GST (${gstRate}%)`, value: gstAmt },
                { label: `Commission (${commRate}%)`, value: commAmt },
                { label: "Return Cost Buffer", value: retBuffer },
              ];
              return items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>₹{item.value.toFixed(2)}</span>
                </div>
              ));
            })()}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", marginTop: 2 }}>
              <span style={{ fontSize: 15, color: C.text, fontWeight: 800 }}>Total Cost / Unit</span>
              <span style={{ fontSize: 18, color: C.primary, fontWeight: 900 }}>₹{results ? Math.round(results.finalCost).toLocaleString("en-IN") : "0.00"}</span>
            </div>
          </div>
          {/* Low margin alert */}
          {(parseFloat(values.profitMargin) || 0) > 0 && (parseFloat(values.profitMargin) || 0) < 15 && (
            <div style={{ background: C.bgAlt, borderRadius: 12, padding: "12px 16px", marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <p style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>
                <strong>Low margin alert:</strong> Your profit margin of {values.profitMargin}% is below the recommended 15–20% for sustainable e-commerce. Consider reducing costs or increasing the margin.
              </p>
            </div>
          )}
        </div>

        {results && (
          <div style={{ background: C.white, border: `1.5px solid ${C.primaryLight}50`, borderRadius: 14, padding: 16 }}>
            <p style={{ fontSize: 10, color: C.primary, marginBottom: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>📋 Tap to select · Copy & share anywhere</p>
            <textarea readOnly value={buildShareText()} onFocus={e => e.target.select()} rows={9}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 13, color: C.textMid, resize: "none", lineHeight: 1.7, cursor: "text", boxSizing: "border-box" }} />
          </div>
        )}
      </div>
    </section>
  );
}

function Home({ setPage }) {
  const features = [
    { icon: "🎯", title: "Goal-Based Calculation", desc: "Enter your income goal — get the exact selling price you need." },
    { icon: "📦", title: "All Costs Included", desc: "GST, shipping, packaging, returns, commission — nothing missed." },
    { icon: "🏪", title: "Platform Presets", desc: "Auto-fill commission for Meesho, Amazon, Flipkart & more." },
    { icon: "💰", title: "Capital Requirement", desc: "Know exactly how much money you need to start." },
    { icon: "📊", title: "Daily Order Target", desc: "Break down monthly targets into manageable daily goals." },
    { icon: "📲", title: "Share Results", desc: "Copy and share your pricing plan instantly." },
  ];
  const steps = [
    { n: "01", title: "Enter Your Income Goal", desc: "How much do you want to earn this month? Enter it." },
    { n: "02", title: "Add Your Costs", desc: "Product cost, packaging, shipping, GST, return rate." },
    { n: "03", title: "Select Platform", desc: "Choose Meesho, Amazon, Flipkart etc. to auto-fill commission." },
    { n: "04", title: "Get Your Answer", desc: "Selling price, daily orders, and starting capital instantly." },
  ];
  const benefits = [
    "No more guessing your selling price", "Never undersell and lose money",
    "Plan your business with real numbers", "Works for all product categories",
    "100% free, no signup needed", "Mobile & desktop friendly",
  ];
  const testimonials = [
    { name: "Priya S.", role: "Meesho Seller, Mumbai", text: "This tool changed how I price my products. I finally know exactly what to charge!", avatar: "P" },
    { name: "Rahul K.", role: "Amazon Seller, Delhi", text: "The minimum capital feature is a lifesaver. I knew exactly how much I needed to start.", avatar: "R" },
    { name: "Anjali M.", role: "Flipkart Seller, Bengaluru", text: "Super easy to use. I calculate prices in 2 minutes now. Highly recommend!", avatar: "A" },
  ];

  return (
    <div>
      {/* Hero + Calculator */}
      <section style={{
        background: "linear-gradient(160deg, #0f0a1e 0%, #1e0a4a 40%, #2d1b69 70%, #1a0533 100%)",
        padding: "48px 20px 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(167,139,250,0.15) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(167,139,250,0.4)", borderRadius: 100, padding: "6px 16px", marginBottom: 18 }}>
            <span style={{ fontSize: 12 }}>✦</span>
            <span style={{ color: "#c4b5fd", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Free Pricing Tool for Indian Sellers</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 14 }}>
            Set Your Income Goal.<br />
            <span style={{ color: "#c4b5fd" }}>Get Your Selling Price.</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
            India's only calculator that works backwards — enter your monthly target income and get your exact selling price, daily orders, and starting capital instantly.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <a href="#calc" style={{ textDecoration: "none", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: "0 4px 20px rgba(124,58,237,0.5)" }}>
              Calculate for Free →
            </a>
            <button onClick={() => setPage("about")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Learn More
            </button>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>✓ Free forever &nbsp;·&nbsp; ✓ No signup &nbsp;·&nbsp; ✓ Works on mobile</p>
        </div>

        {/* Calculator floating card */}
        <div id="calc" style={{ maxWidth: 520, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "8px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)" }} />
        </div>
        <div style={{ maxWidth: 520, margin: "0 auto", background: "#fff", position: "relative", zIndex: 1 }}>
          <Calculator />
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 20px", background: C.bgAlt }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Key Features</h2>
            <p style={{ color: C.textMid, fontSize: 15 }}>Everything you need to price your products right</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>How It Works</h2>
            <p style={{ color: C.textMid, fontSize: 15 }}>4 simple steps to know your selling price</p>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {steps.map(s => (
              <div key={s.n} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
                <div style={{ minWidth: 44, height: 44, borderRadius: 12, background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.primary }}>{s.n}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "60px 20px", background: C.bgAlt }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Benefits for Sellers</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {benefits.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 12, background: C.white, borderRadius: 12, padding: "14px 18px", border: `1px solid ${C.border}` }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: C.green, fontSize: 12, fontWeight: 800 }}>✓</span>
                </div>
                <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section style={{ padding: "60px 20px", background: C.bgAlt }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>What Sellers Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.8, marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: C.textLight }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecommerce Animation Section */}
      <section style={{ padding: "60px 20px 48px", textAlign: "center", background: "linear-gradient(160deg, #0f0a1e 0%, #1e0a4a 60%, #0f0a1e 100%)", overflow: "hidden", position: "relative" }}>
        <style>{`
          @keyframes float1 { 0%,100% { transform: translateY(0px) rotate(-3deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
          @keyframes float2 { 0%,100% { transform: translateY(0px) rotate(2deg); } 50% { transform: translateY(-10px) rotate(-2deg); } }
          @keyframes float3 { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-18px) scale(1.05); } }
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
          @keyframes countup { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(167,139,250,0.12) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ color: "#c4b5fd", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>✦ India's Smartest Ecommerce Tool</span>
          </div>

          <h2 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Sell Smarter.<br />
            <span style={{ color: "#c4b5fd" }}>Earn More. Every Month.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 48, maxWidth: 440, margin: "0 auto 48px" }}>
            The only pricing tool that reverse-engineers your income goal into your perfect selling price.
          </p>

          {/* Floating cards animation */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 48, flexWrap: "wrap" }}>
            {/* Card 1 - Orders */}
            <div style={{ animation: "float1 3.5s ease-in-out infinite", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 16, padding: "18px 22px", textAlign: "center", minWidth: 130 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📦</div>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 2 }}>2,400+</p>
              <p style={{ fontSize: 11, color: "rgba(196,181,253,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Daily Orders</p>
            </div>

            {/* Card 2 - Center big */}
            <div style={{ animation: "float3 4s ease-in-out infinite", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", borderRadius: 20, padding: "24px 28px", textAlign: "center", minWidth: 150, boxShadow: "0 12px 40px rgba(124,58,237,0.5)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 20 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: "2px solid rgba(167,139,250,0.5)", animation: "pulse-ring 2s ease-out infinite" }} />
              </div>
              <div style={{ fontSize: 32, marginBottom: 8 }}>₹</div>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 2 }}>₹50,000</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Monthly Goal</p>
            </div>

            {/* Card 3 - Sellers */}
            <div style={{ animation: "float2 3s ease-in-out infinite", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 16, padding: "18px 22px", textAlign: "center", minWidth: 130 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🏪</div>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 2 }}>10,000+</p>
              <p style={{ fontSize: 11, color: "rgba(196,181,253,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sellers</p>
            </div>
          </div>

          {/* Scrolling platform ticker */}
          <div style={{ overflow: "hidden", marginBottom: 40, maskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)" }}>
            <div style={{ display: "flex", gap: 12, animation: "marquee 12s linear infinite", width: "max-content" }}>
              {["Meesho 0%", "Amazon ~10%", "Flipkart ~12%", "Myntra ~20%", "Nykaa ~18%", "Ajio ~22%",
                "Meesho 0%", "Amazon ~10%", "Flipkart ~12%", "Myntra ~20%", "Nykaa ~18%", "Ajio ~22%"].map((p, i) => (
                <div key={i} style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#c4b5fd", whiteSpace: "nowrap" }}>
                  🏷️ {p}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setPage("home")} style={{
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", borderRadius: 14,
            padding: "16px 40px", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 8px 32px rgba(124,58,237,0.5)", letterSpacing: "-0.01em",
          }}>
            Calculate for Free →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 14 }}>✓ No signup &nbsp;·&nbsp; ✓ Free forever &nbsp;·&nbsp; ✓ Works on mobile</p>
        </div>
      </section>
    </div>
  );
}

function About() {
  const sections = [
    { title: "Introduction", content: "Income Goal Calculator is a free online tool built specifically for Indian ecommerce sellers. Unlike other calculators, this tool works the other way around — you tell us your monthly income goal, and we tell you exactly what selling price to set." },
    { title: "About Rajarshi Majumdar", content: "Created by Rajarshi Majumdar, based in Howrah, West Bengal, India. With a deep understanding of the challenges faced by Indian ecommerce sellers, Rajarshi built this tool to solve a real problem.", special: "creator" },
    { title: "Why This Tool Was Created", content: "Most sellers struggle with pricing. They either price too low and barely profit, or too high and don't get sales. The root problem? They don't know how to reverse-engineer income goals into a selling price. This tool solves exactly that." },
    { title: "Mission & Vision", content: "Mission: Empower every Indian ecommerce seller with the financial clarity they need to build a profitable business. Vision: Become the #1 free pricing tool for Indian sellers across all platforms." },
    { title: "Who Can Use This Tool", content: "Anyone selling products online in India — whether on Meesho, Amazon, Flipkart, Myntra, Nykaa, Ajio, or your own website. Works for any product category." },
    { title: "Benefits of the Calculator", content: "Save time on manual calculations, avoid underpricing, plan with real numbers, understand your minimum capital requirement, and share your pricing plan instantly." },
  ];
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 12 }}>About Us</h1>
        <p style={{ color: C.textMid, fontSize: 16 }}>The story behind India's most unique ecommerce pricing tool</p>
      </div>
      {sections.map(s => (
        <div key={s.title} style={{ background: C.white, borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ height: 3, width: 24, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, borderRadius: 2 }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{s.title}</h2>
          </div>
          {s.special === "creator" && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.bgAlt, borderRadius: 12, padding: "14px 18px", marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👨‍💻</div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Rajarshi Majumdar</p>
                <p style={{ fontSize: 13, color: C.textMid }}>Creator · Howrah, West Bengal 🇮🇳</p>
                <p style={{ fontSize: 12, color: C.primary }}>rajarshimajumder50@gmail.com</p>
              </div>
            </div>
          )}
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.8 }}>{s.content}</p>
        </div>
      ))}
    </div>
  );
}

function Blog() {
  const posts = [
    { title: "How to Price Your Products on Meesho in 2025", category: "Pricing Tips", date: "May 2025", excerpt: "Learn how to calculate the perfect selling price on Meesho that covers all your costs and still makes profit.", readTime: "5 min", emoji: "💰" },
    { title: "Amazon India Commission Rates Explained", category: "Platform Guide", date: "May 2025", excerpt: "A complete breakdown of Amazon India's commission structure and how it affects your profit margins.", readTime: "7 min", emoji: "🏪" },
    { title: "What is GST for Ecommerce Sellers?", category: "Tax Guide", date: "Apr 2025", excerpt: "Everything Indian ecommerce sellers need to know about GST — rates, filing, and how to factor it into pricing.", readTime: "6 min", emoji: "📊" },
    { title: "How Much Money Do You Need to Start on Flipkart?", category: "Getting Started", date: "Apr 2025", excerpt: "Breaking down the minimum capital required to start your Flipkart selling journey with realistic numbers.", readTime: "4 min", emoji: "🚀" },
    { title: "Return Rate on Meesho: How to Manage It", category: "Pricing Tips", date: "Mar 2025", excerpt: "High return rates can kill your profits. Here's how to account for returns when pricing your products.", readTime: "5 min", emoji: "📦" },
    { title: "Profit Margin Guide for Indian Sellers", category: "Business Basics", date: "Mar 2025", excerpt: "What's a healthy profit margin for Indian sellers? How to calculate it and improve it over time.", readTime: "8 min", emoji: "📈" },
  ];
  const categories = ["All", "Pricing Tips", "Platform Guide", "Tax Guide", "Getting Started", "Business Basics"];
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 12 }}>Blog</h1>
        <p style={{ color: C.textMid, fontSize: 16 }}>Tips, guides, and insights for Indian ecommerce sellers</p>
      </div>
      <div style={{ position: "relative", maxWidth: 500, margin: "0 auto 32px" }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
        <input placeholder="Search articles..." style={{ width: "100%", padding: "13px 16px 13px 44px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32, justifyContent: "center" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{
            padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: `1.5px solid ${activeCategory === c ? C.primary : C.border}`,
            background: activeCategory === c ? C.bgAlt : C.white,
            color: activeCategory === c ? C.primary : C.textMid,
          }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {filtered.map(p => (
          <div key={p.title} style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ height: 120, background: "linear-gradient(135deg, #f5f3ff, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{p.emoji}</div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ background: C.bgAlt, color: C.primary, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{p.category}</span>
                <span style={{ fontSize: 11, color: C.textLight }}>{p.readTime}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.4 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, marginBottom: 12 }}>{p.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.textLight }}>{p.date}</span>
                <button style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>Read More →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const sections = [
    { title: "General Questions", items: [
      { q: "What is Income Goal Calculator?", a: "A free tool that helps Indian ecommerce sellers find the right selling price based on their monthly income goals." },
      { q: "Is this tool completely free?", a: "Yes, 100% free. No signup, no subscription, no hidden charges. It will always be free." },
      { q: "Who is this tool for?", a: "Anyone selling products online in India — on Meesho, Amazon, Flipkart, Myntra, Nykaa, Ajio, or any other platform." },
    ]},
    { title: "Calculator Questions", items: [
      { q: "What inputs does the calculator need?", a: "Monthly target income, per unit raw cost, packaging cost, shipping charge, return rate, GST rate, profit margin, and optionally platform commission and other expenses." },
      { q: "How is the selling price calculated?", a: "All costs (GST, returns, commission) are added, then your profit margin is applied to find the minimum selling price that meets your income goal." },
      { q: "What is the Minimum Starting Capital?", a: "It's the minimum amount needed to buy stock for 7 days of sales. This helps you understand your initial investment requirement." },
    ]},
    { title: "Pricing Questions", items: [
      { q: "What profit margin should I use?", a: "For beginners, 20-30% is a good starting point. Aim for 30-50% as you grow. Below 15% is generally risky." },
      { q: "How do I factor in return rates?", a: "Enter your expected return percentage. If unsure, use 5-10% for Meesho and 2-5% for Amazon/Flipkart." },
    ]},
    { title: "Ecommerce Seller Questions", items: [
      { q: "Does this work for Meesho sellers?", a: "Yes! Meesho has 0% commission. Select Meesho from the platform presets or enter 0 manually." },
      { q: "Which platforms are supported?", a: "Meesho, Amazon, Flipkart, Myntra, Nykaa, and Ajio have preset rates. You can also enter custom rates for any platform." },
    ]},
    { title: "Technical Questions", items: [
      { q: "Does this work on mobile?", a: "Yes, fully responsive and works perfectly on all mobile devices." },
      { q: "Is my data saved?", a: "No data is saved or stored. All calculations happen in your browser. Your information is completely private." },
    ]},
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 12 }}>FAQ</h1>
        <p style={{ color: C.textMid, fontSize: 16 }}>Answers to common questions</p>
      </div>
      {sections.map(s => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{s.title}</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {s.items.map((item, i) => {
              const key = `${s.title}-${i}`;
              return (
                <div key={key} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                  <button onClick={() => setOpen(open === key ? null : key)} style={{ width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.q}</span>
                    <span style={{ color: C.primary, fontSize: 18, flexShrink: 0, display: "inline-block", transform: open === key ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                  </button>
                  {open === key && <div style={{ padding: "0 20px 16px", fontSize: 14, color: C.textMid, lineHeight: 1.8 }}>{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tools({ setPage }) {
  const tools = [
    { title: "Income Goal Calculator", desc: "Set your monthly income goal and get your exact selling price, daily orders needed, and starting capital.", icon: "🎯", status: "Live" },
    { title: "Profit Margin Calculator", desc: "Calculate your profit margin percentage from cost price and selling price.", icon: "📊", status: "Coming Soon" },
    { title: "Break-Even Calculator", desc: "Find the minimum units you need to sell to cover all your costs.", icon: "⚖️", status: "Coming Soon" },
    { title: "GST Calculator", desc: "Calculate GST amount and final price including or excluding tax.", icon: "🧾", status: "Coming Soon" },
    { title: "Shipping Cost Estimator", desc: "Estimate shipping costs across different courier partners in India.", icon: "🚚", status: "Coming Soon" },
    { title: "Return Rate Impact Calculator", desc: "See how return rates affect your monthly income.", icon: "↩️", status: "Coming Soon" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 12 }}>Tools</h1>
        <p style={{ color: C.textMid, fontSize: 16 }}>Free tools for Indian ecommerce sellers</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {tools.map(t => (
          <div key={t.title} style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, opacity: t.status === "Live" ? 1 : 0.75 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icon}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, flex: 1 }}>{t.title}</h3>
              <span style={{ background: t.status === "Live" ? "#ecfdf5" : C.bgAlt, color: t.status === "Live" ? C.green : C.primary, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginLeft: 8, flexShrink: 0 }}>{t.status}</span>
            </div>
            <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, marginBottom: 16 }}>{t.desc}</p>
            <button onClick={() => t.status === "Live" && setPage("home")} style={{
              padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: t.status === "Live" ? "pointer" : "default",
              background: t.status === "Live" ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : C.border,
              color: t.status === "Live" ? "#fff" : C.textLight,
            }}>{t.status === "Live" ? "Use Tool →" : "Coming Soon"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 12 }}>Contact Us</h1>
        <p style={{ color: C.textMid, fontSize: 16 }}>Questions, feedback, or suggestions? We'd love to hear from you.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[
          { icon: "📧", label: "Email", value: "rajarshimajumder50@gmail.com" },
          { icon: "👤", label: "Creator", value: "Rajarshi Majumdar" },
          { icon: "📍", label: "Location", value: "Howrah, West Bengal 🇮🇳" },
          { icon: "⏰", label: "Response", value: "Within 24-48 hours" },
        ].map(c => (
          <div key={c.label} style={{ background: C.white, borderRadius: 14, padding: 18, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <p style={{ fontSize: 10, color: C.textLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</p>
              <p style={{ fontSize: 12, color: C.text, fontWeight: 600, marginTop: 2 }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 20, padding: 32, border: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 24 }}>Send a Message</h2>
        {sent ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Message Sent!</h3>
            <p style={{ color: C.textMid }}>Thank you! We'll get back to you within 24-48 hours.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {[{ label: "Your Name", key: "name", ph: "Rajarshi Majumdar" }, { label: "Email", key: "email", ph: "you@example.com" }, { label: "Subject", key: "subject", ph: "Question about the calculator" }].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.ph}
                  style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Message</label>
              <textarea value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} placeholder="Write your message here..." rows={5}
                style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => setSent(true)} style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Send Message →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SimplePage({ title, sections }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 12 }}>{title}</h1>
        <p style={{ color: C.textMid, fontSize: 13 }}>Last updated: June 2025</p>
      </div>
      {sections.map(s => (
        <div key={s.title} style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>{s.title}</h2>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.8 }}>{s.content}</p>
        </div>
      ))}
    </div>
  );
}

const privacySections = [
  { title: "Introduction", content: "This Privacy Policy explains how Income Goal Calculator collects, uses, and protects your information. By using this website, you agree to the practices described here." },
  { title: "Information Collection", content: "Income Goal Calculator does not collect, store, or transmit any personal information. All calculations happen locally in your browser. No data is sent to any server." },
  { title: "Cookies Policy", content: "This website may use basic cookies for analytics (Google Analytics). These track anonymous usage data and do not identify you personally." },
  { title: "Google AdSense Policy", content: "This site displays ads served by Google AdSense. Google may use cookies to show relevant ads. You can opt out at google.com/ads/preferences." },
  { title: "Third-Party Services", content: "We use Google Analytics for anonymous traffic analysis and Google AdSense for advertising. Both have their own privacy policies." },
  { title: "User Rights", content: "Since we don't collect personal data, there is nothing to delete or modify. Clear ad cookies from your browser settings anytime." },
  { title: "Contact", content: "For privacy concerns: rajarshimajumder50@gmail.com — Rajarshi Majumdar, Howrah, West Bengal, India." },
];

const termsSections = [
  { title: "Acceptance of Terms", content: "By accessing Income Goal Calculator, you accept and agree to be bound by these Terms. If you do not agree, please do not use this website." },
  { title: "Website Usage Rules", content: "This tool is for informational purposes only. You may not copy, redistribute, or resell this tool without written permission." },
  { title: "User Responsibilities", content: "You are responsible for the accuracy of data you enter. Results are estimates. Always verify calculations before making business decisions." },
  { title: "Intellectual Property", content: "All content, design, and code is the intellectual property of Rajarshi Majumdar and Income Goal Calculator. Unauthorized reproduction is prohibited." },
  { title: "Limitation of Liability", content: "We provide estimates for informational purposes only. We are not responsible for business decisions made based on our calculations." },
  { title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms." },
];

const disclaimerSections = [
  { title: "General Disclaimer", content: "Information provided by Income Goal Calculator is for general informational purposes only. We make no representation or warranty regarding accuracy or completeness." },
  { title: "Earnings Disclaimer", content: "Income figures shown are estimates only. Individual results will vary based on market conditions, competition, product quality, and many other factors." },
  { title: "Financial Disclaimer", content: "Nothing on this website constitutes financial, business, or investment advice. The calculator provides estimates to help with pricing decisions only." },
  { title: "Accuracy Disclaimer", content: "Platform commission rates, GST rates, and other preset figures are approximate and may change. Always verify current rates directly with the relevant platform." },
  { title: "External Links Disclaimer", content: "This website may contain links to external websites. We have no control over those sites and accept no responsibility for them." },
  { title: "Contact", content: "For questions about this disclaimer: rajarshimajumder50@gmail.com" },
];

// ===================== ADMIN DASHBOARD =====================
const ADMIN_PASSWORD = "admin@yourprice2025";

function AdminDashboard({ setPage }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const handleAdminLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setUsers(getUsers());
    } else {
      setPwErr("Wrong password!");
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = (email) => {
    const updated = users.filter(u => u.email !== email);
    saveUsers(updated);
    setUsers(updated);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: C.white, borderRadius: 22, padding: "40px 32px", maxWidth: 380, width: "100%", border: `1px solid ${C.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #0f0a1e, #3b0764)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>🛡️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ fontSize: 13, color: C.textMid, marginBottom: 24 }}>Restricted access. Password required.</p>
          <div style={{ display: "grid", gap: 12 }}>
            <input type="password" placeholder="Admin password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              style={{ width: "100%", padding: "13px 16px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", textAlign: "center" }} />
            {pwErr && <p style={{ color: C.red, fontSize: 13, fontWeight: 600 }}>❌ {pwErr}</p>}
            <button onClick={handleAdminLogin} style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Enter Admin Panel →
            </button>
          </div>
          <button onClick={() => setPage("home")} style={{ marginTop: 16, background: "none", border: "none", color: C.textMid, fontSize: 13, cursor: "pointer" }}>← Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 4 }}>🛡️ Admin Dashboard</h1>
          <p style={{ fontSize: 14, color: C.textMid }}>সব registered users এর তালিকা</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: C.primary }}>{users.length}</p>
            <p style={{ fontSize: 11, color: C.textMid, fontWeight: 600 }}>Total Users</p>
          </div>
          <button onClick={() => setPage("home")} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 18px", fontSize: 13, color: C.textMid, cursor: "pointer", fontWeight: 600 }}>← Home</button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
        <input placeholder="নাম বা email দিয়ে search করুন..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "13px 16px 13px 44px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Users Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: C.textMid, fontSize: 15 }}>
          {users.length === 0 ? "🕳️ এখনো কোনো user sign up করেনি।" : "কোনো result পাওয়া যায়নি।"}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr", gap: 12, padding: "10px 16px", background: C.bgAlt, borderRadius: 10, fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>#</span><span>নাম</span><span>Email</span><span>তারিখ</span>
          </div>
          {filtered.map((u, i) => (
            <div key={u.email} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr", gap: 12, padding: "14px 16px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.textLight, fontWeight: 600 }}>#{i + 1}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {(u.name || "?")[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{u.name || "—"}</span>
              </div>
              <span style={{ fontSize: 13, color: C.textMid }}>{u.email}</span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: C.textLight }}>{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString("en-IN") : "—"}</span>
                <button onClick={() => window.confirm(`Delete ${u.email}?`) && deleteUser(u.email)} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "4px 8px", fontSize: 11, color: C.red, cursor: "pointer", fontWeight: 600 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Raw data export */}
      <div style={{ marginTop: 32, background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>📋 Raw Data (Copy & Save)</p>
        <textarea readOnly value={JSON.stringify(users, null, 2)} rows={8}
          style={{ width: "100%", background: C.bgAlt, border: "none", outline: "none", fontSize: 12, color: C.textMid, resize: "vertical", fontFamily: "monospace", borderRadius: 8, padding: 12, boxSizing: "border-box" }} />
      </div>
    </div>
  );
}
// ===========================================================

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <Home setPage={setPage} />;
      case "about": return <About />;
      case "blog": return <Blog />;
      case "faq": return <FAQ />;
      case "tools": return <Tools setPage={setPage} />;
      case "contact": return <Contact />;
      case "privacy": return <SimplePage title="Privacy Policy" sections={privacySections} />;
      case "terms": return <SimplePage title="Terms & Conditions" sections={termsSections} />;
      case "disclaimer": return <SimplePage title="Disclaimer" sections={disclaimerSections} />;
      case "admin": return <AdminDashboard setPage={setPage} />;
      default: return (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🔍</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: C.text, marginBottom: 12 }}>404</h1>
          <p style={{ fontSize: 18, color: C.textMid, marginBottom: 32 }}>Page not found.</p>
          <button onClick={() => setPage("home")} style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, border: "none", color: "#fff", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Back to Home →
          </button>
        </div>
      );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        button, input, textarea { font-family: 'Outfit', sans-serif; }
        @media (max-width: 700px) {
          .nav-desktop { display: none !important; }
          .mob-right { display: flex !important; }
        }
        @media (min-width: 701px) {
          .mob-right { display: none !important; }
        }
      `}</style>
      <Navbar page={page} setPage={setPage} />
      {renderPage()}
      <Footer setPage={setPage} />
    </div>
  );
}
