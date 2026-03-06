import { useEffect, useState } from "react";
import CaseCard from "../components/CaseCard";
import { api } from "../lib/api";

function CaseFeedPage() {
  const [cases, setCases] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [contentType, setContentType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (difficulty) params.set("difficulty", difficulty);
    if (contentType) params.set("contentType", contentType);
    params.set("unattempted", "true");

    setLoading(true);
    setError("");
    api(`/cases?${params.toString()}`)
      .then((result) => setCases(result.cases))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [difficulty, contentType]);

  return (
    <section>
      <div className="page-title-row">
        <h2>Case Feed</h2>
        <div className="filters">
          <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="website">Website</option>
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      {loading ? <p>Loading cases...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="case-grid">
        {cases.map((item) => (
          <CaseCard key={item._id} item={item} />
        ))}
      </div>
      {!loading && !cases.length ? <p>No cases found for current filters.</p> : null}
    </section>
  );
}

export default CaseFeedPage;
