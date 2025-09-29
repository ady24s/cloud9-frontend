import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CloudCredentials = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [provider, setProvider] = useState("");
  const [credentials, setCredentials] = useState({
    accessKey: "",
    secretKey: "",
    region: "",
    subscriptionId: "",
    tenantId: "",
    clientId: "",
    clientSecret: "",
    projectId: "",
    keyFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Get the selected provider from localStorage
    const selectedProvider = localStorage.getItem("provider");
    if (selectedProvider) {
      setProvider(selectedProvider);
    } else {
      // If no provider selected, redirect back to login
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCredentials((prev) => ({
        ...prev,
        keyFile: file,
      }));
    }
  };

  const validateCredentials = () => {
    switch (provider) {
      case "aws":
        return (
          credentials.accessKey && credentials.secretKey && credentials.region
        );
      case "azure":
        return (
          credentials.subscriptionId &&
          credentials.tenantId &&
          credentials.clientId &&
          credentials.clientSecret
        );
      case "gcp":
        return (
          credentials.projectId &&
          (credentials.keyFile || credentials.secretKey)
        );
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to validate and store credentials
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store credentials and provider info (even if empty for now)
      const credentialsToStore = {
        provider,
        ...credentials,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        "cloudCredentials",
        JSON.stringify(credentialsToStore)
      );

      // Navigate to dashboard
      navigate("/Dashboard");
    } catch (error) {
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate("/LoginPage");
  };

  const getProviderName = () => {
    switch (provider) {
      case "aws":
        return "Amazon AWS";
      case "azure":
        return "Microsoft Azure";
      case "gcp":
        return "Google Cloud Platform";
      default:
        return "Cloud Provider";
    }
  };

  const getProviderIcon = () => {
    switch (provider) {
      case "aws":
        return (
          <img
            src="https://logos-world.net/wp-content/uploads/2021/08/Amazon-Web-Services-AWS-Logo.png"
            alt="AWS"
            style={styles.providerLogo}
          />
        );
      case "azure":
        return (
          <img
            src="https://logos-world.net/wp-content/uploads/2021/02/Microsoft-Azure-Logo.png"
            alt="Azure"
            style={styles.providerLogo}
          />
        );
      case "gcp":
        return (
          <img
            src="https://logos-world.net/wp-content/uploads/2021/02/Google-Cloud-Logo.png"
            alt="Google Cloud"
            style={styles.providerLogo}
          />
        );
      default:
        return <span style={styles.defaultIcon}>☁</span>;
    }
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

  const renderCredentialFields = () => {
    switch (provider) {
      case "aws":
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Access Key ID *</label>
              <input
                type="text"
                value={credentials.accessKey}
                onChange={(e) => handleInputChange("accessKey", e.target.value)}
                placeholder="AKIA..."
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Secret Access Key *</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.secretKey}
                  onChange={(e) =>
                    handleInputChange("secretKey", e.target.value)
                  }
                  placeholder="Your AWS secret key"
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePassword}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Default Region *</label>
              <select
                value={credentials.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
                style={styles.select}
              >
                <option value="">Select a region</option>
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">Europe (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              </select>
            </div>
          </>
        );

      case "azure":
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Subscription ID *</label>
              <input
                type="text"
                value={credentials.subscriptionId}
                onChange={(e) =>
                  handleInputChange("subscriptionId", e.target.value)
                }
                placeholder="00000000-0000-0000-0000-000000000000"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tenant ID *</label>
              <input
                type="text"
                value={credentials.tenantId}
                onChange={(e) => handleInputChange("tenantId", e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Client ID *</label>
              <input
                type="text"
                value={credentials.clientId}
                onChange={(e) => handleInputChange("clientId", e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Client Secret *</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.clientSecret}
                  onChange={(e) =>
                    handleInputChange("clientSecret", e.target.value)
                  }
                  placeholder="Your Azure client secret"
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePassword}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </>
        );

      case "gcp":
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Project ID *</label>
              <input
                type="text"
                value={credentials.projectId}
                onChange={(e) => handleInputChange("projectId", e.target.value)}
                placeholder="my-project-id"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Service Account Key File *</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={styles.fileInput}
              />
              <p style={styles.fileHelp}>
                Upload your service account JSON key file
              </p>
            </div>
          </>
        );

      default:
        return <div>Please select a cloud provider first.</div>;
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated Cloud Background Canvas */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Gradient overlay */}
      <div style={styles.overlay}></div>

      {/* Back Button */}
      <button onClick={goBack} style={styles.backButton}>
        ← Back to Provider Selection
      </button>

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.credentialsCard}>
          <div style={styles.header}>
            <div style={styles.providerIconContainer}>{getProviderIcon()}</div>
            <h1 style={styles.title}>{getProviderName()} Credentials</h1>
            <p style={styles.subtitle}>
              Enter your cloud credentials to connect to your infrastructure
              (Optional for now)
            </p>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {renderCredentialFields()}

            <div style={styles.securityNotice}>
              <div style={styles.securityIcon}>🔒</div>
              <div>
                <strong>Skip credentials for now</strong>
                <p style={styles.securityText}>
                  You can continue to the dashboard without entering
                  credentials. Add your credentials later to access real cloud
                  data and monitoring features.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner}></div>
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <span>Connect to Dashboard</span>
                  <span style={styles.buttonArrow}>→</span>
                </>
              )}
            </button>
          </form>

          <div style={styles.helpSection}>
            <h3 style={styles.helpTitle}>
              Need help finding your credentials?
            </h3>
            <div style={styles.helpLinks}>
              {provider === "aws" && (
                <a
                  href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.helpLink}
                >
                  AWS Documentation →
                </a>
              )}
              {provider === "azure" && (
                <a
                  href="https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.helpLink}
                >
                  Azure Documentation →
                </a>
              )}
              {provider === "gcp" && (
                <a
                  href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.helpLink}
                >
                  GCP Documentation →
                </a>
              )}
            </div>
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
    overflow: "auto",
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
    padding: "40px 20px",
  },
  credentialsCard: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  providerIconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  providerLogo: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.8)",
    padding: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  defaultIcon: {
    fontSize: "3rem",
    display: "block",
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
  errorMessage: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#dc2626",
    fontSize: "0.875rem",
  },
  errorIcon: {
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    background: "white",
    transition: "border-color 0.3s ease",
    outline: "none",
  },
  select: {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    background: "white",
    cursor: "pointer",
    outline: "none",
  },
  passwordContainer: {
    position: "relative",
  },
  togglePassword: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
  },
  fileInput: {
    padding: "8px",
    border: "2px dashed #e5e7eb",
    borderRadius: "8px",
    background: "#f9fafb",
    cursor: "pointer",
  },
  fileHelp: {
    fontSize: "0.75rem",
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  securityNotice: {
    background: "rgba(16, 185, 129, 0.1)",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  securityIcon: {
    fontSize: "1.5rem",
  },
  securityText: {
    fontSize: "0.875rem",
    color: "#065f46",
    margin: "4px 0 0 0",
    lineHeight: "1.4",
  },
  submitButton: {
    background: "#667eea",
    color: "white",
    border: "none",
    padding: "16px 24px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
  },
  buttonArrow: {
    fontSize: "1.2rem",
    transition: "transform 0.3s ease",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  helpSection: {
    marginTop: "30px",
    textAlign: "center",
  },
  helpTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "12px",
  },
  helpLinks: {
    display: "flex",
    justifyContent: "center",
  },
  helpLink: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};

// Add CSS animations
const css = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus, select:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
  
  a:hover {
    color: #4f46e5 !important;
  }
`;

// Inject CSS
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("cloud-credentials-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  const styleSheet = document.createElement("style");
  styleSheet.id = "cloud-credentials-styles";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}

export default CloudCredentials;
