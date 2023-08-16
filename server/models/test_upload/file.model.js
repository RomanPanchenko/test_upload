'use strict';

module.exports = (sequelize, Sequelize) => {
  const file = sequelize.define('file', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(512),
      allowNull: false
    },
    size: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING(512),
      allowNull: false
    },
    bucket_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE(6),
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: false
    },
  }, {
    tableName: 'file'
  });

  file.associate = (models) => {
    file.belongsTo(models.bucket, {
      as: 'bucket',
      foreignKey: 'bucket_id'
    });
  };

  return file;
};
