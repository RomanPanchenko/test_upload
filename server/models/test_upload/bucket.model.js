'use strict';

module.exports = (sequelize, Sequelize) => {
  const bucket = sequelize.define('bucket', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(512),
      allowNull: false
    },
    url: {
      type: Sequelize.STRING(512),
      allowNull: false
    },
  }, {
    timestamps: false,
    tableName: 'bucket',
  });

  return bucket;
};
