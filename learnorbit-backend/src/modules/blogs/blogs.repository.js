const pool = require('../../config/database');

class BlogsRepository {
  async create(blog) {
    const sql = `
      INSERT INTO blogs (title, slug, content, cover_image, author_id, published)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const params = [
      blog.title,
      blog.slug,
      blog.content || null,
      blog.cover_image || null,
      blog.author_id,
      blog.published || false
    ];
    const { rows } = await pool.query(sql, params);
    return rows[0];
  }

  async findPublished() {
    const sql = `
      SELECT b.*, u.name as author_name 
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.published = TRUE
      ORDER BY b.created_at DESC
    `;
    const { rows } = await pool.query(sql);
    return rows;
  }

  async findBySlug(slug) {
    const sql = `
      SELECT b.*, u.name as author_name 
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.slug = $1
    `;
    const { rows } = await pool.query(sql, [slug]);
    return rows[0] || null;
  }

  async findById(id) {
    const sql = `
      SELECT * FROM blogs WHERE id = $1
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  async findByAuthor(authorId) {
    const sql = `
      SELECT b.*, u.name as author_name 
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.author_id = $1
      ORDER BY b.created_at DESC
    `;
    const { rows } = await pool.query(sql, [authorId]);
    return rows;
  }

  async update(id, updates) {
    const fields = [];
    const params = [];
    if (updates.title !== undefined) { fields.push(`title = $${params.length + 1}`); params.push(updates.title); }
    if (updates.slug !== undefined) { fields.push(`slug = $${params.length + 1}`); params.push(updates.slug); }
    if (updates.content !== undefined) { fields.push(`content = $${params.length + 1}`); params.push(updates.content); }
    if (updates.cover_image !== undefined) { fields.push(`cover_image = $${params.length + 1}`); params.push(updates.cover_image); }
    if (updates.published !== undefined) { fields.push(`published = $${params.length + 1}`); params.push(updates.published); }
    
    if (fields.length === 0) return null;

    params.push(id);
    const sql = `UPDATE blogs SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`;
    const { rows } = await pool.query(sql, params);
    return rows[0] || null;
  }

  async delete(id) {
    const sql = `DELETE FROM blogs WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = new BlogsRepository();
