const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      idle: 30000
  }
});

var Article = sequelize.define('article', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  content: Sequelize.TEXT,
  status: Sequelize.STRING,
  time: Sequelize.STRING,
  img: Sequelize.STRING
}, {
  timestamps: false
});

var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  account: Sequelize.STRING,
  password: Sequelize.TEXT
}, {
  timestamps: false
})

var Photo = sequelize.define('photo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  img: Sequelize.STRING,
  status: Sequelize.STRING
}, {
  timestamps: false
})

var Notice = sequelize.define('notice', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  title: Sequelize.STRING,
  time: Sequelize.STRING,
  content: Sequelize.TEXT,
  status: Sequelize.STRING
}, {
  timestamps: false
})

var Album = sequelize.define('album', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  title: Sequelize.STRING,
  time: Sequelize.STRING,
  avatar: Sequelize.STRING,
  pictures: Sequelize.TEXT,
  status: Sequelize.STRING
}, {
  timestamps: false
})

module.exports = {
  'Article': Article,
  'User': User,
  'Photo': Photo,
  'Notice': Notice,
  'Album': Album
};
