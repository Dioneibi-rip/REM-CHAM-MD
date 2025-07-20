// keepAlive.js
import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Bot activo.'));
app.listen(3000, () => console.log('Servidor Express en http://localhost:3000'));
export default app;
