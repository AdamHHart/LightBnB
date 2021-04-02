const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const myArgs = process.argv;

const pool = new Pool({
  user: 'adamhart',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`SELECT *
  FROM users
  WHERE email = $1;`, [email])
  .then(res => {
    return res.rows[0]})
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT *
  FROM users
  WHERE id = $1;`, [id])
  .then(res => {
    return res.rows[0]}) 
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [user.name, user.email, user.password])
  .then(res => res.rows); 
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query
  (`SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
  .then(res => res.rows); 
}
exports.getAllReservations = getAllReservations;

/// Properties
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  // 1. SET UP EMPTY ARRAY TO HOLD PARAMETERS FOR THE QUERY
  const queryParams = [];
  // 2. START THE QUERY WITH ALL INFO BEFORE THE 'WHERE' CLAUSE
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
  `;
  // 3. CHECK IF A CITY HAS BEEN PASSED AS AN OPTION
    // ADD THE CITY TO THE PARAMS ARRAY
    // ADD A WHERE CLAUSE TO THE 'queryString'
      // use length of array to get the $n placeholder
      //  %% for the LIKE clause must be part of the parameter, not the query
  if (options.city || options.owner_id || options.minimum_price_per_night || options.maximum_price_per_night) {
    
    queryString += ` WHERE `;
    const queryInputs = [];

    for (const key in options) {
      if(options[key]) {
        queryInputs.push(key);
      }
      
    }
    console.log("queryInputs = ", queryInputs);
    console.log("options = ", options);
    for (let i = 0; i < queryInputs.length; i++) {
      if(queryInputs[i] === 'city') {
        queryParams.push(`%${options.city}%`);
        queryString += ` properties.city LIKE $${queryParams.length}`;
      }
      if(queryInputs[i] === 'owner_id') {
        queryParams.push(`${options.owner_id}`);
        queryString += ` properties.owner_id = $${queryParams.length}`;
      }
      if(queryInputs[i] === 'minimum_price_per_night') {
        queryParams.push(`${options.minimum_price_per_night}`);
        queryString += ` AND properties.cost_per_night > $${queryParams.length}`;
      } 
      if(queryInputs[i] === 'maximum_price_per_night') {
        queryParams.push(`${options.maximum_price_per_night}`);
        queryString += ` AND properties.cost_per_night < $${queryParams.length}`;
      }
      // if(i < queryInputs.length - 2) {
      //   queryString += ` AND `
      // }
    }
  }
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` AND property_reviews.rating >= $${queryParams.length}`;
  }

  // 4. ADD ANY QUERY THAT COMES AFTER THE WHERE CLAUSE
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY properties.cost_per_night
  LIMIT $${queryParams.length};
  `;
  // 5. CONSOLE LOG TO MAKE SURE WE'VE DONE IT RIGHT
  console.log("console.logging queryString, queryParams = ", queryString, queryParams);
  // 6. RUN THE QUERY
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;




// ----------------------------------------- WITH GET ALL PROPERTIES




// const properties = require('./json/properties.json');
// const users = require('./json/users.json');

// const { Pool } = require('pg');
// const myArgs = process.argv;

// const pool = new Pool({
//   user: 'adamhart',
//   password: '123',
//   host: 'localhost',
//   database: 'lightbnb'
// });

// /// Users

// /**
//  * Get a single user from the database given their email.
//  * @param {String} email The email of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */
// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }
// exports.getUserWithEmail = getUserWithEmail;

// /**
//  * Get a single user from the database given their id.
//  * @param {string} id The id of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// }
// exports.getUserWithId = getUserWithId;


// /**
//  * Add a new user to the database.
//  * @param {{name: string, password: string, email: string}} user
//  * @return {Promise<{}>} A promise to the user.
//  */
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }
// exports.addUser = addUser;

// /// Reservations

// /**
//  * Get all reservations for a single user.
//  * @param {string} guest_id The id of the user.
//  * @return {Promise<[{}]>} A promise to the reservations.
//  */
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }
// exports.getAllReservations = getAllReservations;

// /// Properties

// /**
//  * Get all properties.
//  * @param {{}} options An object containing query options.
//  * @param {*} limit The number of results to return.
//  * @return {Promise<[{}]>}  A promise to the properties.
//  */
// // const getAllProperties = function(options, limit = 10) {
// //   const limitedProperties = {};
// //   for (let i = 1; i <= limit; i++) {
// //     limitedProperties[i] = properties[i];
// //   }
// //   return Promise.resolve(limitedProperties);
// // }
// // exports.getAllProperties = getAllProperties;

// const getAllProperties = function(options, limit = 10) {
//   return pool.query(`
//   SELECT * FROM properties
//   LIMIT $1
//   `, [limit])
//   .then(res => res.rows);
// }
// exports.getAllProperties = getAllProperties;


// /**
//  * Add a property to the database
//  * @param {{}} property An object containing all of the property details.
//  * @return {Promise<{}>} A promise to the property.
//  */
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }
// exports.addProperty = addProperty;
