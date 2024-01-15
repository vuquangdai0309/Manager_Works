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
            'COUNT(comment._id) AS comment_count ' +
            'FROM child_work ' +
            'LEFT JOIN progress_works ON child_work._id = progress_works.child_work_id ' +
            'LEFT JOIN comment ON progress_works._id = comment.progress_work_id ' +
            'WHERE child_work.work_id = ? ' +
            'GROUP BY child_work._id, child_work.title, progress_works._id, progress_works.title, progress_works.slug'
        connection.query(query, work_id, callback);
    },
    getProgress_With_Slug: (slug, callback) => {
        const query = 'SELECT * FROM progress_works WHERE slug =? '
        connection.query(query, [slug], callback);
    }
}
module.exports = ProgressWorkModel