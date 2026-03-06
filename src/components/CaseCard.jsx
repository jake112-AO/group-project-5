import { Link } from "react-router-dom";

function CaseCard({ item }) {
  return (
    <article className="case-card">
      <div className="case-card-top">
        <span className={`pill ${item.contentType}`}>{item.contentType}</span>
        <span className={`pill ${item.difficulty}`}>{item.difficulty}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.content.slice(0, 120)}...</p>
      <Link to={`/cases/${item._id}`} className="btn btn-primary">
        Open Case
      </Link>
    </article>
  );
}

export default CaseCard;
