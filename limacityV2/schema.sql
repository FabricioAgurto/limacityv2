
CREATE TABLE IF NOT EXISTS users ( id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, is_active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE IF NOT EXISTS roles ( id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL );
CREATE TABLE IF NOT EXISTS user_roles ( id TEXT PRIMARY KEY, user_id TEXT NOT NULL, role_id TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(role_id) REFERENCES roles(id) );
CREATE TABLE IF NOT EXISTS permissions ( id TEXT PRIMARY KEY, key TEXT UNIQUE NOT NULL, description TEXT );
CREATE TABLE IF NOT EXISTS role_permissions ( id TEXT PRIMARY KEY, role_id TEXT NOT NULL, permission_id TEXT NOT NULL, FOREIGN KEY(role_id) REFERENCES roles(id), FOREIGN KEY(permission_id) REFERENCES permissions(id) );
CREATE TABLE IF NOT EXISTS refresh_tokens ( id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token TEXT UNIQUE NOT NULL, expires_at TEXT NOT NULL, revoked INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id) );
CREATE TABLE IF NOT EXISTS news ( id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', created_at TEXT DEFAULT CURRENT_TIMESTAMP, author_id TEXT NOT NULL, FOREIGN KEY(author_id) REFERENCES users(id) );

-- Tienda
CREATE TABLE IF NOT EXISTS store_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_soles REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(item_id) REFERENCES store_items(id)
);

-- Miembros (vista pública)
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE, -- opcional, puede ser null si no usa login
  display_name TEXT NOT NULL,
  role TEXT NOT NULL, -- admin/editor/writer/u otro label público
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Seeds de roles/permits
INSERT OR IGNORE INTO roles (id, name) VALUES ('r-admin','admin'),('r-editor','editor'),('r-writer','writer');
INSERT OR IGNORE INTO permissions (id, key, description) VALUES
  ('p1','news:create','Crear noticias'),
  ('p2','news:update','Editar noticias'),
  ('p3','news:publish','Publicar noticias'),
  ('p4','users:assign-role','Asignar roles'),
  ('p5','rules:manage','Gestionar normativas'),
  ('p6','store:add','Agregar productos'),
  ('p7','store:buy','Comprar productos'),
  ('p8','members:add','Agregar miembros');
INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES
  ('rp1','r-writer','p1'),
  ('rp2','r-writer','p2'),
  ('rp3','r-editor','p1'),
  ('rp4','r-editor','p2'),
  ('rp5','r-editor','p3'),
  ('rp6','r-admin','p1'),
  ('rp7','r-admin','p2'),
  ('rp8','r-admin','p3'),
  ('rp9','r-admin','p4'),
  ('rp10','r-admin','p5'),
  ('rp11','r-admin','p6'),
  ('rp12','r-admin','p7'),
  ('rp13','r-admin','p8');
