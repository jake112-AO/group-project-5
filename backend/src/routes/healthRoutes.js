import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "scamshield-backend",
    time: new Date().toISOString(),
  });
});

export default router;
