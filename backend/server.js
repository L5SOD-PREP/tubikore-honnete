const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PMS Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
