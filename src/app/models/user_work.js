const connection = require('../../config/db/index');
const { connect } = require('../../routes/status');
const UserWorkModel = {
    add_User_Work: (User_Work, callback) => {
        User_Work.createAt = new Date()
        const query = 'INSERT INTO account_work (account_id,work_id,createAt,date) VALUES (?,?,?,?)';
        const values = [User_Work.account_id, User_Work.work_id, User_Work.createAt, User_Work.date];
        connection.query(query, values, callback);
    },
    // lấy những work được tự tạo từ người dùng
    getAll_User_Work: (User_Work, callback) => {
        const query = `
        SELECT works.*, works.title
        FROM works
        INNER JOIN account_work ON works._id = account_work.work_id
        WHERE account_work.account_id = ? AND account_work.status_id = 2
        ORDER BY works.createAt DESC
        `
        connection.query(query, User_Work, callback);
    },
    // lấy những work với tài khoản admin
    getAll_User_Work_Admin: (callback) => {
        const query = `
        SELECT works.*, works.title
        FROM works
        INNER JOIN account_work ON works._id = account_work.work_id
        WHERE account_work.status_id = 2 AND show_screen = 0
        ORDER BY works.createAt DESC
        `
        connection.query(query, callback);
    },
    // tìm kiếm với tài khoản nhân viên   
    search_with_member: (User_Work, name, callback) => {
        const query = `
        SELECT works.*, works.title
        FROM works
        INNER JOIN account_work ON works._id = account_work.work_id
        WHERE account_work.account_id = ? AND account_work.status_id = 2 AND works.title LIKE ?
        ORDER BY works.createAt DESC
        `
        connection.query(query, [User_Work, `%${name}%`], callback);
    },
    // tìm kiếm với tài khoản nhân viên   
    search_with_admin: (name, callback) => {
        const query = `
        SELECT works.*, works.title
        FROM works
        INNER JOIN account_work ON works._id = account_work.work_id
        WHERE account_work.status_id = 2 AND account_work.show_screen = 0 AND works.title LIKE ?
        ORDER BY works.createAt DESC
        `
        connection.query(query, `%${name}%`, callback);
    },
    // tìm kiếm những bản ghi đã có rồi theo tên ID tài khoản và ID công việc
    get_AccountId_and_WorkId: (account_id, work_id, callback) => {
        const query = `
        SELECT * FROM account_work WHERE account_id = ? AND work_id = ?
        `
        connection.query(query, [account_id, work_id], callback);
    },

    // thêm người dùng vào nhóm
    creat_User_Work: (User_Work, callback) => {
        User_Work.createAt = new Date()
        const query = 'INSERT INTO account_work (account_id,work_id,status_id,sender_id,show_screen,createAt,date) VALUES (?,?,?,?,?,?,?)';
        const values = [User_Work.account_id, User_Work.work_id, User_Work.status_id, User_Work.sender_id, User_Work.show_screen, User_Work.createAt, User_Work.date];
        connection.query(query, values, callback);
    },
    // lấy những thành viên của công việc
    get_All_Member: (Id_Work, callback) => {
        const query = `SELECT account_work.*,
        account.username AS username
        FROM account
        INNER JOIN account_work ON account._id = account_work.account_id
        WHERE work_id = ? and status_id =2 
        `
        connection.query(query, Id_Work, callback)
    },
    count_Member: (Id_Work, callback) => {
        const query = `SELECT COUNT(*) AS count
        FROM account_work
        WHERE work_id = ? and status_id =2 
        `
        connection.query(query, Id_Work, callback)
    },
    count_User_Work: (callback) => {
        const query = `SELECT COUNT(*) AS count
        FROM account_work WHERE show_screen = 0`
        connection.query(query, callback)
    }



}
module.exports = UserWorkModel