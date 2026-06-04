require('./database');
const app  = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n  ETOH Market Server → http://localhost:${PORT}\n`);
});
