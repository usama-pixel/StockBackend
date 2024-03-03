'use strict';

const Status = require('../models/Status');
const { saltRounds, jwtSecret } = require("../utils/env")
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid')
const { QueryTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentDate = new Date()
    const r = await queryInterface.bulkInsert('Statuses', [
      {
        name: 'sent',
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: 'recieved',
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: 'pending',
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: 'returned',
        createdAt: currentDate,
        updatedAt: currentDate,
      }
    ], {});

    const password = '123';
    const salt = await bcrypt.genSalt(+saltRounds)
    const hash = await bcrypt.hash(password, salt)
    const userId = uuidv4()
    const sent_status_id = await queryInterface.sequelize.query(
      `SELECT id FROM "Statuses" WHERE name = 'sent' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    ).then(rows => rows.length > 0 ? rows[0].id : null);
    const rec_status_id = await queryInterface.sequelize.query(
      `SELECT id FROM "Statuses" WHERE name = 'recieved' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    ).then(rows => rows.length > 0 ? rows[0].id : null);
    console.log({hash, userId, sent_status_id, rec_status_id})
    await queryInterface.bulkInsert('Users', [
      {
        id: userId,
        firstname: 'Usama',
        lastname: 'Ali',
        email: 'usamaali',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
    await queryInterface.bulkInsert('Batches', [
      {
        product_name: 'B1',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Basit',
        status_id: rec_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B2',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Basit',
        status_id: rec_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B3',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Basit',
        status_id: rec_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B4',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Basit',
        status_id: rec_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B5',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Basit',
        status_id: rec_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
// 
      {
        product_name: 'B6',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Sabar',
        status_id: sent_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B7',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Sabar',
        status_id: sent_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B8',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Sabar',
        status_id: sent_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B9',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Sabar',
        status_id: sent_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'B10',
        packing: '12',
        quantity: 12,
        rate: 12,
        expiry_date: new Date(),
        discount: 12,
        tax: 12,
        user_id: userId,
        to: 'Sabar',
        status_id: sent_status_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Statuses', null, {})
  }
};
