const connection = require('../../config/db/index')
const AccountModel = {
    //lấy tất cả những bản ghi 
    getAllUser: (callback) => {
        const query = `SELECT account.*,
        role.name AS nameRole,
        room.name AS nameRoom
        FROM account
        JOIN role ON account.role_id = role._id
        JOIN room ON account.room_id = room._id
        `
        connection.query(query, callback)
    },
    //lấy bản ghi theo tên
    getAllUser_name: (username, callback) => {
        const query = `SELECT account.*,
        role.name AS nameRole
        FROM account
        JOIN role ON account.role_id = role._id
        WHERE account.username = ?
        `
        connection.query(query, username, callback)
    },
    //lấy thông tin dựa vào tên và email
    getAccountByNameorEmail: (UserName, UserEmail, callback) => {
        const query = 'SELECT * FROM account WHERE username = ? OR email = ?';
        connection.query(query, [UserName, UserEmail], callback);
    },
    getAccountByEmail: (UserEmail, callback) => {
        const query = 'SELECT * FROM account WHERE email = ?';
        connection.query(query, [UserEmail], callback);
    },
    //lấy thông tin dựa vào tên và mật khẩu
    getAccountByNameAndPassword: (UserName, PassWord, callback) => {
        const query = 'SELECT * FROM account WHERE username = ? AND password =?';
        connection.query(query, [UserName, PassWord], callback);
    },
    //lấy thông tin dựa vào id
    getAccountById: (UserId, callback) => {
        const query = 'SELECT * FROM account WHERE _id = ?';
        connection.query(query, [UserId], callback);
    },

    addAccount: (Account, callback) => {
        const query = 'INSERT INTO account (username,password,email,room_id) VALUES (?,?,?,?)';
        const values = [Account.username, Account.password, Account.email, Account.room_id];
        connection.query(query, values, callback);
    },
    //lấy thông tin tài khoản dựa vào id và email
    getAccountIdAndPassword: (UserId, PassWord, callback) => {
        const query = 'SELECT * FROM account WHERE _id = ? AND password =?';
        connection.query(query, [UserId, PassWord], callback);
    },
    // thay đổi mật khẩu
    updateAccount: (AccountId, Account, callback) => {
        const query = 'UPDATE account SET password = ? WHERE _id = ?  ';
        const values = [Account.password, AccountId];
        connection.query(query, values, callback);
    },
    // đổi chức vụ
    updateRole: (AccountId, Account, callback) => {
        const query = 'UPDATE account SET role_id = ? WHERE _id = ?  ';
        const values = [Account.role_id, AccountId];
        connection.query(query, values, callback);
    },
    // lấy thông tin dựa vào email
    getAccountByEmail: (UserEmail, callback) => {
        const query = 'SELECT * FROM account WHERE email = ?';
        connection.query(query, [UserEmail], callback);
    },
    // quên mật khẩu
    updateForgotAccount: (email, Account, callback) => {
        const query = 'UPDATE account SET password = ? WHERE email = ?  ';
        const values = [Account.password, email];
        connection.query(query, values, callback);
    },
    searchEmail: (email, callback) => {
        const query = 'SELECT * FROM account WHERE email LIKE ?';
        const values = ['%' + email + '%'];
        connection.query(query, values, callback);
    },
    count_User: (callback) => {
        const query = `SELECT COUNT(*) AS count
        FROM account `
        connection.query(query, callback)
    },

};

// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = AccountModel;