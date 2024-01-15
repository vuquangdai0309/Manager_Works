const connection = require('../../config/db/index')
const WorkModel = {
    addWork: (Work, callback) => {
        Work.createAt = new Date()
        const query = 'INSERT INTO works (title,user_id_send,createAt,date,slug) VALUES (?,?,?,?,?)';
        const values = [Work.title, Work.user_id_send, Work.createAt, Work.date, Work.slug];
        connection.query(query, values, callback);
    },
    getAllWork: (callback) => {
        const query = 'SELECT * FROM works '
        connection.query(query, callback);
    },

    getWorkWithSlug: (slug, callback) => {
        const query = 'SELECT * FROM works WHERE slug =? '
        connection.query(query, [slug], callback);
    }
}
module.exports = WorkModel