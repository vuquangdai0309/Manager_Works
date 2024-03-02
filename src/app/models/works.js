const connection = require('../../config/db/index')
const WorkModel = {
    addWork: (Work, callback) => {
        Work.createAt = new Date()
        const query = 'INSERT INTO works (title,createAt,date,slug,color) VALUES (?,?,?,?,?)';
        const values = [Work.title, Work.createAt, Work.date, Work.slug, Work.color];
        connection.query(query, values, callback);
    },
    getAllWork: (callback) => {
        const query = 'SELECT * FROM works '
        connection.query(query, callback);
    },
    // lấy tên công việc theo slug
    getWorkWithSlug: (slug, callback) => {
        const query = 'SELECT * FROM works WHERE slug =? '
        connection.query(query, [slug], callback);
    }
}
module.exports = WorkModel