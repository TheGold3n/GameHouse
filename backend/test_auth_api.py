"""
Script de Pruebas Automatizadas de Autenticación y Seguridad Web
================================================================
Verifica el correcto funcionamiento de:
1. Hashing con Passlib y validación de Bcrypt.
2. Emisión y decodificación de JWT con PyJWT.
3. Registro de usuarios en /api/auth/register.
4. Login con OAuth2 en /api/auth/login (por username y por email).
5. Consulta de perfil autenticado en /api/auth/me.
6. Protección de rutas administrativas (require_admin) en PUT y DELETE.
"""

import sys
from fastapi.testclient import TestClient
from main import app, SessionLocal, PlayerModel, engine, Base, ensure_schema, init_mock_data
from auth import hash_password, verify_password, create_access_token

def run_tests():
    # Inicializar esquema y datos
    Base.metadata.create_all(bind=engine)
    ensure_schema()
    init_mock_data()

    client = TestClient(app)

    print("=" * 70)
    print("[TEST] INICIANDO VERIFICACION DE SEGURIDAD Y JWT EN GAMEHOUSE API")
    print("=" * 70)


    # 1. Test unitario de Passlib y Bcrypt
    print("\n[1/6] Probando hashing y verificacion con Passlib (Bcrypt)...")
    password = "SuperSecretPassword.2026!"
    hashed = hash_password(password)
    assert hashed != password, "El hash no debe coincidir con el texto plano"
    assert verify_password(password, hashed) is True, "verify_password debe retornar True para contrasena correcta"
    assert verify_password("WrongPassword", hashed) is False, "verify_password debe retornar False para contrasena incorrecta"
    print("  OK: Hashing y verificacion de contrasenas Bcrypt funcionan correctamente.")

    # 2. Test unitario de PyJWT
    print("\n[2/6] Probando creación y firma de JSON Web Tokens...")
    token = create_access_token({"sub": "test@gamehouse.com", "role": "player"})
    assert isinstance(token, str) and len(token) > 20, "El token JWT debe ser una cadena válida"
    print("  OK: Creacion de tokens JWT con PyJWT exitosa.")

    # 3. Test de endpoint /api/auth/register
    print("\n[3/6] Probando POST /api/auth/register...")
    test_email = "tester_security@gamehouse.io"
    
    # Limpiar si existía previamente
    db = SessionLocal()
    existing = db.query(PlayerModel).filter(PlayerModel.email == test_email).first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()

    reg_payload = {
        "playerName": "CyberTester",
        "phone": "+1 555 987 6543",
        "email": test_email,
        "password": "TesterPassword.123",
        "game": "Valorant"
    }
    res_reg = client.post("/api/auth/register", json=reg_payload)
    assert res_reg.status_code == 201, f"Registro falló: {res_reg.text}"
    reg_data = res_reg.json()
    assert reg_data["email"] == test_email
    assert "hashed_password" not in reg_data, "La respuesta NO debe exponer la contraseña hasheada"
    print("  OK: Registro de nuevo usuario exitoso (201 Created).")

    # Intentar registrar el mismo email (debe fallar 400)
    res_dup = client.post("/api/auth/register", json=reg_payload)
    assert res_dup.status_code == 400, "El registro duplicado debió fallar con 400 Bad Request"
    print("  OK: Validacion de email duplicado rechazada correctamente (400 Bad Request).")

    # 4. Test de endpoint /api/auth/login
    print("\n[4/6] Probando POST /api/auth/login...")
    # Login exitoso con email
    login_data = {
        "username": test_email,
        "password": "TesterPassword.123"
    }
    res_login = client.post("/api/auth/login", data=login_data)
    assert res_login.status_code == 200, f"Login con email falló: {res_login.text}"
    token_json = res_login.json()
    assert "access_token" in token_json and token_json["token_type"] == "bearer"
    user_token = token_json["access_token"]
    print("  OK: Login por email exitoso, JWT Bearer retornado.")

    # Login exitoso con username (playerName)
    login_user = {
        "username": "CyberTester",
        "password": "TesterPassword.123"
    }
    res_login_user = client.post("/api/auth/login", data=login_user)
    assert res_login_user.status_code == 200, f"Login con playerName falló: {res_login_user.text}"
    print("  OK: Login por playerName exitoso, JWT Bearer retornado.")

    # Login fallido con contraseña incorrecta
    bad_login = {
        "username": test_email,
        "password": "IncorrectPassword"
    }
    res_bad = client.post("/api/auth/login", data=bad_login)
    assert res_bad.status_code == 401, "Login con contraseña inválida debió fallar con 401"
    print("  OK: Login con contrasena incorrecta rechazado con 401 Unauthorized.")

    # 5. Test de endpoint /api/auth/me
    print("\n[5/6] Probando GET /api/auth/me...")
    # Sin token
    res_me_unauth = client.get("/api/auth/me")
    assert res_me_unauth.status_code == 401, "Acceso sin token debió retornar 401"

    # Con token válido
    res_me_auth = client.get("/api/auth/me", headers={"Authorization": f"Bearer {user_token}"})
    assert res_me_auth.status_code == 200, f"GET /api/auth/me falló: {res_me_auth.text}"
    assert res_me_auth.json()["email"] == test_email
    print("  OK: Endpoint /api/auth/me validado exitosamente con Bearer token.")

    # 6. Test de Control de Acceso basado en Roles (RBAC / require_admin)
    print("\n[6/6] Probando proteccion require_admin en endpoints mutativos (PUT y DELETE)...")
    
    # Obtener un jugador existente para pruebas de edición y eliminación
    players_res = client.get("/api/players")
    players = players_res.json()
    target_player = next((p for p in players if p["email"] == test_email), None)
    assert target_player is not None, "El jugador de prueba debe existir"
    target_id = target_player["id"]

    update_payload = {
        "playerName": "CyberTester_Edited",
        "phone": "+1 555 987 6543",
        "email": test_email,
        "status": "active",
        "role": "player",
        "game": "Valorant"
    }

    # Intento 1: Sin token -> 401 Unauthorized
    res_put_unauth = client.put(f"/api/players/{target_id}", json=update_payload)
    assert res_put_unauth.status_code == 401, f"Debió ser 401 pero fue {res_put_unauth.status_code}"
    print("  OK: Intento de modificacion sin autenticacion bloqueado con 401.")

    # Intento 2: Con usuario 'player' normal -> 403 Forbidden
    res_put_forbidden = client.put(
        f"/api/players/{target_id}", 
        json=update_payload,
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res_put_forbidden.status_code == 403, f"Debió ser 403 pero fue {res_put_forbidden.status_code}"
    print("  OK: Intento de modificacion con rol 'player' bloqueado con 403 Forbidden.")

    # Intento 3: Con usuario administrador 'velvyn' -> Login como admin
    login_admin = {
        "username": "velvyn",
        "password": "Velvyn.1234"
    }
    res_admin_login = client.post("/api/auth/login", data=login_admin)
    assert res_admin_login.status_code == 200, f"Login de admin velvyn falló: {res_admin_login.text}"
    admin_token = res_admin_login.json()["access_token"]
    print("  OK: Login de admin 'velvyn' exitoso.")

    # Modificación exitosa con admin
    res_put_admin = client.put(
        f"/api/players/{target_id}",
        json=update_payload,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_put_admin.status_code == 200, f"Modificación admin falló: {res_put_admin.text}"
    assert res_put_admin.json()["playerName"] == "CyberTester_Edited"
    print("  OK: Modificacion de jugador con privilegios de administrador permitida (200 OK).")

    # Eliminación sin token -> 401
    res_del_unauth = client.delete(f"/api/players/{target_id}")
    assert res_del_unauth.status_code == 401

    # Eliminación con usuario no-admin -> 403
    res_del_forbidden = client.delete(
        f"/api/players/{target_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res_del_forbidden.status_code == 403
    print("  OK: Intento de eliminacion por usuario comun bloqueado con 403 Forbidden.")

    # Eliminación exitosa con admin
    res_del_admin = client.delete(
        f"/api/players/{target_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_del_admin.status_code == 200, f"Eliminación admin falló: {res_del_admin.text}"
    print("  OK: Eliminacion de jugador con privilegios de administrador permitida (200 OK).")

    print("\n" + "=" * 70)
    print("[SUCCESS] TODAS LAS PRUEBAS DE SEGURIDAD Y JWT PASARON SATISFACTORIAMENTE!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
