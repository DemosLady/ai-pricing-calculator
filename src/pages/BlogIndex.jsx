import { Link } from "react-router-dom";
import { useEffect } from "react";
import { BLOG_POSTS } from "../data/posts.js";

export default function BlogIndex() {
  useEffect(() => {
    document.title = "Blog — AI API Pricing Calculator";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Articles about AI API pricing, token costs, and how to optimize your LLM spending. GPT, Claude, Gemini pricing guides.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>

      <div style={{ padding: "48px 0 40px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 10px", color: "#0d0d0d" }}>
          Blog
        </h1>
        <p style={{ fontSize: 16, color: "#777", lineHeight: 1.6, margin: 0 }}>
          Pricing guides, cost comparisons, and tips to reduce your AI API spending.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
        {BLOG_POSTS.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.slug} style={{
            textDecoration: "none", color: "inherit",
            background: "#fff", border: "1px solid #eeece7", borderRadius: 12,
            padding: "24px 28px", transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#eeece7"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#999", marginBottom: 8 }}>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#1a1a1a", lineHeight: 1.3 }}>
              {post.title}
            </h2>
            <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 }}>
              {post.description}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}
