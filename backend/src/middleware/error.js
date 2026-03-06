export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  // Keep stack in server logs for debugging.

  console.error(err);
  if (res.headersSent) return next(err);
  return res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
}
