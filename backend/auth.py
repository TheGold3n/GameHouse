"""
Módulo de Autenticación y Seguridad para GameHouse API
======================================================

Implementa:
- Hashing de contraseñas con Passlib (Bcrypt).
- Generación y validación de JSON Web Tokens (PyJWT).
- Esquema de seguridad OAuth2PasswordBearer.
- Dependencias FastAPI get_current_user y require_admin para control de acceso RBAC.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# ============================================================================
# PARCHE PREVENTIVO DE COMPATIBILIDAD BCRYPT / PASSLIB
# ============================================================================
# Garantiza compatibilidad transparente entre Passlib 1.7.4 y distintas versiones de bcrypt
import bcrypt
if not hasattr(bcrypt, "__about__"):
    class _About:
        __version__ = getattr(bcrypt, "__version__", "4.0.1")
    bcrypt.__about__ = _About()

# ============================================================================
# CONFIGURACIÓN CRIPTOGRÁFICA Y JWT
# ============================================================================

# Contexto de contraseñas utilizando algoritmo Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clave secreta (mínimo 32 bytes para cumplimiento con RFC 7518 HMAC-SHA256)
SECRET_KEY = os.getenv(
    "SECRET_KEY", 
    "gamehouse-ultra-secure-jwt-secret-key-production-2026-32b-min!"
)
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Esquema de autenticación OAuth2 Bearer apuntando a la ruta de inicio de sesión
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ============================================================================
# FUNCIONES AUXILIARES DE CONTRASEÑA Y TOKEN
# ============================================================================

def hash_password(password: str) -> str:
    """
    Genera un hash seguro de la contraseña usando bcrypt a través de Passlib.
    
    Args:
        password (str): Contraseña en texto plano
        
    Returns:
        str: Hash de la contraseña con salt incluido
    """
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Verifica si una contraseña en texto plano coincide con el hash almacenado.
    
    Args:
        plain (str): Contraseña en texto plano a verificar
        hashed (str): Hash bcrypt almacenado en la base de datos
        
    Returns:
        bool: True si coincide, False en caso contrario
    """
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Genera y firma un JSON Web Token (JWT) con un tiempo de expiración estándar (60 min).
    
    Args:
        data (dict): Información que se incluirá en el payload del token
        expires_delta (Optional[timedelta]): Tiempo personalizado de expiración
        
    Returns:
        str: Token JWT codificado y firmado
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# ============================================================================
# DEPENDENCIAS DE AUTORIZACIÓN Y USUARIO ACTUAL (FASTAPI)
# ============================================================================

def get_current_user(
    token: str = Depends(oauth2_scheme)
) -> Any:
    """
    Dependencia de FastAPI para decodificar, validar el token Bearer JWT
    y obtener el usuario autenticado desde la base de datos.
    
    Args:
        token (str): Token Bearer inyectado automáticamente desde el encabezado Authorization
        
    Returns:
        PlayerModel: Entidad del usuario autenticado
        
    Raises:
        HTTPException: 401 Unauthorized si el token es inválido, expirado o el usuario no existe
    """
    # Importación diferida para evitar dependencias circulares con main.py
    from main import SessionLocal, PlayerModel

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales de acceso.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, jwt.PyJWTError):
        raise credentials_exception

    db = SessionLocal()
    try:
        user = db.query(PlayerModel).filter(PlayerModel.email == email).first()
        if user is None:
            raise credentials_exception
        return user
    finally:
        db.close()


def require_admin(
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    Dependencia de FastAPI para verificar que el usuario autenticado
    posea rol de Administrador ('admin').
    
    Args:
        current_user (PlayerModel): Usuario autenticado obtenido mediante get_current_user
        
    Returns:
        PlayerModel: Usuario administrador validado
        
    Raises:
        HTTPException: 403 Forbidden si el usuario no tiene rol 'admin'
    """
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado: Se requieren privilegios de Administrador para realizar esta operación."
        )
    return current_user

