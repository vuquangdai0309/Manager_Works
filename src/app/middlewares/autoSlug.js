const slugify = require('slugify');
function generateUniqueSlug(name) {
    const baseSlug = slugify(name);
    const uniqueSlug = `${baseSlug}-${new Date().getTime()}`; // Thêm timestamp để đảm bảo duy nhất
  
    return uniqueSlug;
  }
module.exports ={generateUniqueSlug}