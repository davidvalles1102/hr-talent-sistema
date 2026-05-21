require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const candidatosRoutes = require('./routes/candidatos.routes');
const vacantesRoutes = require('./routes/vacantes.routes');
const evaluacionesRoutes = require('./routes/evaluaciones.routes');
const entrevistasRoutes = require('./routes/entrevistas.routes');
const reportesRoutes = require('./routes/reportes.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/candidatos', candidatosRoutes);
app.use('/vacantes', vacantesRoutes);
app.use('/evaluaciones', evaluacionesRoutes);
app.use('/entrevistas', entrevistasRoutes);
app.use('/reportes', reportesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
