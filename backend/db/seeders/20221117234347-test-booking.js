'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Bookings';
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
        spotId: 2,
        userId: 1,
        startDate: '12-12-2022',
        endDate: '12-13-2022'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '12-14-2022',
        endDate: '12-15-2022'
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '12-16-2022',
        endDate: '12-17-2022'
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
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options, {
       spotId: { [Op.in]: [1, 2, 3] }
     }, {});
  }
};
