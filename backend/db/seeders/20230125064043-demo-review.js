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
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: 'Fake Review1',
        stars: 5
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Fake Review2',
        stars: 4,
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Fake Review3',
        stars: 3,
      },
      {
        spotId: 4,
        userId: 3,
        review: 'Fake Review4',
        stars: 2,
      },
      {
        spotId: 5,
        userId: 2,
        review: 'Fake Review5',
        stars: 1,
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Fake Review6',
        stars: 2,
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Fake Review7',
        stars: 3,
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Fake Review8',
        stars: 2,
      },
      {
        spotId: 4,
        userId: 1,
        review: 'Fake Review9',
        stars: 5,
      },
      {
        spotId: 5,
        userId: 3,
        review: 'Fake Review10',
        stars: 2,
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
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
