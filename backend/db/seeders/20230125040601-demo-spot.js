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
        address: '1 SeederDataStreet1',
        city: 'SeederDataCity1',
        state: 'SeederDataState1',
        country: 'United States',
        lat: 11.11,
        lng: 11.11,
        name: 'SeederDataName1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        price: 111,
      },
      {
        ownerId: 2,
        address: '2 SeederDataStreet2',
        city: 'SeederDataCity2',
        state: 'SeederDataState2',
        country: 'United States',
        lat: 22.22,
        lng: 22.22,
        name: 'SeederDataName2',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        price: 222,
      },
      {
        ownerId: 3,
        address: '3 SeederDataStreet3',
        city: 'SeederDataCity3',
        state: 'SeederDataState3',
        country: 'United States',
        lat: 33.33,
        lng: 33.33,
        name: 'SeederDataName3',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
        price: 333.333,
      },
      {
        ownerId: 2,
        address: '4 SeederDataStreet4',
        city: 'SeederDataCity4',
        state: 'SeederDataState4',
        country: 'United States',
        lat: 44.44,
        lng: 44.44,
        name: 'SeederDataName4',
        description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
        price: 444,
      },
      {
        ownerId: 1,
        address: '5 SeederDataStreet5',
        city: 'SeederDataCity5',
        state: 'SeederDataState5',
        country: 'United States',
        lat: 55.55,
        lng: 55.55,
        name: 'SeederDataName5',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        price: 555,
      },
      {
        ownerId: 1,
        address: '7 NoReviews Spot',
        city: 'SeederDataCity6',
        state: 'SeederDataState6',
        country: 'United States',
        lat: 77.77,
        lng: 77.77,
        name: 'NoReviewsTester',
        description: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
        price: 777,
      },
      {
        ownerId: 3,
        address: '8 SeederDataStreet8',
        city: 'SeederDataCity8',
        state: 'SeederDataState8',
        country: 'United States',
        lat: 88.88,
        lng: 88.88,
        name: 'TextOverflowTesterSeederName',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
        price: 888.88,
      }
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
