import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="panel">
      <h2>404</h2>
      <p>Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Back Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
