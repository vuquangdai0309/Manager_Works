const connection = require('../../config/db/index');
const RoleModel = {
    getAllRole: (callback) => {
        const query = 'SELECT * FROM role ';
        connection.query(query, callback);
      },
}
module.exports = RoleModel;