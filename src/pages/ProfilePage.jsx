import { useEffect, useState } from "react";
import { api } from "../lib/api";

function MetricCard({ label, value, hint }) {
  return (
    <div className="metric metric-elevated">
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      <span className="metric-hint">{hint}</span>
    </div>
  );
}

function ProgressChart({ value }) {
  return (
    <div className="progress-chart" aria-label={`Progress ${value}%`}>
      <div className="progress-chart-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

function PerformanceDots({ items }) {
  if (!items?.length) {
    return <p className="muted-text">No recent attempts yet. Complete a few cases to build a streak.</p>;
  }

  return (
    <div className="streak-row">
      {items.map((item) => (
        <div
          key={item.id}
          className={`streak-dot ${item.isCorrect ? "success" : "danger"}`}
          title={`${item.caseTitle} | ${item.isCorrect ? "Correct" : "Incorrect"}`}
        />
      ))}
    </div>
  );
}

function DifficultyBars({ items }) {
  return (
    <div className="difficulty-chart">
      {items.map((item) => (
        <div key={item.difficulty} className="difficulty-row">
          <div className="difficulty-row-head">
            <span>{item.difficulty}</span>
            <span>{item.accuracyRate}%</span>
          </div>
          <div className="progress-chart compact">
            <div className="progress-chart-fill" style={{ width: `${item.accuracyRate}%` }} />
          </div>
          <small className="muted-text">{item.correct} correct / {item.total} attempted</small>
        </div>
      ))}
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/users/me")
      .then((result) => setProfile(result.user))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <section className="profile-shell">
      <div className="panel profile-hero">
        <div>
          <p className="eyebrow">Learning Profile</p>
          <h2>{profile.username}</h2>
          <p className="supporting-copy">{profile.email}</p>
          <div className="badge-row">
            <span className="badge-pill role-pill">{profile.role}</span>
            {profile.badges?.length
              ? profile.badges.map((badge) => <span key={badge}>{badge.replaceAll("_", " ")}</span>)
              : <span>No badges yet</span>}
          </div>
        </div>
        <div className="profile-focus-card">
          <span className="metric-label">Training completion</span>
          <strong>{profile.progressPercent}%</strong>
          <ProgressChart value={profile.progressPercent} />
          <span className="metric-hint">
            {profile.completedCasesCount} completed, {profile.remainingCasesCount} left in the current bank
          </span>
        </div>
      </div>

      <div className="metrics-grid profile-metrics-grid">
        <MetricCard label="Score" value={profile.reputationScore} hint="Total reputation from case work" />
        <MetricCard label="Level" value={profile.level} hint="Unlocked by sustained activity" />
        <MetricCard label="Accuracy" value={`${profile.accuracyRate}%`} hint={`${profile.correctVotes} correct answers`} />
        <MetricCard label="Comments" value={profile.commentsCount} hint="Community discussion contributions" />
        <MetricCard label="Confidence" value={`${profile.confidenceScore}%`} hint="Blends accuracy and repetition" />
        <MetricCard label="Cases Done" value={profile.completedCasesCount} hint={`${profile.totalVotes} total submissions`} />
      </div>

      <div className="profile-grid">
        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Recent Streak</h3>
              <p className="supporting-copy">A quick read on how your last attempts went.</p>
            </div>
          </div>
          <PerformanceDots items={profile.recentPerformance} />
          <div className="activity-feed">
            {profile.recentPerformance?.map((item) => (
              <article key={item.id} className="activity-item">
                <div>
                  <strong>{item.caseTitle}</strong>
                  <p className="muted-text">
                    {item.contentType} | {item.difficulty} | {new Date(item.createdAt).toLocaleDateString("en-US")}
                  </p>
                </div>
                <span className={`status-chip ${item.isCorrect ? "success" : "danger"}`}>
                  {item.isCorrect ? `+${item.pointsAwarded}` : item.answer}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Difficulty Breakdown</h3>
              <p className="supporting-copy">Useful for spotting where your judgment weakens.</p>
            </div>
          </div>
          <DifficultyBars items={profile.difficultyBreakdown || []} />
        </section>
      </div>
    </section>
  );
}

export default ProfilePage;
