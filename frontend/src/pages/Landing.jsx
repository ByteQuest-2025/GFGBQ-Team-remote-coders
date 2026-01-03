import "../styles/landing.css";
import Lottie from "lottie-react";
import medicalAnimation from "../assets/Medical-Healthcare.json";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const howItWorksRef = useRef(null);

  const { isLoggedIn, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  const scrollToHowItWorks = () => {
    setOpenMenu(false);
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          SilentSense<span>AI</span>
        </div>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? '✕' : '☰'}
        </button>

        <ul className="nav-links">
          <li onClick={() => setOpenMenu(false)}>Home</li>
          <li onClick={() => setOpenMenu(false)}>Platform</li>
          <li onClick={() => setOpenMenu(false)}>Research</li>
          <li onClick={() => setOpenMenu(false)}>About</li>
          <li onClick={() => setOpenMenu(false)}>Contact</li>
        </ul>

        <div className="nav-actions">
          {!isLoggedIn ? (
            <>
              <button
                className="nav-login-btn"
                onClick={() => { setOpenMenu(false); navigate("/login"); }}
              >
                Login
              </button>

              <button
                className="nav-signup-btn"
                onClick={() => { setOpenMenu(false); navigate("/signup"); }}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-login-btn"
                onClick={() => navigate("/tellme")}
              >
                Dashboard
              </button>

              <button
                className="nav-signup-btn"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}
        </div>

        <div className={`mobile-menu ${openMenu ? 'open' : ''}`} role="menu">
          <ul>
            <li onClick={() => setOpenMenu(false)}>Home</li>
            <li onClick={() => setOpenMenu(false)}>Platform</li>
            <li onClick={() => setOpenMenu(false)}>Research</li>
            <li onClick={() => setOpenMenu(false)}>About</li>
            <li onClick={() => setOpenMenu(false)}>Contact</li>
          </ul>
          <div className="mobile-actions">
            <button className="nav-login-btn" onClick={() => { setOpenMenu(false); navigate('/login'); }}>Login</button>
            <button className="nav-signup-btn" onClick={() => { setOpenMenu(false); navigate('/signup'); }}>Signup</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero hero-full">
        <div className="hero-content">
          {/* LEFT */}
          <div className="hero-text">
            <span className="hero-tag">
              AI-POWERED PREVENTIVE HEALTHCARE
            </span>

            <h1>
              Detect Silent Diseases <br />
              <span>Before Symptoms Appear</span>
            </h1>

            <p>
              Silent Sense AI analyzes lab trends, lifestyle signals,
              stress indicators, and family history to identify early
              health risks — before clinical diagnosis.
            </p>

            <div className="hero-actions">
              <button
                className="primary-btn"
                onClick={() =>
                  isLoggedIn
                    ? navigate("/tellme")
                    : navigate("/login")
                }
              >
                {isLoggedIn ? "Go to Dashboard" : "Explore Platform"}
              </button>

              <button
                className="secondary-outline-btn"
                onClick={scrollToHowItWorks}
              >
                How It Works
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-animation">
            <Lottie
              animationData={medicalAnimation}
              loop
              autoplay
              className="lottie-hero"
            />
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="mission">
        <div className="mission-inner">
          <span className="section-tag">OUR MISSION</span>

          <h2>
            From Reactive Diagnosis to
            <span> Predictive Prevention</span>
          </h2>

          <p>
            Millions of people live with undetected health risks for years.
            SilentSenseAI exists to surface these risks early by connecting
            fragmented health signals into meaningful, preventive intelligence.
          </p>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="capabilities">
        <div className="capabilities-container">
          <span className="section-tag">CORE CAPABILITIES</span>
          <h2>Designed to Detect What Humans Miss</h2>

          <div className="capability-grid">
            <div className="capability-card">
              <div className="capability-icon">📊</div>
              <h3>Multi-Signal Aggregation</h3>
              <p>
                Combines lab reports, lifestyle data, stress indicators,
                and family history into one unified health profile.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">🔍</div>
              <h3>Trend-Based Intelligence</h3>
              <p>
                Focuses on long-term trends and subtle deviations,
                not just threshold breaches.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">📈</div>
              <h3>Risk Probability Scores</h3>
              <p>
                Outputs explainable risk probabilities instead of
                binary disease labels.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">🤖</div>
              <h3>Explainable AI</h3>
              <p>
                Clearly shows which factors contribute to risk,
                enabling trust and transparency.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">💡</div>
              <h3>Preventive Recommendations</h3>
              <p>
                Actionable lifestyle, screening, and clinical
                guidance tailored to risk level.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">⚖️</div>
              <h3>Ethical by Design</h3>
              <p>
                Built to assist doctors and patients —
                never to replace medical judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" ref={howItWorksRef}>
        <div className="how-it-works-container">
          <span className="section-tag">HOW IT WORKS</span>
          <h2>Turning Weak Signals into Early Warnings</h2>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <h4>Data Collection</h4>
              <p>
                Securely collect lab data, lifestyle inputs,
                mental health indicators, and family history.
              </p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h4>Signal Correlation</h4>
              <p>
                AI correlates non-obvious signals across time
                to detect emerging risk patterns.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h4>Risk Scoring</h4>
              <p>
                Generates disease-specific probability scores
                instead of yes/no diagnoses.
              </p>
            </div>

            <div className="step">
              <div className="step-number">04</div>
              <h4>Preventive Action</h4>
              <p>
                Provides early guidance for patients
                and clinical insights for doctors.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
