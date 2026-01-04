import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/tellme.css";
import { useAuth } from "../context/AuthContext";

export default function TellMe() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [activeCard, setActiveCard] = useState(null);
  const [completedCards, setCompletedCards] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [healthScore, setHealthScore] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [locationError, setLocationError] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);


  const TOTAL_CARDS = 3;


  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, loading, navigate]);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("tellme_state");
    if (savedState) {
      const { completedCards: savedCards, timestamp } = JSON.parse(savedState);
      const oneDay = 0;

      if (Date.now() - timestamp < oneDay) {
        setCompletedCards(savedCards);
        if (savedCards.length === TOTAL_CARDS) {
          setShowResult(true);
        }
      } else {
        localStorage.removeItem("tellme_state");
      }
    }
  }, []);


  useEffect(() => {
    if (!navigator.geolocation) {
      setShowManualLocation(true);
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log("📍 Location via GPS:", lat, lng);

        setLocation({
          lat,
          lng,
          source: "gps"
        });
      },
      (error) => {
        console.warn("Location permission denied");

        setShowManualLocation(true);
        setLocationError(
          "We couldn't access your location. Please enter your city manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // 📍 Location state
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    source: null // "gps" | "manual"
  });


  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/doctors/nearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng
        })
      });

      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Doctor fetch failed", err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchDoctors();
    }
  }, [location.lat, location.lng]);



  // Save state to localStorage whenever completedCards changes
  useEffect(() => {
    if (completedCards.length > 0) {
      localStorage.setItem("tellme_state", JSON.stringify({
        completedCards,
        timestamp: Date.now()
      }));
    }
  }, [completedCards]);

  if (loading) return <div>Loading...</div>;

  // Form data state
  const [formData, setFormData] = useState({
    about: {
      age: "",
      workingHours: "",
      role: "",
      workMode: "",
      medicalIssues: []
    },
    mental: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      q9: ""
    },
    sleepFamily: {
      averageSleepHours: "",
      sleepConsistency: "",
      screenTimeBeforeSleepMinutes: "",
      sleepQuality: "",
      familyHistory: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        mentalHealthConditions: false
      }
    }
  });

  const handleInputChange = (card, field, value) => {
    setFormData(prev => ({
      ...prev,
      [card]: {
        ...prev[card],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (card, parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [card]: {
        ...prev[card],
        [parentField]: {
          ...prev[card][parentField],
          [childField]: value
        }
      }
    }));
  };

  const handleArrayInputChange = (card, field, value) => {
    setFormData(prev => ({
      ...prev,
      [card]: {
        ...prev[card],
        [field]: prev[card][field].includes(value)
          ? prev[card][field].filter(item => item !== value)
          : [...prev[card][field], value]
      }
    }));
  };

  const handleSubmit = async (card) => {
    let success = true;

    if (card === "about") {
      success = await submitProfileContext();
    }

    if (card === "mental") {
      success = await submitPHQ9();
    }

    if (card === "sleepFamily") {
      success = await submitSleepFamily();
    }

    if (!success) return;

    setCompletedCards(prev => {
      const updated = [...new Set([...prev, card])];

      if (updated.length === TOTAL_CARDS) {
        setShowResult(true);
      }

      return updated;
    });

    setActiveCard(null);
  };





  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself in some way"
  ];


  // -------------pm Backend------------------------

  const submitProfileContext = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return false;
      }

      // Validation
      const age = Number(formData.about.age);
      const hours = Number(formData.about.workingHours);

      if (!age || age < 1 || age > 100) {
        alert("Please enter a valid age (1-100)");
        return false;
      }

      if (hours < 0 || hours > 24) {
        alert("Please enter valid working hours (0-24)");
        return false;
      }

      if (!formData.about.role || !formData.about.workMode) {
        alert("Please select all required fields");
        return false;
      }

      // 🔁 Convert checkbox array → backend boolean object
      const recentMedicalIssues = {
        frequentHeadaches: formData.about.medicalIssues.includes("Frequent headaches"),
        persistentFatigue: formData.about.medicalIssues.includes("Persistent fatigue"),
        suddenWeightChanges: formData.about.medicalIssues.includes("Sudden weight changes"),
        digestiveDiscomfort: formData.about.medicalIssues.includes("Digestive discomfort"),
      };

      // 🎯 Final payload (MATCHES BACKEND EXACTLY)
      const payload = {
        age: age,
        occupationType: formData.about.role,
        workingHoursPerDay: hours,
        workMode: formData.about.workMode,
        recentMedicalIssues,
      };

      const response = await fetch(
        "http://localhost:5000/api/profile/context",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return false;
      }

      console.log("Profile context saved:", data);
      alert("Profile information saved successfully ✅");

      return true;
    } catch (error) {
      console.error("Profile context error:", error);
      alert("Server error");
      return false;
    }
  };


  // -------------------------vedant backend------------------

  const submitPHQ9 = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return false;
      }

      // 🔁 Convert frontend answers → backend format (0–3)
      const answers = {};
      for (let i = 1; i <= 9; i++) {
        const value = formData.mental[`q${i}`];
        if (!value) {
          alert("Please answer all questions");
          return false;
        }
        answers[`q${i}`] = Number(value) - 1;
      }

      const response = await fetch("http://localhost:5000/api/stress/phq9", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "PHQ-9 submission failed");
        return false;
      }

      console.log("PHQ-9 saved:", data);
      alert(`PHQ-9 submitted (${data.severity})`);

      return true; // ✅ important
    } catch (error) {
      console.error("PHQ-9 error:", error);
      alert("Server error");
      return false;
    }
  };

  // ----------------------------vedant second Api ------------------
  const submitSleepFamily = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return false;
      }

      // 🎯 Build backend payload
      const payload = {
        sleep: {
          average_sleep_hours: Number(formData.sleepFamily.averageSleepHours),
          sleep_consistency: formData.sleepFamily.sleepConsistency,
          screen_time_before_sleep_minutes: Number(
            formData.sleepFamily.screenTimeBeforeSleepMinutes
          ) || 0,
          sleep_quality: formData.sleepFamily.sleepQuality
        },
        family_history: {
          diabetes: formData.sleepFamily.familyHistory.diabetes,
          hypertension: formData.sleepFamily.familyHistory.hypertension,
          heart_disease: formData.sleepFamily.familyHistory.heartDisease,
          mental_health_conditions:
            formData.sleepFamily.familyHistory.mentalHealthConditions
        }
      };

      // Basic validation (frontend guard)
      if (
        !payload.sleep.average_sleep_hours ||
        !payload.sleep.sleep_consistency ||
        !payload.sleep.sleep_quality
      ) {
        alert("Please fill all required sleep fields");
        return false;
      }

      const response = await fetch(
        "http://localhost:5000/api/health/sleep-family",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save sleep/family data");
        return false;
      }

      console.log("Sleep & Family saved:", data);
      alert("Sleep & family history saved successfully ✅");

      return true;
    } catch (error) {
      console.error("SleepFamily error:", error);
      alert("Server error");
      return false;
    }
  };


  const analyzeHealth = async () => {
    try {
      setAnalyzing(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/health/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Analysis failed");
        return;
      }
      setHealthScore(data.healthScore);
      console.log("Health score:", healthScore);

      setSummaryText(data.summaryText);
      setAnalysisResult(data.recommendation);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Failed to analyze health data");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <div className="tellme-page">
        {/* TOP BAR */}
        <div className="tellme-top">
          <button onClick={() => navigate("/")}>← Back</button>
        </div>

        {/* HERO */}
        <div className="tellme-hero">
          <h1>Understand Your Health Signals</h1>
          <p>
            Answer a few simple questions. SilentSenseAI connects the dots
            to detect early health risks.
          </p>
        </div>

        {/* 📍 LOCATION SECTION */}
        {showManualLocation && !location.lat && (
          <div className="location-box">
            <h3>📍 Enter your location</h3>
            <p>{locationError}</p>

            <input
              type="text"
              placeholder="Enter your city (e.g. Pune)"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
            />

            <button
              className="primary-btn"
              onClick={() => {
                if (!manualCity.trim()) {
                  alert("Please enter a city");
                  return;
                }

                setLocation({
                  lat: null,
                  lng: null,
                  source: "manual"
                });

                console.log("📍 Location via manual input:", manualCity);
                alert(`Location set to ${manualCity}`);
              }}
            >
              Use this location
            </button>
          </div>
        )}

        {/* CARDS CONTAINER */}
        <div className="cards-container">
          {/* Card 1: About You & Medical Issues */}
          <div
            className={`card ${completedCards.includes('about') ? 'completed' : ''}`}
            onClick={() => !completedCards.includes('about') && setActiveCard('about')}
          >
            <div className="card-header">
              <h3>About You & Medical Issues</h3>
              {completedCards.includes('about') && <span className="completed-badge">✓ Completed</span>}
            </div>
            <p>Basic information and recent health concerns</p>
          </div>

          {/* Card 2: Mental Health (PHQ-9) */}
          <div
            className={`card ${completedCards.includes('mental') ? 'completed' : ''}`}
            onClick={() => !completedCards.includes('mental') && setActiveCard('mental')}
          >
            <div className="card-header">
              <h3>Mental Health Assessment</h3>
              {completedCards.includes('mental') && <span className="completed-badge">✓ Completed</span>}
            </div>
            <p>PHQ-9 questionnaire to evaluate your mental well-being</p>
          </div>

          {/* Card 3: Sleep & Family History */}
          <div
            className={`card ${completedCards.includes('sleepFamily') ? 'completed' : ''}`}
            onClick={() => !completedCards.includes('sleepFamily') && setActiveCard('sleepFamily')}
          >
            <div className="card-header">
              <h3>Sleep & Family History</h3>
              {completedCards.includes('sleepFamily') && <span className="completed-badge">✓ Completed</span>}
            </div>
            <p>Sleep patterns and family medical background</p>
          </div>
        </div>

        {/* MODAL FOR CARD 1: About You & Medical Issues */}
        {activeCard === 'about' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>About You & Medical Issues</h2>
                <button className="close-btn" onClick={() => setActiveCard(null)}>×</button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Enter your age"
                    value={formData.about.age}
                    onChange={(e) => handleInputChange('about', 'age', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Working hours per day</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    placeholder="Hours"
                    value={formData.about.workingHours}
                    onChange={(e) => handleInputChange('about', 'workingHours', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>You are a</label>
                  <select
                    value={formData.about.role}
                    onChange={(e) => handleInputChange('about', 'role', e.target.value)}
                  >
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="job">Working Professional</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Work mode</label>
                  <select
                    value={formData.about.workMode}
                    onChange={(e) => handleInputChange('about', 'workMode', e.target.value)}
                  >
                    <option value="">Select work mode</option>
                    <option value="wfh">Work from home</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="checkbox-group">
                <h4>Recent Medical Issues</h4>
                {["Frequent headaches", "Persistent fatigue", "Sudden weight changes", "Digestive discomfort"].map((issue) => (
                  <label key={issue} className="checkbox">
                    <input
                      type="checkbox"
                      checked={formData.about.medicalIssues.includes(issue)}
                      onChange={() => handleArrayInputChange('about', 'medicalIssues', issue)}
                    />
                    <span className="checkmark"></span>
                    {issue}
                  </label>
                ))}
              </div>

              <div className="modal-actions">
                <button className="secondary" onClick={() => setActiveCard(null)}>Cancel</button>
                <button className="primary" onClick={() => handleSubmit("about")}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOR CARD 2: Mental Health (PHQ-9) */}
        {activeCard === 'mental' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Mental Health Assessment (PHQ-9)</h2>
                <button className="close-btn" onClick={() => setActiveCard(null)}>×</button>
              </div>

              <p className="modal-description">
                Over the last 2 weeks, how often have you been bothered by any of the following problems?
              </p>

              <div className="phq9-questions">
                {phq9Questions.map((question, index) => (
                  <div key={index} className="phq9-question">
                    <p>{index + 1}. {question}</p>
                    <div className="phq9-options">
                      {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'].map((option, optIndex) => (
                        <label key={optIndex} className="radio-option">
                          <input
                            type="radio"
                            name={`q${index + 1}`}
                            value={optIndex + 1}
                            checked={formData.mental[`q${index + 1}`] === String(optIndex + 1)}
                            onChange={(e) => handleInputChange('mental', `q${index + 1}`, e.target.value)}
                          />
                          <span className="radio-mark"></span>
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button className="secondary" onClick={() => setActiveCard(null)}>Cancel</button>
                <button className="primary" onClick={() => handleSubmit('mental')}>Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOR CARD 3: Sleep & Family History */}
        {activeCard === 'sleepFamily' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Sleep & Family History</h2>
                <button className="close-btn" onClick={() => setActiveCard(null)}>×</button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Average sleep hours</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    placeholder="Hours"
                    value={formData.sleepFamily.averageSleepHours}
                    onChange={(e) => handleInputChange('sleepFamily', 'averageSleepHours', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Sleep consistency</label>
                  <select
                    value={formData.sleepFamily.sleepConsistency}
                    onChange={(e) => handleInputChange('sleepFamily', 'sleepConsistency', e.target.value)}
                  >
                    <option value="">Select consistency</option>
                    <option value="consistent">Consistent</option>
                    <option value="irregular">Irregular</option>
                    <option value="highly_irregular">Highly irregular</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Screen time before sleep (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Minutes"
                    value={formData.sleepFamily.screenTimeBeforeSleepMinutes}
                    onChange={(e) => handleInputChange('sleepFamily', 'screenTimeBeforeSleepMinutes', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Sleep quality</label>
                  <select
                    value={formData.sleepFamily.sleepQuality}
                    onChange={(e) => handleInputChange('sleepFamily', 'sleepQuality', e.target.value)}
                  >
                    <option value="">Select quality</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="checkbox-group">
                <h4>Family Medical History</h4>
                {Object.keys(formData.sleepFamily.familyHistory).map((condition) => (
                  <label key={condition} className="checkbox">
                    <input
                      type="checkbox"
                      checked={formData.sleepFamily.familyHistory[condition]}
                      onChange={(e) => handleNestedInputChange('sleepFamily', 'familyHistory', condition, e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    {condition.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                ))}
              </div>

              <div className="modal-actions">
                <button className="secondary" onClick={() => setActiveCard(null)}>Cancel</button>
                <button className="primary" onClick={() => handleSubmit('sleepFamily')}>Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* RESULT SECTION */}
        {showResult && (
          <div className="result-section">
            <h2>Your Health Assessment Results</h2>
            <div className="result-content">
              <div className="result-card">
                <h3>Overall Health Score</h3>
                <div className="score-circle">
                  {healthScore !== null ? `${healthScore}%` : "Loading"}
                </div>

                <p>{summaryText}</p>
              </div>

              <div className="analysis-actions">
                <button
                  className="primary-btn"
                  onClick={analyzeHealth}
                  disabled={analyzing}
                >
                  {analyzing ? "Analyzing..." : "Analyze My Health with AI"}
                </button>
              </div>

              {analysisResult && (
                <div className="ai-recommendation">
                  <h3>AI Health Analysis</h3>
                  <div className="recommendation-content">
                    {analysisResult.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {doctors.length > 0 && (
        <div className="doctor-section">
          <h2>Doctors Near You</h2>

          {loadingDoctors && <p>Finding nearby doctors...</p>}

          <div className="doctor-grid">
            {doctors.map((doc, i) => (
              <div key={i} className="doctor-card">
                <h4>{doc.name}</h4>
                <p>Type: {doc.type}</p>
                <p>{doc.address}</p>
                <a
                  href={`https://www.google.com/maps?q=${doc.lat},${doc.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Map
                </a>
              </div>
            ))}
          </div>
        </div>
      )}


      <Footer />
    </>
  );
}