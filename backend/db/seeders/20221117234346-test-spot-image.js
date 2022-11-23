'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'SpotImages';
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
        spotId: 1,
        url:'https://texascasualcottages.com/sites/default/files/styles/front_header/public/BalsamFir-61_WebCrop_0.jpg?itok=7sXg7EMz',
        preview: true
      },
      {
        spotId: 2,
        url:'https://texascasualcottages.com/sites/default/files/styles/front_header/public/TexasCC-19.jpg?itok=psozrNAa',
        preview: true
      },
      {
        spotId: 3,
        url:'https://a3w3j4i7.stackpathcdn.com/wp-content/uploads/2015/06/House-with-minimalist-glass-and-metal-forms-designed-by-Shiflet-Group-Architects-in-West-Austin-Texas.jpg',
        preview: true
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
