require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db"); 
const authRoutes = require("./routes/auth.routes"); 
const dataRoutes = require("./routes/sensitiveData.routes.js"); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
const sensitiveDataRoutes = require("./routes/sensitiveData.routes");
app.use("/api", sensitiveDataRoutes);
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
//const swaggerDocument = YAML.load('./');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


sequelize.sync().then(() => {
  console.log("✅ Database synced");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to sync database:", err);
});
