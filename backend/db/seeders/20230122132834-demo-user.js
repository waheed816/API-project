'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'Lition'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1'),
        firstName: 'Fake1',
        lastName: 'User1'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Fake2',
        lastName: 'User2'
      },
      {
        email: 'user3@user.io',
        username: 'NoAssociations',
        hashedPassword: bcrypt.hashSync('nopassword'),
        firstName: 'No',
        lastName: 'Associations'
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'NoAssociations'] }
    }, {});
  }
};
