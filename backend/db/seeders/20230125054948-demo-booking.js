'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: "2023-12-17",
        endDate: "2023-12-25"
      },
      {
        spotId: 2,
        userId: 1,
        startDate: "2022-03-13",
        endDate: "2022-12-23"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2023-07-13",
        endDate: "2023-07-17"
      },
      {
        spotId: 1,
        userId: 3,
        startDate: "2023-05-13",
        endDate: "2023-05-25"
      },
      {
        spotId: 3,
        userId: 2,
        startDate: "2023-03-13",
        endDate: "2023-03-17"
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
