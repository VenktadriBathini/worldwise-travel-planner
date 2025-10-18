const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api', routes);

// Basic health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Error handler (last)
app.use((err, _req, res, _next) => {
  console.error(err);
  const code = err.status || 500;
  res.status(code).json({ error: err.message || 'Server error' });
});

module.exports = app;
