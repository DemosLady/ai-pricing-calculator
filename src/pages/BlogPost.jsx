import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BLOG_POSTS } from "../data/posts.js";

const ADSENSE_PUB_ID = "ca-pub-7675527666098811";
const ADS_ENABLED = true;

function BlogAdBanner({ slot }) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (ADS_ENABLED) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        const timer = setTimeout(() => {
          const container = document.querySelector(`[data-ad-slot="${slot}"]`);
          if (container && container.offsetHeight > 0) setAdLoaded(true);
        }, 2000);
        return () => clearTimeout(timer);
      } catch (e) { console.error("AdSense error:", e); }
    }
  }, [slot]);

  return (
    <div style={{ margin: "28px 0", textAlign: "center", overflow: "hidden", minHeight: 90, position: "relative" }}>
      {ADS_ENABLED && (
        <ins className="adsbygoogle" style={{ display: "block" }}
          data-ad-client={ADSENSE_PUB_ID} data-ad-slot={slot}
          data-ad-format="auto" data-full-width-responsive="true" />
      )}
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

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = post.title;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.description);
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 16px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Post not found</h1>
        <p style={{ color: "#777", marginTop: 12 }}>
          <Link to="/blog" style={{ color: "#1a1a1a" }}>← Back to blog</Link>
        </p>
      </div>
    );
  }

  const midpoint = Math.floor(post.sections.length / 2);

  return (
    <article style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px" }}>

      {/* HEADER */}
      <div style={{ padding: "48px 0 32px" }}>
        <Link to="/blog" style={{ fontSize: 13, color: "#999", textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
          ← All posts
        </Link>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#999", marginBottom: 12 }}>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.25, margin: 0, color: "#0d0d0d" }}>
          {post.title}
        </h1>
      </div>

      {/* AD SLOT — top of article */}
      <BlogAdBanner slot="2233445566" />

      {/* ARTICLE BODY */}
      {post.sections.map((section, i) => (
        <div key={i}>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#1a1a1a" }}>
              {section.heading}
            </h2>
            {section.content.split("\n\n").map((paragraph, j) => (
              <p key={j} style={{ fontSize: 16, lineHeight: 1.75, color: "#444", marginBottom: 16 }}>
                {paragraph}
              </p>
            ))}
          </section>

          {/* AD SLOT — middle of article */}
          {i === midpoint && <BlogAdBanner slot="3344556677" />}
        </div>
      ))}

      {/* CTA — back to calculator */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        borderRadius: 14, padding: "28px 32px", margin: "40px 0", color: "#fff",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Calculate your exact costs
        </div>
        <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6, margin: "0 0 16px" }}>
          Use our free calculator to compare costs across 12+ AI models with interactive sliders.
        </p>
        <Link to="/" style={{
          display: "inline-block", background: "#fff", color: "#1a1a1a",
          padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700,
          textDecoration: "none", transition: "opacity 0.15s",
        }}>
          Open Calculator →
        </Link>
      </div>

      {/* AD SLOT — bottom of article */}
      <BlogAdBanner slot="4455667788" />

      {/* OTHER POSTS */}
      <div style={{ margin: "40px 0 48px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>More articles</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {BLOG_POSTS.filter(p => p.slug !== slug).map(p => (
            <Link to={`/blog/${p.slug}`} key={p.slug} style={{
              textDecoration: "none", color: "inherit",
              background: "#f9f8f6", border: "1px solid #eeece7", borderRadius: 10,
              padding: "16px 20px", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#ccc"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#eeece7"}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{p.readTime}</div>
            </Link>
          ))}
        </div>
      </div>

    </article>
  );
}
