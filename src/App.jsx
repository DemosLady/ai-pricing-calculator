import { useState, useMemo, useCallback, useEffect } from "react";

const MODELS = [
  { id: "gpt54", name: "GPT-5.4", provider: "OpenAI", input: 2.50, output: 10.00, context: "128K", badge: null, color: "#10a37f" },
  { id: "gpt54mini", name: "GPT-5.4 mini", provider: "OpenAI", input: 0.40, output: 1.60, context: "128K", badge: "best value", color: "#10a37f" },
  { id: "gpt54nano", name: "GPT-5.4 nano", provider: "OpenAI", input: 0.10, output: 0.40, context: "128K", badge: "cheapest", color: "#10a37f" },
  { id: "o1", name: "o1", provider: "OpenAI", input: 15.00, output: 60.00, context: "200K", badge: "reasoning", color: "#10a37f" },
  { id: "opus46", name: "Claude Opus 4.6", provider: "Anthropic", input: 5.00, output: 25.00, context: "1M", badge: "most capable", color: "#d97706" },
  { id: "sonnet46", name: "Claude Sonnet 4.6", provider: "Anthropic", input: 3.00, output: 15.00, context: "200K", badge: null, color: "#d97706" },
  { id: "haiku45", name: "Claude Haiku 4.5", provider: "Anthropic", input: 1.00, output: 5.00, context: "200K", badge: "fast & cheap", color: "#d97706" },
  { id: "gemini31pro", name: "Gemini 3.1 Pro", provider: "Google", input: 2.00, output: 12.00, context: "2M", badge: "largest context", color: "#4285f4" },
  { id: "gemini3flash", name: "Gemini 3 Flash", provider: "Google", input: 0.50, output: 3.00, context: "1M", badge: null, color: "#4285f4" },
  { id: "grok41", name: "Grok 4.1", provider: "xAI", input: 3.00, output: 15.00, context: "256K", badge: null, color: "#1d9bf0" },
  { id: "deepseekv3", name: "DeepSeek V3", provider: "DeepSeek", input: 0.27, output: 1.10, context: "128K", badge: "open source", color: "#6366f1" },
  { id: "llama4", name: "Llama 4 Maverick", provider: "Meta", input: 0.15, output: 0.60, context: "128K", badge: "open source", color: "#0668e1" },
];

const PRESETS = [
  { name: "Customer support chatbot", inputTokens: 800, outputTokens: 400, callsPerDay: 500, icon: "💬" },
  { name: "Document summarization", inputTokens: 50000, outputTokens: 2000, callsPerDay: 100, icon: "📄" },
  { name: "Code assistant", inputTokens: 3000, outputTokens: 2000, callsPerDay: 200, icon: "🧑‍💻" },
  { name: "Content generation", inputTokens: 500, outputTokens: 3000, callsPerDay: 50, icon: "✍️" },
  { name: "RAG pipeline", inputTokens: 20000, outputTokens: 1000, callsPerDay: 300, icon: "🔍" },
  { name: "Data extraction", inputTokens: 10000, outputTokens: 500, callsPerDay: 1000, icon: "📊" },
];

const PROVIDERS = ["All", "OpenAI", "Anthropic", "Google", "xAI", "DeepSeek", "Meta"];

// ━━━ ADSENSE CONFIG ━━━
// Replace this with your actual AdSense publisher ID after approval
const ADSENSE_PUB_ID = "ca-pub-7675527666098811";
const ADS_ENABLED = true;

