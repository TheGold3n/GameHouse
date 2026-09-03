import sqlite3
import sys

db_path = sys.argv[1] if len(sys.argv) > 1 else "/app/data/players.db"
print(f"Connecting to database: {db_path}")

conn = sqlite3.connect(db_path)
c = conn.cursor()

# 1. Comprobar si existe la columna 'role'
c.execute("PRAGMA table_info(players)")
columns = [col[1] for col in c.fetchall()]
if "role" not in columns:
    c.execute("ALTER TABLE players ADD COLUMN role VARCHAR(20) DEFAULT 'player'")
    print("Columna 'role' añadida a la tabla 'players'.")
else:
    print("La columna 'role' ya existe.")

# 2. Comprobar si existe la columna 'hashed_password'
if "hashed_password" not in columns:
    from auth import hash_password
    default_hash = hash_password("Player.1234")
    c.execute(f"ALTER TABLE players ADD COLUMN hashed_password VARCHAR(255) DEFAULT '{default_hash}'")
    print("Columna 'hashed_password' añadida a la tabla 'players'.")
else:
    print("La columna 'hashed_password' ya existe.")

# 3. Comprobar si existe velvyn
from auth import hash_password
velvyn_hash = hash_password("Velvyn.1234")
c.execute("SELECT id, playerName, email, role FROM players WHERE LOWER(playerName) = 'velvyn'")
existing = c.fetchone()

if existing:
    c.execute("UPDATE players SET role = 'admin', status = 'active', hashed_password = ? WHERE id = ?", (velvyn_hash, existing[0]))
    print(f"Usuario existente actualizado a admin con hash Bcrypt: ID={existing[0]}")
else:
    c.execute(
        """
        INSERT INTO players (playerName, phone, email, hashed_password, status, role, registeredAt)
        VALUES ('velvyn', '+1-555-0100', 'velvyn@gamehouse.admin', ?, 'active', 'admin', datetime('now'))
        """,
        (velvyn_hash,)
    )
    print("Usuario 'velvyn' insertado exitosamente con rol 'admin' y hash Bcrypt.")

conn.commit()

c.execute("SELECT id, playerName, phone, email, status, role, registeredAt FROM players WHERE LOWER(playerName) = 'velvyn'")
record = c.fetchone()
print(f"Registro en BD: {record}")

conn.close()

