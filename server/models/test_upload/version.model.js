'use strict';

module.exports = (sequelize, Sequelize) => {
  const version = sequelize.define('version', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    file_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    version_id: {
      type: Sequelize.STRING(34),
      allowNull: false
    },
    size: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE(6),
      allowNull: false
    },
  }, {
    timestamps: false,
    tableName: 'version',
  });

  version.associate = (models) => {
    version.belongsTo(models.file, {
      as: 'versions',
      foreignKey: 'file_id'
    });
  };

  return version;
};
