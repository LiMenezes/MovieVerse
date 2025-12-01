require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 4000;

async function start(){
  try {
    await sequelize.authenticate();
    console.log('DB OK — authenticated');
    // synchronize models (in production prefer migrations)
    await sequelize.sync({ alter: true }); // uses alter to make sure tables exist; change to { force: true } to reset
    console.log('DB Synced');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Unable to start', err);
    process.exit(1);
  }
}
start();
