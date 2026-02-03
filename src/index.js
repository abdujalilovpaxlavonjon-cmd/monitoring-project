const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 8080;

// Prometheus default metrics
client.collectDefaultMetrics({ prefix: "agri_food_api_" });

// Custom metrics
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});

// Middleware to instrument routes
function instrument(route) {
  return (req, res, next) => {
    const end = httpDuration.startTimer();
    res.on("finish", () => {
      const labels = {
        method: req.method,
        route,
        status: String(res.statusCode),
      };
      httpRequestsTotal.inc(labels);
      end(labels);
    });
    next();
  };
}

// Routes
app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/products", instrument("/products"), (req, res) => {
  res.json([
    { id: 1, name: "Wheat", category: "grain" },
    { id: 2, name: "Tomato", category: "vegetable" },
  ]);
});

// Generate 5xx errors for testing
app.get("/error", instrument("/error"), (req, res) => {
  res.status(500).json({ error: "Internal Server Error (test)" });
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`agri-food-api listening on port ${PORT}`);
});
