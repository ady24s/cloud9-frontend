import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountLoginPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google OAuth flow
    setTimeout(() => {
      console.log("Google login successful");
      setIsLoading(false);
      // Navigate to credentials page
      navigate("/LoginPage");
    }, 2000);
  };

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    // Simulate Microsoft OAuth flow
    setTimeout(() => {
      console.log("Microsoft login successful");
      setIsLoading(false);
      // Navigate to credentials page
      navigate("/LoginPage");
    }, 2000);
  };

  const handleExistingAccount = (provider) => {
    console.log(`Using existing ${provider} account`);
    navigate("/LoginPage");
  };

  // Animated Cloud Background (same as LoginPage)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let clouds = [];

    class Cloud {
      constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.opacity = Math.random() * 0.3 + 0.1;
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

        if (this.x - this.radius > canvasWidth) {
          this.x = -this.radius * 2;
          this.y = Math.random() * canvas.height * 0.6;
          this.puffs = this.generatePuffs();
        }
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      clouds = [];
      const cloudCount = Math.floor(canvas.width / 200);

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

      clouds.forEach((cloud) => {
        cloud.draw(ctx);
        cloud.update(canvas.width);
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

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

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <div style={styles.header}>
            <span style={styles.logoIcon}>☁</span>
            <h1 style={styles.title}>Cloud9 Account Login</h1>
            <p style={styles.subtitle}>
              Connect your account to get started with multi-cloud management
            </p>
          </div>

          {/* Login Options */}
          <div style={styles.loginOptions}>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                ...styles.loginButton,
                ...styles.googleButton,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <div style={styles.spinner}></div>
              ) : (
                <>
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    style={styles.providerIcon}
                  />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <button
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              style={{
                ...styles.loginButton,
                ...styles.microsoftButton,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <div style={styles.spinner}></div>
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                    alt="Microsoft"
                    style={styles.providerIcon}
                  />
                  <span>Continue with Microsoft</span>
                </>
              )}
            </button>
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>OR</span>
          </div>

          {/* Existing Accounts */}
          <div style={styles.existingAccounts}>
            <h3 style={styles.existingTitle}>Use Existing Account</h3>
            <div style={styles.existingButtons}>
              <button
                onClick={() => handleExistingAccount("Google")}
                style={{ ...styles.existingButton, ...styles.existingGoogle }}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={styles.smallIcon}
                />
                Google
              </button>
              <button
                onClick={() => handleExistingAccount("Microsoft")}
                style={{
                  ...styles.existingButton,
                  ...styles.existingMicrosoft,
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft"
                  style={styles.smallIcon}
                />
                Microsoft
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div style={styles.securityNotice}>
            <p style={styles.securityText}>
              🔒 Your data is encrypted and secure. We only access necessary
              permissions.
            </p>
          </div>
        </div>
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
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 10,
    background: "rgba(255,255,255,0.9)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "25px",
    color: "#333",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  container: {
    position: "relative",
    zIndex: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  loginCard: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "450px",
    width: "100%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logoIcon: {
    fontSize: "3rem",
    display: "block",
    marginBottom: "16px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "8px",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: "1.5",
  },
  loginOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "30px",
  },
  loginButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "16px 24px",
    borderRadius: "12px",
    border: "2px solid transparent",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
  },
  googleButton: {
    background: "white",
    color: "#1f2937",
    border: "2px solid #e5e7eb",
  },
  microsoftButton: {
    background: "#0078d4",
    color: "white",
  },
  providerIcon: {
    width: "24px",
    height: "24px",
    objectFit: "contain",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid #f3f3f3",
    borderTop: "2px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  divider: {
    position: "relative",
    textAlign: "center",
    marginBottom: "30px",
  },
  dividerText: {
    background: "rgba(255,255,255,0.95)",
    padding: "0 16px",
    color: "#64748b",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  existingAccounts: {
    marginBottom: "30px",
  },
  existingTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: "16px",
  },
  existingButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  existingButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "white",
    color: "#374151",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  existingGoogle: {
    borderColor: "#db4437",
  },
  existingMicrosoft: {
    borderColor: "#0078d4",
  },
  smallIcon: {
    width: "16px",
    height: "16px",
    objectFit: "contain",
  },
  securityNotice: {
    background: "rgba(16, 185, 129, 0.1)",
    borderRadius: "8px",
    padding: "12px",
    textAlign: "center",
  },
  securityText: {
    fontSize: "0.875rem",
    color: "#065f46",
    margin: 0,
    fontWeight: "500",
  },
};

// Add CSS animations
const css = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
  
  .existing-button:hover {
    background: #f9fafb !important;
  }
`;

// Inject CSS
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("account-login-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  const styleSheet = document.createElement("style");
  styleSheet.id = "account-login-styles";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}

export default AccountLoginPage;
