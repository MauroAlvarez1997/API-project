'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Spots';
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
     return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '25 E. Morris Court',
        city: 'Pasadena',
        state: 'TX',
        country: 'USA',
        lat: 70.21302,
        lng: 43.28330,
        name: 'my house',
        description: 'this is my house',
        price: 500
      },

      {
        ownerId: 2,
        address: '7432 S. Trenton St.',
        city: 'Houston',
        state: 'TX',
        country: 'USA',
        lat: -27.32676,
        lng: -156.20505,
        name: 'house on a hill',
        description: 'its a house on a hill',
        price: 501
      },

      {
        ownerId: 3,
        address: '14 Manhattan St.',
        city: 'Dallas',
        state: 'TX',
        country: 'USA',
        lat: -33.47083,
        lng: -33.47083,
        name: 'beach house',
        description: 'its a house by the beach',
        price: 502
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
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['25 E. Morris Court', '7432 S. Trenton St.', '14 Manhattan St.'] }
     }, {});
  }
};