function AdBanner({ slot, format = "auto", style: customStyle = {} }) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (ADS_ENABLED) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        const timer = setTimeout(() => {
          const container = document.querySelector(`[data-ad-slot="${slot}"]`);
          if (container && container.offsetHeight > 0) {
            setAdLoaded(true);
          }
        }, 2000);
        return () => clearTimeout(timer);
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [slot]);

  return (
    <div style={{ margin: "20px 0", textAlign: "center", overflow: "hidden", minHeight: 90, position: "relative", ...customStyle }}>
      {/* AdSense code — will activate automatically when approved */}
      {ADS_ENABLED && (
        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_PUB_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true" />
      )}
      {/* Visible placeholder until ad loads */}
      {!adLoaded && (
        <div style={{
          position: ADS_ENABLED ? "absolute" : "relative",
          top: 0, left: 0, right: 0, bottom: 0,
          border: "1.5px dashed #d0d0d0", borderRadius: 10, padding: "14px 20px",
          background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 90, zIndex: 0,
        }}>
          <div style={{ fontSize: 11, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Advertisement
          </div>
        </div>
      )}
    </div>
  );
}

function formatCost(v) {
  if (v < 0.01) return "$" + v.toFixed(4);
  if (v < 1) return "$" + v.toFixed(3);
  if (v < 100) return "$" + v.toFixed(2);
  return "$" + Math.round(v).toLocaleString();
}

function formatTokens(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return n.toString();
}

function Badge({ text, color }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
      padding: "2px 7px", borderRadius: 4,
      background: color + "18", color: color, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function ModelCard({ model, costPerCall, monthlyCost, costPerConversation, isLowest }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "20px 22px",
      border: isLowest ? `2px solid ${model.color}` : "1px solid #e8e6e1",
      position: "relative", transition: "box-shadow 0.2s",
      boxShadow: isLowest ? `0 0 0 1px ${model.color}22` : "none",
    }}>
      {isLowest && (
        <div style={{
          position: "absolute", top: -10, left: 16,
          background: model.color, color: "#fff", fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.06em",
        }}>Lowest cost</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{model.name}</div>
          <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{model.provider} · {model.context} context</div>
        </div>
        {model.badge && <Badge text={model.badge} color={model.color} />}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "#f9f8f6", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Input</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>${model.input.toFixed(2)}</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>per 1M tokens</div>
        </div>
        <div style={{ background: "#f9f8f6", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Output</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>${model.output.toFixed(2)}</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>per 1M tokens</div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #f0eeea", paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        <div>
          <div style={{ fontSize: 10, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Per call</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{formatCost(costPerCall)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Per chat</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: model.color }}>{formatCost(costPerConversation)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Monthly</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{formatCost(monthlyCost)}</div>
        </div>
      </div>
    </div>
  );
}

export default function AIPricingCalculator() {
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [callsPerDay, setCallsPerDay] = useState(100);
  const [selectedProvider, setSelectedProvider] = useState("All");
  const [sortBy, setSortBy] = useState("monthly");
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = useCallback((preset, idx) => {
    setInputTokens(preset.inputTokens);
    setOutputTokens(preset.outputTokens);
    setCallsPerDay(preset.callsPerDay);
    setActivePreset(idx);
  }, []);

  const calculated = useMemo(() => {
    const filtered = selectedProvider === "All" ? MODELS : MODELS.filter(m => m.provider === selectedProvider);
    const results = filtered.map(model => {
      const costPerCall = (inputTokens * model.input + outputTokens * model.output) / 1_000_000;
      const monthlyCost = costPerCall * callsPerDay * 30;
      const costPerConversation = costPerCall * 5;
      return { model, costPerCall, monthlyCost, costPerConversation };
    });
    results.sort((a, b) => sortBy === "monthly" ? a.monthlyCost - b.monthlyCost : sortBy === "input" ? a.model.input - b.model.input : a.model.output - b.model.output);
    const lowestId = results.length > 0 ? results[0].model.id : null;
    return { results, lowestId };
  }, [inputTokens, outputTokens, callsPerDay, selectedProvider, sortBy]);

  const totalInputPerMonth = inputTokens * callsPerDay * 30;
  const totalOutputPerMonth = outputTokens * callsPerDay * 30;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", color: "#1a1a1a" }}>

      <div style={{ textAlign: "center", padding: "48px 0 36px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: 8 }}>Free tool · Updated May 2026</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.15, color: "#0d0d0d" }}>
          AI API pricing calculator
        </h1>
        <p style={{ fontSize: 16, color: "#777", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          Compare token costs across GPT-5.4, Claude, Gemini, Grok, DeepSeek & Llama. See real monthly costs, not just per-token prices.
        </p>
      </div>

      {/* AD SLOT 1 — below header */}
      <AdBanner slot="1234567890" format="horizontal" />

      {/* USE CASE PRESETS */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", marginBottom: 10 }}>Quick presets</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => applyPreset(p, i)} style={{
              padding: "8px 14px", borderRadius: 8, border: activePreset === i ? "2px solid #1a1a1a" : "1px solid #e0ddd8",
              background: activePreset === i ? "#1a1a1a" : "#fff",
              color: activePreset === i ? "#fff" : "#555",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              fontFamily: "inherit",
            }}>
              <span style={{ marginRight: 5 }}>{p.icon}</span>{p.name}
            </button>
          ))}
        </div>
      </div>

      {/* SLIDERS */}
      <div style={{ background: "#f9f8f6", borderRadius: 16, padding: "28px 28px 20px", marginBottom: 32, border: "1px solid #eeece7" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#888" }}>Input tokens</label>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "#1a1a1a" }}>{formatTokens(inputTokens)}</span>
            </div>
            <input type="range" min={50} max={100000} step={50} value={inputTokens}
              onChange={e => { setInputTokens(+e.target.value); setActivePreset(null); }}
              style={{ width: "100%", accentColor: "#1a1a1a" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", marginTop: 4 }}>
              <span>50</span><span>100K</span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#888" }}>Output tokens</label>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "#1a1a1a" }}>{formatTokens(outputTokens)}</span>
            </div>
            <input type="range" min={50} max={50000} step={50} value={outputTokens}
              onChange={e => { setOutputTokens(+e.target.value); setActivePreset(null); }}
              style={{ width: "100%", accentColor: "#1a1a1a" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", marginTop: 4 }}>
              <span>50</span><span>50K</span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#888" }}>Calls / day</label>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "#1a1a1a" }}>{callsPerDay.toLocaleString()}</span>
            </div>
            <input type="range" min={1} max={10000} step={1} value={callsPerDay}
              onChange={e => { setCallsPerDay(+e.target.value); setActivePreset(null); }}
              style={{ width: "100%", accentColor: "#1a1a1a" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", marginTop: 4 }}>
              <span>1</span><span>10K</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 18, paddingTop: 16, borderTop: "1px solid #e8e5e0", fontSize: 12, color: "#888" }}>
          <span>Monthly input: <strong style={{ color: "#1a1a1a", fontFamily: "'IBM Plex Mono', monospace" }}>{formatTokens(totalInputPerMonth)} tokens</strong></span>
          <span>Monthly output: <strong style={{ color: "#1a1a1a", fontFamily: "'IBM Plex Mono', monospace" }}>{formatTokens(totalOutputPerMonth)} tokens</strong></span>
          <span>Total calls/month: <strong style={{ color: "#1a1a1a", fontFamily: "'IBM Plex Mono', monospace" }}>{(callsPerDay * 30).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {PROVIDERS.map(p => (
            <button key={p} onClick={() => setSelectedProvider(p)} style={{
              padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: selectedProvider === p ? "1.5px solid #1a1a1a" : "1px solid #e0ddd8",
              background: selectedProvider === p ? "#1a1a1a" : "#fff",
              color: selectedProvider === p ? "#fff" : "#777",
              fontFamily: "inherit", transition: "all 0.12s",
            }}>{p}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "#888" }}>
          <span style={{ fontWeight: 600 }}>Sort:</span>
          {[["monthly", "Monthly cost"], ["input", "Input price"], ["output", "Output price"]].map(([val, label]) => (
            <button key={val} onClick={() => setSortBy(val)} style={{
              padding: "5px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer",
              border: sortBy === val ? "1.5px solid #555" : "1px solid #e0ddd8",
              background: sortBy === val ? "#555" : "#fff",
              color: sortBy === val ? "#fff" : "#888",
              fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* MODEL CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 40 }}>
        {calculated.results.map(({ model, costPerCall, monthlyCost, costPerConversation }) => (
          <ModelCard key={model.id} model={model} costPerCall={costPerCall} monthlyCost={monthlyCost} costPerConversation={costPerConversation}
            isLowest={model.id === calculated.lowestId} />
        ))}
      </div>

      {/* AD SLOT 2 — between cards and summary */}
      <AdBanner slot="0987654321" format="auto" />

      {/* SUMMARY BAR */}
      {calculated.results.length >= 2 && (
        <div style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", borderRadius: 16,
          padding: "28px 32px", marginBottom: 40, color: "#fff",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginBottom: 14 }}>Cost comparison summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Cheapest option</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{calculated.results[0].model.name}</div>
              <div style={{ fontSize: 14, color: "#10b981", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{formatCost(calculated.results[0].monthlyCost)}/mo</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Most expensive</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{calculated.results[calculated.results.length - 1].model.name}</div>
              <div style={{ fontSize: 14, color: "#ef4444", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{formatCost(calculated.results[calculated.results.length - 1].monthlyCost)}/mo</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>You could save</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#10b981", fontFamily: "'IBM Plex Mono', monospace" }}>
                {Math.round(((calculated.results[calculated.results.length - 1].monthlyCost - calculated.results[0].monthlyCost) / calculated.results[calculated.results.length - 1].monthlyCost) * 100)}%
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>by switching to {calculated.results[0].model.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* AD SLOT 3 — before educational content */}
      <AdBanner slot="1122334455" format="horizontal" />

      {/* HOW IT WORKS */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>How AI API pricing works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "What are tokens?", text: "Tokens are chunks of text that AI models process. 1 token ≈ 4 English characters or ¾ of a word. A 1,000-word document uses ~1,300 tokens." },
            { title: "Input vs Output pricing", text: "You pay separately for the text you send (input) and the text the AI generates (output). Output tokens typically cost 2-4× more than input." },
            { title: "Why prices vary so much", text: "Smaller, faster models (Haiku, GPT-5.4 nano) cost 10-50× less than flagship models. For simple tasks, they perform just as well." },
            { title: "Hidden cost: context window", text: "Larger context windows (1M+ tokens) let you send more text per call, but you pay for every token. System prompts count toward your bill." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#f9f8f6", borderRadius: 12, padding: "20px 22px", border: "1px solid #eeece7" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#1a1a1a" }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
