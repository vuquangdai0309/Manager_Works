const connection = require('../../config/db/index')
const ProgressWorkModel = {
    addProgressWork: (ProgressWork, callback) => {
        const query = 'INSERT INTO progress_works (title,child_work_id,date,slug) VALUES (?,?,?,?)';
        const values = [ProgressWork.title, ProgressWork.child_work_id, ProgressWork.date, ProgressWork.slug];
        connection.query(query, values, callback);
    },
    getAllProgress_With_WorkId: (work_id, callback) => {
        const query = 'SELECT ' +
            'child_work._id AS child_work_id, ' +
            'child_work.title AS child_work_title, ' +
            'progress_works._id AS progress_work_id, ' +
            'progress_works.title AS progress_work_title, ' +
            'progress_works.slug AS progress_work_slug, ' +
            'progress_works.date AS progress_work_date, ' +
            'COUNT(comment._id) AS comment_count ' +
            'FROM child_work ' +
            'LEFT JOIN progress_works ON child_work._id = progress_works.child_work_id ' +
            'LEFT JOIN comment ON progress_works._id = comment.progress_work_id ' +
            'WHERE child_work.work_id = ? ' +
            'GROUP BY child_work._id, child_work.title, progress_works._id, progress_works.title, progress_works.slug, progress_work_date'
        connection.query(query, work_id, callback);
    },
    getProgress_With_Slug: (slug, callback) => {
        const query = 'SELECT * FROM progress_works WHERE slug =? '
        connection.query(query, [slug], callback);
    },
    update_Progress_work: (progress_work_id, progress_work, callback) => {
        const query = 'UPDATE progress_works SET title = ?,slug = ?,date = ? WHERE _id = ?';
        const values = [progress_work.title, progress_work.slug, progress_work.date, progress_work_id];
        connection.query(query, values, callback);
    },

    // thêm mô tả
    addDescribe: (describe, callback) => {
        const query = 'INSERT INTO `describe` (content,progress_work_id,filepdf) VALUES (?,?,?)';
        const values = [describe.content, describe.progress_work_id, describe.filepdf];
        connection.query(query, values, callback);
    },

    getDescribe_With_Id: (Id, callback) => {
        const query = 'SELECT * FROM `describe` WHERE progress_work_id  =? '
        connection.query(query, [Id], callback);
    },
}
module.exports = ProgressWorkModel