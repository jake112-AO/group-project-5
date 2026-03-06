import { useEffect, useState } from "react";
import { api } from "../lib/api";

const emptyForm = {
  title: "",
  contentType: "email",
  difficulty: "easy",
  content: "",
  correctAnswer: "scam",
  explanation: "",
  isPublished: true,
};

function AdminDashboardPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function loadCases() {
    api("/admin/cases")
      .then((result) => setItems(result.cases))
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadCases();
  }, []);

  async function createCase(event) {
    event.preventDefault();
    setError("");
    try {
      await api("/admin/cases", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(emptyForm);
      loadCases();
    } catch (err) {
      setError(err.message);
    }
  }

  async function togglePublish(item) {
    try {
      await api(`/admin/cases/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      loadCases();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeCase(id) {
    try {
      await api(`/admin/cases/${id}`, { method: "DELETE" });
      loadCases();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <h2>Admin Dashboard</h2>
      {error ? <p className="error">{error}</p> : null}

      <form className="admin-form" onSubmit={createCase}>
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </label>
        <label>
          Type
          <select
            value={form.contentType}
            onChange={(e) => setForm((prev) => ({ ...prev, contentType: e.target.value }))}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="website">Website</option>
          </select>
        </label>
        <label>
          Difficulty
          <select
            value={form.difficulty}
            onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value }))}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label>
          Correct Answer
          <select
            value={form.correctAnswer}
            onChange={(e) => setForm((prev) => ({ ...prev, correctAnswer: e.target.value }))}
          >
            <option value="scam">Scam</option>
            <option value="safe">Safe</option>
          </select>
        </label>
        <label>
          Case Content
          <textarea
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            required
          />
        </label>
        <label>
          Explanation
          <textarea
            value={form.explanation}
            onChange={(e) => setForm((prev) => ({ ...prev, explanation: e.target.value }))}
            required
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
          />
          Publish immediately
        </label>
        <button className="btn btn-primary" type="submit">
          Add Case
        </button>
      </form>

      <h3>All Cases ({items.length})</h3>
      <div className="admin-list">
        {items.map((item) => (
          <article key={item._id} className="admin-item">
            <h4>{item.title}</h4>
            <p>
              {item.contentType} | {item.difficulty} | {item.isPublished ? "Published" : "Draft"}
            </p>
            <div className="admin-actions">
              <button className="btn btn-muted" type="button" onClick={() => togglePublish(item)}>
                {item.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button className="btn btn-danger" type="button" onClick={() => removeCase(item._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
