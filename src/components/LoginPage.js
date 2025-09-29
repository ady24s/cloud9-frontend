import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setProvider = () => {} }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const canvasRef = useRef(null);

  const handleLogin = (provider) => {
    console.log("Logging in with:", provider);
    setProvider(provider);
    localStorage.setItem("provider", provider);

    try {
      navigate("/CloudCredentials");
    } catch (error) {
      console.error("Navigation failed:", error);
      window.location.href = "/CloudCredentials";
    }

    setDropdownOpen(false);
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".login-btn")
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animated Cloud Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let clouds = [];

    // Cloud class for animated clouds
    class Cloud {
      constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.opacity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4 opacity
        this.puffs = this.generatePuffs();
      }

      generatePuffs() {
        const puffCount = Math.floor(Math.random() * 3) + 4;
        const puffs = [];
        for (let i = 0; i < puffCount; i++) {
          puffs.push({
            offsetX: (Math.random() - 0.5) * this.radius * 1.5,
            offsetY: (Math.random() - 0.5) * this.radius * 0.8,
            radius: this.radius * (0.4 + Math.random() * 0.4),
          });
        }
        return puffs;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Create gradient for cloud
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.5, "rgba(240, 245, 255, 0.6)");
        gradient.addColorStop(1, "rgba(230, 240, 255, 0.2)");

        ctx.fillStyle = gradient;

        // Draw cloud puffs
        this.puffs.forEach((puff) => {
          ctx.beginPath();
          ctx.arc(
            this.x + puff.offsetX,
            this.y + puff.offsetY,
            puff.radius,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });

        ctx.restore();
      }

      update(canvasWidth) {
        this.x += this.speed;

        // Wrap around when cloud goes off screen
        if (this.x - this.radius > canvasWidth) {
          this.x = -this.radius * 2;
          this.y = Math.random() * canvas.height * 0.6;
          this.puffs = this.generatePuffs();
        }
      }
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Regenerate clouds on resize
      clouds = [];
      const cloudCount = Math.floor(canvas.width / 200); // Adjust cloud density

      for (let i = 0; i < cloudCount; i++) {
        clouds.push(
          new Cloud(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.5,
            40 + Math.random() * 60,
            0.2 + Math.random() * 0.5
          )
        );
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update clouds
      clouds.forEach((cloud) => {
        cloud.draw(ctx);
        cloud.update(canvas.width);
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={styles.page}>
      {/* Animated Cloud Background Canvas */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Gradient overlay */}
      <div style={styles.overlay}></div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>☁</span>
          <span style={styles.logoText}>Cloud9</span>
        </div>
        <div className="nav-links">
          <div className="dropdown">
            <button
              className="nav-btn login-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>Login</span>
              <span style={styles.arrow}>›</span>
            </button>

            {dropdownOpen && (
              <div ref={dropdownRef} className="dropdown-content">
                <div className="dropdown-header">Choose your provider</div>
                <div
                  className="login-option"
                  onClick={() => handleLogin("gcp")}
                >
                  <img
                    src="https://logos-world.net/wp-content/uploads/2021/02/Google-Cloud-Logo.png"
                    alt="Google Cloud"
                    className="provider-logo"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="provider-icon-fallback"
                    style={{ display: "none" }}
                  >
                    GCP
                  </div>
                  <div>
                    <div className="provider-name">Google Cloud</div>
                    <div className="provider-desc">Continue with GCP</div>
                  </div>
                </div>
                <div
                  className="login-option"
                  onClick={() => handleLogin("azure")}
                >
                  <img
                    src="https://logos-world.net/wp-content/uploads/2021/02/Microsoft-Azure-Logo.png"
                    alt="Microsoft Azure"
                    className="provider-logo"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="provider-icon-fallback"
                    style={{ display: "none" }}
                  >
                    AZ
                  </div>
                  <div>
                    <div className="provider-name">Microsoft Azure</div>
                    <div className="provider-desc">Continue with Azure</div>
                  </div>
                </div>
                <div
                  className="login-option"
                  onClick={() => handleLogin("aws")}
                >
                  <img
                    src="https://logos-world.net/wp-content/uploads/2021/08/Amazon-Web-Services-AWS-Logo.png"
                    alt="Amazon AWS"
                    className="provider-logo"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="provider-icon-fallback"
                    style={{ display: "none" }}
                  >
                    AWS
                  </div>
                  <div>
                    <div className="provider-name">Amazon AWS</div>
                    <div className="provider-desc">Continue with AWS</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="nav-btn signup-btn">Get Started</button>
          <button className="nav-btn" onClick={scrollToAbout}>
            About
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <h1 style={styles.title}>
            <span style={{ whiteSpace: "nowrap" }}>
              Cloud Resource Management,
            </span>
            <span style={styles.titleGradient}> Simplified</span>
          </h1>

          <p style={styles.subtitle}>
            Unite your AWS, Azure, and Google Cloud infrastructure in one
            powerful dashboard. Monitor performance, optimize costs, and scale
            with confidence.
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.checkmark}>✓</span>
              <span>Real-time monitoring</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkmark}>✓</span>
              <span>Cost optimization</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkmark}>✓</span>
              <span>Multi-cloud support</span>
            </div>
          </div>

          <div style={styles.cta}>
            <button style={styles.primaryBtn}>
              Start Free Trial
              <span style={styles.btnArrow}>→</span>
            </button>
            <button style={styles.secondaryBtn}>Watch Demo</button>
          </div>

          <p style={styles.footer}>
            No credit card required • 14-day free trial • Setup in 2 minutes
          </p>
        </div>
      </div>

      {/* About Section */}
      <div id="about-section" style={styles.aboutSection}>
        <div style={styles.aboutContainer}>
          <h2 style={styles.aboutTitle}>
            <span style={styles.aboutTitleGradient}>About</span>
          </h2>

          <p style={styles.aboutIntro}>
            Cloud9 tackles the $100B+ cloud waste problem affecting startups and
            small businesses. Our AI-driven platform combines real-time resource
            monitoring, predictive cost optimization, and automated security
            compliance in one intuitive dashboard.
          </p>

          <div style={styles.capabilitiesGrid}>
            <div style={styles.capability}>
              <div style={styles.capabilityIcon}>💰</div>
              <h3 style={styles.capabilityTitle}>Cost Optimization</h3>
              <p style={styles.capabilityDesc}>
                AI algorithms detect idle VMs and over-provisioned instances,
                reducing OpEx by 30-60%
              </p>
            </div>

            <div style={styles.capability}>
              <div style={styles.capabilityIcon}>🛡️</div>
              <h3 style={styles.capabilityTitle}>Security Automation</h3>
              <p style={styles.capabilityDesc}>
                Continuous compliance monitoring with auto-fixes for
                misconfigurations like open S3 buckets and exposed ports
              </p>
            </div>

            <div style={styles.capability}>
              <div style={styles.capabilityIcon}>🔮</div>
              <h3 style={styles.capabilityTitle}>Predictive Analytics</h3>
              <p style={styles.capabilityDesc}>
                Machine learning models forecast usage patterns and recommend
                resource reallocation
              </p>
            </div>

            <div style={styles.capability}>
              <div style={styles.capabilityIcon}>🌱</div>
              <h3 style={styles.capabilityTitle}>Green Computing</h3>
              <p style={styles.capabilityDesc}>
                Reduce carbon footprint through intelligent resource management
              </p>
            </div>
          </div>

          <div style={styles.uniqueValue}>
            <p style={styles.uniqueValueText}>
              Built by Cloud Engineers, Designed for Enterprises.
            </p>
          </div>
        </div>
      </div>
      <div style={{}}>
        <button style={styles.goBackBtn} onClick={() => navigate("/")}>
          ← Go Back
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  canvas: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1,
    pointerEvents: "none",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)",
    zIndex: 2,
    pointerEvents: "none",
  },
  navbar: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 5%",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcon: {
    fontSize: "2.8rem",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
  },
  logoText: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "white",
    letterSpacing: "-0.5px",
  },
  arrow: {
    display: "inline-block",
    marginLeft: "6px",
    transition: "transform 0.3s ease",
    transform: "rotate(90deg)",
  },
  container: {
    position: "relative",
    zIndex: 5,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: "calc(100vh - 90px)",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  leftSection: {
    maxWidth: "600px",
  },
  title: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: "800",
    marginBottom: "24px",
    color: "white",
    lineHeight: "1.1",
    letterSpacing: "-1px",
  },
  titleGradient: {
    background: "linear-gradient(120deg, #ffd89b 0%, #19c2ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "1.125rem",
    marginBottom: "32px",
    color: "rgba(255,255,255,0.85)",
    lineHeight: "1.6",
    fontWeight: "400",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "36px",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "rgba(255,255,255,0.9)",
    fontSize: "1rem",
  },
  checkmark: {
    width: "24px",
    height: "24px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "bold",
  },
  cta: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "white",
    color: "#667eea",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
  btnArrow: {
    fontSize: "1.2rem",
    transition: "transform 0.3s ease",
  },
  secondaryBtn: {
    background: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  footer: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.7)",
    marginTop: "16px",
  },
  aboutSection: {
    position: "relative",
    zIndex: 5,
    background: "rgba(255,255,255,0.95)",
    minHeight: "100vh",
    padding: "80px 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  aboutContainer: {
    maxWidth: "1200px",
    width: "100%",
    textAlign: "center",
  },
  aboutTitle: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: "800",
    marginBottom: "24px",
    color: "#1e293b",
    lineHeight: "1.2",
  },
  aboutTitleGradient: {
    background: "linear-gradient(120deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  aboutIntro: {
    fontSize: "1.25rem",
    marginBottom: "48px",
    color: "#475569",
    lineHeight: "1.7",
    maxWidth: "800px",
    margin: "0 auto 48px",
  },
  capabilitiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "32px",
    marginBottom: "48px",
  },
  capability: {
    background: "white",
    padding: "20px 20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  capabilityIcon: {
    fontSize: "3rem",
    marginBottom: "16px",
    display: "block",
  },
  capabilityTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1e293b",
  },
  capabilityDesc: {
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: "1.6",
  },
  uniqueValue: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "32px",
    borderRadius: "16px",
    color: "white",
  },
  uniqueValueText: {
    fontSize: "2rem",
    lineHeight: "1.7",
    margin: 0,
    fontWeight: "700",
  },
  uniqueValueSubText: {
    fontSize: "1.25rem",
    lineHeight: "1.4",
    margin: 0,
    fontWeight: "500",
    opacity: 0.9,
  },
  goBackBtn: {
    background: "#333",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

// Enhanced CSS with modern styling
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .nav-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 10px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif;
  }
  
  .nav-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .login-btn:hover .arrow {
    transform: rotate(90deg) translateX(2px);
  }
  
  .signup-btn {
    background: rgba(255,255,255,0.95);
    color: #667eea;
    border: none;
    font-weight: 600;
  }
  
  .signup-btn:hover {
    background: white;
    box-shadow: 0 6px 20px rgba(255,255,255,0.3);
  }
  
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-content {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 16px;
    overflow: hidden;
    min-width: 280px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    border: 1px solid rgba(0,0,0,0.05);
    animation: dropdownFade 0.3s ease;
  }
  
  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  .dropdown-header {
    padding: 16px 20px 12px 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
  }
  
  .login-option {
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .login-option:last-child {
    border-bottom: none;
  }
  
  .login-option:hover {
    background: #f8fafc;
    padding-left: 24px;
  }
  
  .provider-logo {
    width: 75px;
    height: 75px;
    object-fit: contain;
    border-radius: 8px;
    background: #f8fafc;
    padding: 8px;
  }
  
  .provider-icon-fallback {
    width: 48px;
    height: 48px;
    background: #e2e8f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
  }
  
  .provider-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
    margin-bottom: 2px;
  }
  
  .provider-desc {
    font-size: 0.8rem;
    color: #64748b;
  }
  
  button[style*="primaryBtn"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
  
  button[style*="primaryBtn"]:hover span {
    transform: translateX(4px);
  }
  
  button[style*="secondaryBtn"]:hover {
    background: rgba(255,255,255,0.2) !important;
    transform: translateY(-2px);
  }

  .capability:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
`;

// Inject CSS safely
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("login-page-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  const styleSheet = document.createElement("style");
  styleSheet.id = "login-page-styles";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}

export default LoginPage;
