const database = require('../config/database')

const {Sequelize, DataTypes} = require('sequelize');


const sequelize = new Sequelize(
  database.database,
  database.user,
  database.password, {
      host: database.host,
      dialect: database.dialect,
      operatorsAliases: false,

      pool: {
          max: database.pool.max,
          min: database.pool.min,
          acquire: database.pool.acquire,
          idle: database.pool.idle

      }
  }
)

sequelize.authenticate()
.then(() => {
  console.log('connected..')
})
.catch(err => {
  console.log('Error'+ err)
})


const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.User = require('./user.js')(sequelize, DataTypes)
db.Comment = require('./comment.js')(sequelize, DataTypes)
db.CommentReply = require('./commentreplies.js')(sequelize, DataTypes)
db.LikeComment = require('./likecomment.js')(sequelize, DataTypes)
db.LikeManga = require('./likemanga.js')(sequelize, DataTypes)
db.Manga = require('./manga.js')(sequelize, DataTypes)
db.ScanRead = require('./scanread.js')(sequelize, DataTypes)
db.Session = require('./session.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done! lea')
})

// Define associations
db.User.hasMany(db.Comment, { foreignKey: 'user_id' });
db.Comment.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.CommentReply, { foreignKey: 'user_id' });
db.CommentReply.belongsTo(db.User, { foreignKey: 'user_id' });

db.Comment.hasMany(db.CommentReply, { foreignKey: 'comment_id' });
db.CommentReply.belongsTo(db.Comment, { foreignKey: 'comment_id' });

db.User.hasMany(db.LikeComment, { foreignKey: 'user_id' });
db.LikeComment.belongsTo(db.User, { foreignKey: 'user_id' });

db.Comment.hasMany(db.LikeComment, { foreignKey: 'comment_id' });
db.LikeComment.belongsTo(db.Comment, { foreignKey: 'comment_id' });

db.User.hasMany(db.LikeManga, { foreignKey: 'userId' });
db.LikeManga.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.ScanRead, { foreignKey: 'userId' });
db.ScanRead.belongsTo(db.User, { foreignKey: 'userId' });


module.exports = db