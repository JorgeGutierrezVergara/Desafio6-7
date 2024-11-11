const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "12345",
  database: "softjobs",
  allowExitOnIdle: true,
});

const registrarUsuario = async (usuario) => {
  const { email, password, rol, lenguage } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  const values = [email, passwordEncriptada, rol, lenguage];
  const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
  await pool.query(consulta, values);
};

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" };
};

const obtenerUsuario = async (email) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
  } = await pool.query(consulta, values);
  return usuario;
};

module.exports = {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
};
