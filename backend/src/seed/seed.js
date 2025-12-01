require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Platform } = require('../models');

async function seed(){
  await sequelize.authenticate();
  await sequelize.sync();
  const pwd = await bcrypt.hash('admin123', 10);
  const [admin] = await User.findOrCreate({ where: { email: 'admin@movieverse.test' }, defaults: { name: 'Admin', username: 'admin', email: 'admin@movieverse.test', password_hash: pwd, role: 'admin' }});
  const platforms = ['Netflix','HBO Max','Disney+','Prime Video','Cinemas'];
  for(const p of platforms){
    await Platform.findOrCreate({ where: { name: p }});
  }
  console.log('Seed done');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
