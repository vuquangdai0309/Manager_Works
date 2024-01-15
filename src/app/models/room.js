const connection = require('../../config/db/index');
const RoomModel = {
    getAllRoom: (callback) => {
        const query = 'SELECT * FROM room ';
        connection.query(query, callback);
      },
}
module.exports = RoomModel;