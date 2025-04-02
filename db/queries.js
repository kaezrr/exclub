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
