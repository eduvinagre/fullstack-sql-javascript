"use strict";
const packsInfoTable = require("../old/packsInfoTable");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("packs", packsInfoTable, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("packs", null, {});
  },
};
