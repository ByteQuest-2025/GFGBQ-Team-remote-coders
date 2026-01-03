import "../styles/landing.css";
import Lottie from "lottie-react";
import medicalAnimation from "../assets/Medical-Healthcare.json";

const Landing = () => {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">SilentSense<span>AI</span></div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Platform</li>
          <li>Research</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <button className="nav-btn">Login</button>
      </nav>

      {/* HERO (FULL SCREEN) */}
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
              <button className="primary-btn">Explore Platform</button>
              <button className="secondary-outline-btn">
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

      {/* NEXT SECTION (APPEARS AFTER SCROLL) */}
      {/* <section className="about">
        <div className="about-text">
          <span className="section-tag">OUR MISSION</span>
          <h2>From Reactive Care to Predictive Prevention</h2>
          <p>
            Most life-threatening diseases remain undiagnosed for years
            due to mild or fragmented symptoms. Silent Sense AI connects
            weak health signals into actionable intelligence.
          </p>
        </div>
      </section> */}

      {/* OUR MISSION */}
<section className="mission">
  <div className="mission-content">
    <span className="section-tag">OUR MISSION</span>
    <h2>From Reactive Diagnosis to Predictive Prevention</h2>
    <p>
      Millions of people live with undetected health risks for years.
      SilentSenseAI exists to surface these risks early by connecting
      fragmented health signals into meaningful, preventive intelligence.
    </p>
  </div>
</section>

{/* CORE CAPABILITIES */}
<section className="capabilities">
  <span className="section-tag">CORE CAPABILITIES</span>
  <h2>Designed to Detect What Humans Miss</h2>

  <div className="capability-grid">
    <div className="capability-card">
      <h3>Multi-Signal Aggregation</h3>
      <p>
        Combines lab reports, lifestyle data, stress indicators,
        and family history into one unified health profile.
      </p>
    </div>

    <div className="capability-card">
      <h3>Trend-Based Intelligence</h3>
      <p>
        Focuses on long-term trends and subtle deviations,
        not just threshold breaches.
      </p>
    </div>

    <div className="capability-card">
      <h3>Risk Probability Scores</h3>
      <p>
        Outputs explainable risk probabilities instead of
        binary disease labels.
      </p>
    </div>

    <div className="capability-card">
      <h3>Explainable AI</h3>
      <p>
        Clearly shows which factors contribute to risk,
        enabling trust and transparency.
      </p>
    </div>

    <div className="capability-card">
      <h3>Preventive Recommendations</h3>
      <p>
        Actionable lifestyle, screening, and clinical
        guidance tailored to risk level.
      </p>
    </div>

    <div className="capability-card">
      <h3>Ethical by Design</h3>
      <p>
        Built to assist doctors and patients —
        never to replace medical judgment.
      </p>
    </div>
  </div>
</section>

{/* HOW IT WORKS */}
<section className="how-it-works">
  <span className="section-tag">HOW IT WORKS</span>
  <h2>Turning Weak Signals into Early Warnings</h2>

  <div className="steps">
    <div className="step">
      <span>01</span>
      <h4>Data Collection</h4>
      <p>
        Securely collect lab data, lifestyle inputs,
        mental health indicators, and family history.
      </p>
    </div>

    <div className="step">
      <span>02</span>
      <h4>Signal Correlation</h4>
      <p>
        AI correlates non-obvious signals across time
        to detect emerging risk patterns.
      </p>
    </div>

    <div className="step">
      <span>03</span>
      <h4>Risk Scoring</h4>
      <p>
        Generates disease-specific probability scores
        instead of yes/no diagnoses.
      </p>
    </div>

    <div className="step">
      <span>04</span>
      <h4>Preventive Action</h4>
      <p>
        Provides early guidance for patients
        and clinical insights for doctors.
      </p>
    </div>
  </div>
</section>

{/* WHY SILENTSENSE AI */}
<section className="why-us">
  <div className="why-content">
    <h2>Why SilentSenseAI?</h2>
    <p>
      Healthcare today reacts late. SilentSenseAI shifts
      the system left — toward anticipation, prevention,
      and early intervention when outcomes can be changed.
    </p>
  </div>
</section>

{/* FINAL CTA */}
<section className="final-cta">
  <h2>See Health Risks Before They Become Diseases</h2>
  <p>
    Experience preventive healthcare powered by
    intelligent, explainable AI.
  </p>
  <button className="primary-btn">Request Demo</button>
</section>

{/* FOOTER */}
<footer className="footer">
  <div className="footer-content">
    <div>
      <h4>SilentSenseAI</h4>
      <p>
        Preventive health intelligence for a world
        that detects early, not late.
      </p>
    </div>

    <div>
      <h5>Platform</h5>
      <ul>
        <li>How It Works</li>
        <li>Research</li>
        <li>Security</li>
      </ul>
    </div>

    <div>
      <h5>Company</h5>
      <ul>
        <li>About</li>
        <li>Careers</li>
        <li>Contact</li>
      </ul>
    </div>
  </div>

  <div className="footer-bottom">
    © 2026 SilentSenseAI. All rights reserved.
  </div>
</footer>


    </div>
  );
};

export default Landing;
