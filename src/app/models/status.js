const connection = require('../../config/db/index')
const UserWorkModel = {

    get_Account_Work: (callback) => {
        const query = `
        SELECT account_work.*,
        receiver.username AS nameUser,
        sender.username AS nameUserSend,
        status.name AS status,
        works.title AS title
        FROM account_work
        JOIN account AS receiver ON account_work.sender_id= receiver._id
        JOIN account AS sender ON account_work.account_id= sender._id
        JOIN works ON account_work.work_id = works._id
        JOIN status ON account_work.status_id = status._id
        WHERE account_work.show_screen = 1
        ORDER BY account_work.createAt DESC
        `
        connection.query(query, callback);
    },
    // lấy bản ghi với id
    get_Id_User_Work: (ID, callback) => {
        const query = 'SELECT *FROM account_work WHERE _id = ?'
        connection.query(query, ID, callback)
    },

    // lấy những trạng thái từ bảng status
    get_All_status: (callback) => {
        const query = 'SELECT * FROM status'
        connection.query(query, callback)
    },
    // update trạng thái
    update_Status: (ID, Status, callback) => {
        const query = 'UPDATE account_work SET status_id = ? WHERE _id = ?  ';
        const values = [Status.status_id, ID];
        connection.query(query, values, callback);
    },
    // lấy một user_work
    getOneUser_Work: (ID, callback) => {
        const query = `SELECT * FROM account_work where _id = ?`
        connection.query(query, ID, callback)
    }
}
module.exports = UserWorkModel