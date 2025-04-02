const db = require("./pool");

exports.insertUser = async (fname, lname, user, pass) => {
  await db.query(
    `INSERT INTO users(first_name, last_name, username, password)
     VALUES ($1, $2, $3, $4)`,
    [fname, lname, user, pass],
  );
};

exports.getUserByUsername = async (username) => {
  const { rows } = await db.query(
    `SELECT *, (first_name || ' ' || last_name) AS name
     FROM users WHERE username = $1`,
    [username],
  );
  return rows[0];
};

exports.getUserByID = async (id) => {
  const { rows } = await db.query(
    `SELECT *, (first_name || ' ' || last_name) AS name
     FROM users WHERE id = $1`,
    [id],
  );
  return rows[0];
};

exports.toggleUserMembership = async (id) => {
  await db.query(`UPDATE users SET member_status = TRUE WHERE id = $1`, [id]);
};

exports.toggleUserAdmin = async (id) => {
  await db.query(`UPDATE users SET admin_status = TRUE WHERE id = $1`, [id]);
};

exports.getAllMessages = async () => {
  const { rows } = await db.query(
    `SELECT m.id, title, text, timestamp, u.username AS username FROM messages m
     JOIN users u ON u.id = m.user_id;`,
  );
  return rows;
};

exports.deleteMessage = async (id) => {
  await db.query(`DELETE FROM messages WHERE id = $1`, [id]);
};

exports.insertMessage = async (title, text, id) => {
  await db.query(
    `INSERT INTO messages (title, text, user_id)
     VALUES($1, $2, $3)`,
    [title, text, id],
  );
};
