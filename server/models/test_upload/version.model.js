'use strict';

module.exports = (sequelize, Sequelize) => {
  const version = sequelize.define('version', {
    file_id: {
      type: Sequelize.INTEGER,
    },
    version: {
      type: Sequelize.STRING(34),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'version',
  });

  return version;
};
