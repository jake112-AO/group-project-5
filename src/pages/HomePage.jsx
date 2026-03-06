import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="hero">
      <h1>ScamShield Hub</h1>
      <p>
        Interactive phishing detection training with case-based exercises, instant explanations,
        score tracking, and leaderboard competition.
      </p>
      <div className="hero-actions">
        <Link to="/cases" className="btn btn-primary">
          Start Training
        </Link>
        <Link to="/auth" className="btn btn-muted">
          Login / Register
        </Link>
      </div>
      <div className="metrics-grid">
        <div className="metric">
          <strong>120+</strong>
          <span>Seeded practice cases</span>
        </div>
        <div className="metric">
          <strong>3</strong>
          <span>Case types: Email, SMS, Website</span>
        </div>
        <div className="metric">
          <strong>Admin</strong>
          <span>Case publishing workflow</span>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
