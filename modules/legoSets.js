require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  }
});

const Theme = sequelize.define('Theme', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING
}, { timestamps: false });

const Set = sequelize.define('Set', {
  set_num: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  year: DataTypes.INTEGER,
  num_parts: DataTypes.INTEGER,
  theme_id: { type: DataTypes.INTEGER, references: { model: 'Theme', key: 'id' } },
  img_url: DataTypes.STRING
}, { timestamps: false });

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

async function initialize() {
  await sequelize.authenticate();
  await sequelize.sync();
}

async function getAllThemes() {
  return await Theme.findAll();
}

async function getAllSets() {
  return await Set.findAll({ include: [Theme] });
}

async function getSetByNum(setNum) {
  return await Set.findOne({ where: { set_num: setNum }, include: [Theme] });
}

async function getSetsByTheme(theme) {
  return await Set.findAll({ 
    include: [{
      model: Theme,
      where: { name: { [Sequelize.Op.iLike]: `%${theme}%` } }
    }] 
  });
}

async function addSet(setData) {
  return await Set.create(setData);
}

async function editSet(setNum, setData) {
  return await Set.update(setData, {
    where: { set_num: setNum }
  });
}

async function deleteSet(setNum) {
  return await Set.destroy({
    where: { set_num: setNum }
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  getAllThemes,
  addSet,
  editSet,
  deleteSet
};
