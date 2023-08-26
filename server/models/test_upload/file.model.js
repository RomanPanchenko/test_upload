'use strict';

module.exports = (sequelize, Sequelize) => {
  const file = sequelize.define('file', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(512),
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
  }, {
    timestamps: false,
    tableName: 'file',
  });

  file.associate = (models) => {
    file.hasMany(models.version, {
      as: 'versions',
      foreignKey: 'file_id'
    });
  };

  return file;
};
