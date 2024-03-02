const connection = require('../../config/db/index')
const CommentModle = {
    addComment: (Comment, callback) => {
        Comment.createAt = new Date()
        const query = 'INSERT INTO comment (comment,user_id,progress_work_id,date,createAt) VALUES (?,?,?,?,?)';
        const values = [Comment.comment, Comment.user_id, Comment.progress_work_id, Comment.date, Comment.createAt];
        connection.query(query, values, callback);
    },
    getAllCommment: (progress_work_id, callback) => {
        const query = `SELECT comment.*, progress_works.title AS progress_work_title ,account.username AS username 
        FROM comment
        JOIN progress_works ON comment.progress_work_id = progress_works._id
        JOIN account ON comment.user_id = account._id
        WHERE progress_works._id = ?        
        ORDER BY comment.createAt DESC
        `
        connection.query(query, progress_work_id, callback);
    },
    countComment: (progress_work_id, callback) => {
        const query = `SELECT 
        COUNT(comment._id) AS comment_count
        FROM comment
        JOIN progress_works ON comment.progress_work_id = progress_works._id
        WHERE progress_works._id = ?;
        `
        connection.query(query, progress_work_id, callback);
    },
}
module.exports = CommentModle