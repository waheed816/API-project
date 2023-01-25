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
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1 FakeStreet1',
        city: 'FakeCity1',
        state: 'FakeState1',
        country: 'United States',
        lat: 11.11,
        lng: 11.11,
        name: 'FakeName1',
        description: 'Fake Description1',
        price: 111,
      },
      {
        ownerId: 2,
        address: '2 FakeStreet2',
        city: 'FakeCity2',
        state: 'FakeState2',
        country: 'United States',
        lat: 22.22,
        lng: 22.22,
        name: 'FakeName2',
        description: 'Fake Description2',
        price: 222,
      },
      {
        ownerId: 3,
        address: '3 FakeStreet3',
        city: 'FakeCity3',
        state: 'FakeState3',
        country: 'United States',
        lat: 33.33,
        lng: 33.33,
        name: 'FakeName3',
        description: 'Fake Description3',
        price: 333,
      },
      {
        ownerId: 2,
        address: '4 FakeStreet4',
        city: 'FakeCity4',
        state: 'FakeState4',
        country: 'United States',
        lat: 44.44,
        lng: 44.44,
        name: 'FakeName4',
        description: 'Fake Description4',
        price: 444,
      },
      {
        ownerId: 1,
        address: '5 FakeStreet5',
        city: 'FakeCity5',
        state: 'FakeState5',
        country: 'United States',
        lat: 55.55,
        lng: 55.55,
        name: 'FakeName5',
        description: 'Fake Description5',
        price: 555,
      },
    ], {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['United States'] }
    }, {});
  }
};
