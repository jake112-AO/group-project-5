import { useEffect, useState } from "react";
import { api } from "../lib/api";

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
    <section className="panel">
      <h2>{profile.username}</h2>
      <p>{profile.email}</p>
      <div className="metrics-grid">
        <div className="metric">
          <strong>{profile.reputationScore}</strong>
          <span>Score</span>
        </div>
        <div className="metric">
          <strong>{profile.level}</strong>
          <span>Level</span>
        </div>
        <div className="metric">
          <strong>{profile.accuracyRate}%</strong>
          <span>Accuracy</span>
        </div>
        <div className="metric">
          <strong>{profile.completedCasesCount}</strong>
          <span>Completed Cases</span>
        </div>
      </div>
      <h3>Badges</h3>
      <div className="badge-row">
        {profile.badges?.length ? profile.badges.map((badge) => <span key={badge}>{badge}</span>) : "No badges yet"}
      </div>
    </section>
  );
}

export default ProfilePage;
