const connection = require('../../config/db/index')
const ChildWorkModel = {
    addChildWork: (ChildWork, callback) => {
        const query = 'INSERT INTO child_work (title,work_id,slug) VALUES (?,?,?)';
        const values = [ChildWork.title, ChildWork.work_id, ChildWork.slug];
        connection.query(query, values, callback);
    },
    getAllChild_With_WorkId: (callback) => {
        const query = 'SELECT  works._id AS work_id, works.title AS work_title, ' +
            'child_work._id AS Child_work_id, child_work.title AS Child_work_title ' +
            'FROM works ' +
            'LEFT JOIN child_work ON works._id = child_work.work_id' 
        connection.query(query, callback);
    },
    getWorkWithSlug: (slug, callback) => {
        const query = 'SELECT * FROM child_work WHERE slug =? '
        connection.query(query, [slug], callback);
    }
}
module.exports = ChildWorkModel