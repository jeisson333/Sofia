const express = require('express');
const config = require('./config');
const agentRoutes = require('./routes/agent');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    agent: config.agent.name,
    version: config.agent.version,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Sofia AI Virtual Agent',
    description: 'AI virtual agent for ServiceDesk Plus integration with Microsoft Teams',
    version: config.agent.version,
    endpoints: {
      health: '/health',
      agent: '/api/agent/*',
    },
  });
});

// API routes
app.use('/api/agent', agentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Sofia AI Virtual Agent                                  ║
║   Version: ${config.agent.version}                                     ║
║                                                           ║
║   Server running on port ${PORT}                             ║
║   Environment: ${config.server.env}                            ║
║                                                           ║
║   Endpoints:                                              ║
║   - GET  /health                                          ║
║   - GET  /api/agent/info                                  ║
║   - POST /api/agent/process                               ║
║   - POST /api/agent/tickets                               ║
║   - GET  /api/agent/tickets                               ║
║   - GET  /api/agent/tickets/:id                           ║
║   - PUT  /api/agent/tickets/:id/assign                    ║
║   - PUT  /api/agent/tickets/:id/status                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
