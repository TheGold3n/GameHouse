"""
FastAPI Backend para GameHouse Player Management System
======================================================

CRUD API con base de datos SQLite usando SQLAlchemy.
Endpoints available at http://localhost:8000/api/players
Documentation at http://localhost:8000/docs
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, String, DateTime
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session, Mapped, mapped_column
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin
)

# ============================================================================
# CONFIGURACIÓN DE BASE DE DATOS (Soporte SQLite y PostgreSQL / Render)
# ============================================================================

# URL de conexión (configurable vía variable de entorno con fallback a SQLite local)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./players.db")

# Render y SQLAlchemy 2.0 fix: Render expone "postgres://", pero SQLAlchemy 2.0 requiere "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Si es SQLite con ruta de archivo, asegurar que el directorio exista
if DATABASE_URL.startswith("sqlite:///") and not DATABASE_URL.startswith("sqlite:///:memory:"):
    db_file_path = DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_file_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

# Configuración del motor según el motor de base de datos
engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    # Requerido solo para SQLite debido a multithreading en FastAPI
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Para PostgreSQL en la nube (Render / Docker), mantener vivas las conexiones inactivas
    engine_kwargs["pool_pre_ping"] = True

# Crear motor de BD
engine = create_engine(
    DATABASE_URL,
    **engine_kwargs
)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos SQLAlchemy (estilo SQLAlchemy 2.0)
class Base(DeclarativeBase):
    pass

# ============================================================================
# MODELOS DE BASE DE DATOS (SQLAlchemy)
# ============================================================================

class PlayerModel(Base):
    """Modelo de jugador en la base de datos"""
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    playerName: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active")
    role: Mapped[str] = mapped_column(String(20), default="player")
    game: Mapped[Optional[str]] = mapped_column(String(100), default="Minecraft", nullable=True)
    registeredAt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


# Crear todas las tablas (si no existen)
try:
    Base.metadata.create_all(bind=engine)
except Exception as err:
    print(f"⚠️ Advertencia inicial en create_all (se reintentará en lifespan): {err}")

# ============================================================================
# ESQUEMAS PYDANTIC (Para API)
# ============================================================================

class StatusEnum(str, Enum):
    """Estados válidos para un jugador"""
    active = "active"
    inactive = "inactive"


class PlayerBase(BaseModel):
    """Modelo base con campos comunes"""
    playerName: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=5, max_length=20)
    email: str = Field(..., pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    status: StatusEnum = Field(default=StatusEnum.active)
    role: Optional[str] = Field(default="player")
    game: Optional[str] = Field(default="Minecraft")


class PlayerFormValues(PlayerBase):
    """Valores que recibe el formulario (sin id ni registeredAt)"""
    pass


class Player(PlayerBase):
    """Modelo completo de un jugador (con id y timestamp)"""
    id: int
    registeredAt: datetime
    
    class Config:
        from_attributes = True  # Para convertir objetos SQLAlchemy a Pydantic


class UserRegister(BaseModel):
    """Esquema de entrada para el registro de nuevos usuarios"""
    playerName: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=5, max_length=20)
    email: str = Field(..., pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    password: str = Field(..., min_length=6, max_length=100)
    game: Optional[str] = Field(default="Minecraft")


class TokenResponse(BaseModel):
    """Esquema de respuesta para token de acceso JWT"""
    access_token: str
    token_type: str = "bearer"


# ============================================================================
# DEPENDENCIAS
# ============================================================================

def get_db():
    """Dependencia para obtener la sesión de BD en cada request"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================================
# FUNCIÓN DE INICIALIZACIÓN Y MIGRACIÓN DE ESQUEMA
# ============================================================================

def ensure_schema():
    """Asegura que las columnas requeridas (game, role y hashed_password) existan en la tabla"""
    try:
        from sqlalchemy import inspect, text
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        if "players" in tables:
            columns = [col["name"] for col in inspector.get_columns("players")]
            with engine.connect() as conn:
                if "game" not in columns:
                    conn.execute(text("ALTER TABLE players ADD COLUMN game VARCHAR(100) DEFAULT 'Minecraft'"))
                    conn.commit()
                    print("[INFO] Columna 'game' verificada/añadida a la tabla 'players'")
                if "role" not in columns:
                    conn.execute(text("ALTER TABLE players ADD COLUMN role VARCHAR(20) DEFAULT 'player'"))
                    conn.commit()
                    print("[INFO] Columna 'role' verificada/añadida a la tabla 'players'")
                if "hashed_password" not in columns:
                    default_hash = hash_password("Player.1234")
                    conn.execute(text(f"ALTER TABLE players ADD COLUMN hashed_password VARCHAR(255) DEFAULT '{default_hash}'"))
                    conn.commit()
                    print("[INFO] Columna 'hashed_password' verificada/añadida a la tabla 'players'")
            
            # Garantizar que el usuario admin velvyn tenga rol admin y contraseña correcta
            db = SessionLocal()
            try:
                admin_velvyn = db.query(PlayerModel).filter(
                    (PlayerModel.playerName.ilike("velvyn")) | 
                    (PlayerModel.email == "velvyn@gamehouse.admin")
                ).first()
                if admin_velvyn:
                    admin_velvyn.role = "admin"
                    admin_velvyn.hashed_password = hash_password("Velvyn.1234")
                    db.commit()
                    print("[INFO] Usuario administrador 'velvyn' actualizado con credenciales Bcrypt.")
            except Exception as admin_err:
                print(f"[WARN] Nota de actualización admin: {admin_err}")
                db.rollback()
            finally:
                db.close()
    except Exception as e:
        print(f"[WARN] Nota de verificación de esquema: {e}")


def init_mock_data():
    """Inicializa con datos de jugadores realistas con sus juegos actuales y contraseñas hasheadas"""
    db = SessionLocal()
    try:
        # Detectar si hay datos viejos temporales (@tempgaming.local) para actualizarlos
        old_data = db.query(PlayerModel).filter(PlayerModel.email.like("%@tempgaming.local%")).first()
        if old_data:
            print("[INFO] Migrando datos antiguos a la nueva lista de jugadores realistas con juegos...")
            db.query(PlayerModel).delete()
            db.commit()
        elif db.query(PlayerModel).count() >= 40:
            print("[INFO] Base de datos ya contiene jugadores actualizados")
            return
        
        print("[INFO] Inicializando comunidad de jugadores activa...")
        
        # Lista realista de jugadores: (nombre, teléfono, email, estado, juego, rol)
        realistic_players = [
            ("velvyn", "+1-555-0100", "velvyn@gamehouse.admin", "active", "Minecraft", "admin"),
            ("Kael_Sniper", "+34 612 345 678", "kael.sniper99@gmail.com", "active", "Counter-Strike 2", "player"),
            ("Valkyrie_Vex", "+1 415 892 3341", "valk.vex@outlook.com", "active", "Valorant", "player"),
            ("Draco_Clutch", "+54 9 11 4821 9901", "draco.clutch@gmail.com", "active", "Fortnite", "player"),
            ("Neko_GamerTV", "+52 55 1298 4432", "neko.live@twitch.tv", "active", "Minecraft", "player"),
            ("ApexPredator_X", "+1 206 555 0192", "apex.predator.x@proton.me", "active", "Apex Legends", "player"),
            ("GhostRider_77", "+56 9 8765 4321", "ghost.rider77@gmail.com", "active", "Call of Duty: Warzone", "player"),
            ("Sombra_FPS", "+57 310 987 6543", "sombra.tactical@gmail.com", "active", "Valorant", "player"),
            ("ArcticFox_x", "+44 7700 900123", "arcticfox.gaming@icloud.com", "active", "Minecraft", "player"),
            ("Nova_Striker", "+49 151 23456789", "nova.striker@gmail.com", "active", "Counter-Strike 2", "player"),
            ("Zenith_CS", "+33 6 12 34 56 78", "zenith.global@proton.me", "active", "Counter-Strike 2", "player"),
            ("PixelQueen", "+55 11 98765 4321", "pixelqueen.stream@gmail.com", "active", "Minecraft", "player"),
            ("Vortex_Aim", "+1 312 555 0147", "vortex.aimbot@outlook.com", "active", "Valorant", "player"),
            ("Blaze_Fury", "+54 9 351 445 6677", "blaze.fury01@gmail.com", "active", "Fortnite", "player"),
            ("CyberSamurai", "+81 90 1234 5678", "samurai.cyber@gmail.com", "active", "Overwatch 2", "player"),
            ("Luna_Eclipse", "+1 647 555 0188", "luna.eclipse.mc@proton.me", "active", "Minecraft", "player"),
            ("ToxicVenom", "+52 81 2345 6789", "toxic.venom@gmail.com", "inactive", "Call of Duty: Warzone", "player"),
            ("TitanSlayer", "+1 404 555 0173", "titanslayer.gg@gmail.com", "active", "Apex Legends", "player"),
            ("EchoKnight_9", "+44 7911 123456", "echoknight9@outlook.com", "active", "Rainbow Six Siege", "player"),
            ("ShadowPulse", "+34 699 887 766", "shadowpulse.val@gmail.com", "active", "Valorant", "player"),
            ("IronClad_Tank", "+1 713 555 0165", "ironclad.tank@gmail.com", "active", "Overwatch 2", "player"),
            ("StormChaser_X", "+54 9 11 7766 5544", "stormchaser.x@icloud.com", "active", "Fortnite", "player"),
            ("Quantum_Dash", "+1 503 555 0122", "quantum.dash@proton.me", "active", "Apex Legends", "player"),
            ("NightHawk_FPS", "+49 170 9876543", "nighthawk.cs2@gmail.com", "active", "Counter-Strike 2", "player"),
            ("RedstonePro_", "+1 214 555 0134", "redstone.engineer@gmail.com", "active", "Minecraft", "player"),
            ("RogueAgent_00", "+33 7 89 01 23 45", "rogue.agent00@gmail.com", "inactive", "Rainbow Six Siege", "player"),
            ("AstroBoy_99", "+52 33 4455 6677", "astroboy99@gmail.com", "active", "Minecraft", "player"),
            ("CrimsonReaper", "+1 305 555 0199", "crimson.reaper@outlook.com", "active", "Call of Duty: Warzone", "player"),
            ("FrostBite_TV", "+44 7890 123456", "frostbite.live@twitch.tv", "active", "Valorant", "player"),
            ("HyperNova_Z", "+56 9 7654 3210", "hypernova.z@gmail.com", "active", "Fortnite", "player"),
            ("SilentKill_", "+34 600 112 233", "silentkill.sniper@gmail.com", "inactive", "Counter-Strike 2", "player"),
            ("NeonRider_88", "+1 619 555 0184", "neonrider88@gmail.com", "active", "Minecraft", "player"),
            ("ViperStrike_", "+57 300 123 4567", "viperstrike.main@proton.me", "active", "Valorant", "player"),
            ("GlitchMaster", "+1 202 555 0111", "glitchmaster.gg@gmail.com", "active", "Apex Legends", "player"),
            ("SoulReaver_99", "+49 160 1122334", "soulreaver99@gmail.com", "active", "Counter-Strike 2", "player"),
            ("EmeraldCrafter", "+1 416 555 0155", "emerald.crafter@gmail.com", "active", "Minecraft", "player"),
            ("ZeroPoint_BR", "+55 21 99887 6655", "zeropoint.br@outlook.com", "active", "Fortnite", "player"),
            ("BulletProof_", "+1 702 555 0177", "bulletproof.cod@gmail.com", "active", "Call of Duty: Warzone", "player"),
            ("BreachMaster", "+33 6 98 76 54 32", "breach.master@icloud.com", "active", "Rainbow Six Siege", "player"),
            ("OverDrive_Gen", "+1 617 555 0142", "overdrive.gen@gmail.com", "inactive", "Overwatch 2", "player"),
            ("DiamondSword_", "+54 9 11 3322 1100", "diamondsword.pvp@gmail.com", "active", "Minecraft", "player"),
            ("RadiantAce_TV", "+1 949 555 0138", "radiant.ace@twitch.tv", "active", "Valorant", "player"),
            ("TacticalNuke", "+1 818 555 0166", "tactical.nuke@proton.me", "active", "Call of Duty: Warzone", "player"),
            ("SkyWalker_MC", "+34 677 889 900", "skywalker.mc@gmail.com", "active", "Minecraft", "player"),
            ("SubTickGod", "+49 152 3344556", "subtick.god@gmail.com", "active", "Counter-Strike 2", "player"),
        ]

        for playerName, phone, email, status_val, game_val, role_val in realistic_players:
            initial_password = "Velvyn.1234" if role_val == "admin" else "Player.1234"
            player = PlayerModel(
                playerName=playerName,
                phone=phone,
                email=email,
                hashed_password=hash_password(initial_password),
                status=status_val,
                game=game_val,
                role=role_val
            )
            db.add(player)
        
        db.commit()
        active_total = sum(1 for p in realistic_players if p[3] == "active")
        print(f"[INFO] {len(realistic_players)} jugadores agregados ({active_total} activos en línea)")

    
    except Exception as e:
        print(f"[ERROR] Error al inicializar datos: {e}")
        db.rollback()
    finally:
        db.close()


# ============================================================================
# LIFESPAN (Inicializar BD al iniciar y limpieza al cerrar)
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ciclo de vida de la aplicación: se ejecuta al iniciar y al detener"""
    print("\n" + "="*60)
    print("[INIT] Iniciando GameHouse Player Management API")
    print("="*60)
    print(f"[DB] Base de datos: {DATABASE_URL}")
    try:
        Base.metadata.create_all(bind=engine)
        ensure_schema()
        init_mock_data()
    except Exception as e:
        print(f"[WARN] Error en inicialización de base de datos: {e}")
    print("[OK] API lista en http://localhost:8000")
    print("[DOCS] Documentación: http://localhost:8000/docs\n")
    yield

# ============================================================================
# INICIALIZACIÓN DE FASTAPI
# ============================================================================

app = FastAPI(
    title="GameHouse Player Management API",
    description="CRUD API para gestionar jugadores con SQLite",
    version="1.0.0",
    lifespan=lifespan
)

# ============================================================================
# CONFIGURACIÓN CORS
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# RUTAS (ENDPOINTS)
# ============================================================================

@app.get("/api/info", tags=["Info"])
async def api_info():
    """Endpoint con información de la API"""
    return {
        "message": "GameHouse Player Management API",
        "version": "1.0.0",
        "database": engine.dialect.name.upper(),
        "docs": "/docs",
        "endpoints": {
            "register": "POST /api/auth/register",
            "login": "POST /api/auth/login",
            "me": "GET /api/auth/me",
            "get_all_players": "GET /api/players",
            "create_player": "POST /api/players",
            "update_player": "PUT /api/players/{id} [Requires Admin JWT]",
            "delete_player": "DELETE /api/players/{id} [Requires Admin JWT]",
            "health_check": "GET /health"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check(db: Session = Depends(get_db)):
    """Verificación de salud del servidor"""
    total_players = db.query(PlayerModel).count()
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": "SQLite",
        "total_players": total_players
    }


# ============================================================================
# ENDPOINTS CRUD PARA JUGADORES
# ============================================================================

@app.get("/api/players", response_model=List[Player], tags=["Players"])
async def get_all_players(db: Session = Depends(get_db)):
    """
    Obtiene la lista de todos los jugadores.
    
    Returns:
        List[Player]: Lista de jugadores
    """
    players = db.query(PlayerModel).all()
    return players


# ============================================================================
# ENDPOINTS DE AUTENTICACIÓN (JWT & BCRYPT)
# ============================================================================

@app.post("/api/auth/register", response_model=Player, status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def register_player(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en la plataforma con contraseña encriptada usando Bcrypt.
    """
    existing = db.query(PlayerModel).filter(PlayerModel.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El email '{user_data.email}' ya se encuentra registrado."
        )

    new_player = PlayerModel(
        playerName=user_data.playerName,
        phone=user_data.phone,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        status="active",
        role="player",
        game=user_data.game or "Minecraft"
    )
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player


@app.post("/api/auth/login", response_model=TokenResponse, tags=["Authentication"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Inicia sesión validando credenciales contra la BD y emite un token JWT Bearer (válido por 60 min).
    """
    user = db.query(PlayerModel).filter(
        (PlayerModel.email == form_data.username) | 
        (PlayerModel.playerName == form_data.username)
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (usuario o contraseña no válidos).",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role,
            "id": user.id,
            "name": user.playerName
        }
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/api/auth/me", response_model=Player, tags=["Authentication"])
async def get_current_user_profile(current_user: PlayerModel = Depends(get_current_user)):
    """
    Retorna los datos del usuario autenticado actualmente a partir de su token JWT Bearer.
    """
    return current_user


# ============================================================================
# ENDPOINTS MUTATIVOS Y CRUD PARA JUGADORES
# ============================================================================

@app.post("/api/players", response_model=Player, status_code=status.HTTP_201_CREATED, tags=["Players"])
async def create_player(
    player_form: PlayerFormValues, 
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo jugador desde el panel general.
    
    Args:
        player_form (PlayerFormValues): Datos del nuevo jugador
        db: Sesión de base de datos
    
    Returns:
        Player: El jugador creado con id y registeredAt
    
    Raises:
        HTTPException: Si el email ya existe
    """
    existing = db.query(PlayerModel).filter(PlayerModel.email == player_form.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email {player_form.email} already registered"
        )

    # Crear nuevo jugador con contraseña por defecto
    db_player = PlayerModel(
        playerName=player_form.playerName,
        phone=player_form.phone,
        email=player_form.email,
        hashed_password=hash_password("Player.1234"),
        status=player_form.status,
        role="player",
        game=player_form.game or "Minecraft"
    )
    
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    
    return db_player


@app.put("/api/players/{player_id}", response_model=Player, tags=["Players"])
async def update_player(
    player_id: int, 
    player_form: PlayerFormValues, 
    db: Session = Depends(get_db),
    current_admin: PlayerModel = Depends(require_admin)
):
    """
    Actualiza un jugador existente (Requiere privilegios de Administrador con JWT).

    
    Args:
        player_id (int): ID del jugador
        player_form (PlayerFormValues): Nuevos datos
        db: Sesión de base de datos
    
    Returns:
        Player: El jugador actualizado
    
    Raises:
        HTTPException: Si el jugador no existe o el email ya está en uso
    """
    db_player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    
    if not db_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id {player_id} not found"
        )
    
    # Verificar email si cambió
    if player_form.email != db_player.email:
        existing = db.query(PlayerModel).filter(PlayerModel.email == player_form.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email {player_form.email} already in use"
            )
    
    # Actualizar campos
    db_player.playerName = player_form.playerName
    db_player.phone = player_form.phone
    db_player.email = player_form.email
    db_player.status = player_form.status
    if player_form.game is not None:
        db_player.game = player_form.game
    if player_form.role:
        db_player.role = player_form.role
    
    db.commit()
    db.refresh(db_player)
    
    return db_player


@app.delete("/api/players/{player_id}", tags=["Players"])
async def delete_player(
    player_id: int, 
    db: Session = Depends(get_db), 
    current_admin: PlayerModel = Depends(require_admin)
):
    """
    Elimina un jugador (Requiere privilegios de Administrador con JWT).

    
    Args:
        player_id (int): ID del jugador a eliminar
        db: Sesión de base de datos
    
    Returns:
        dict: { "success": true }
    
    Raises:
        HTTPException: Si el jugador no existe
    """
    db_player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    
    if not db_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id {player_id} not found"
        )
    
    db.delete(db_player)
    db.commit()
    
    return {"success": True}


# ============================================================================
# SERVIR FRONTEND SPA (Si existe dist/ para Render o Producción)
# ============================================================================

DIST_DIR = os.path.join(os.path.dirname(__file__), "dist") if os.path.exists(os.path.join(os.path.dirname(__file__), "dist")) else os.path.join(os.getcwd(), "dist")

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", tags=["Frontend"])
    async def serve_spa(full_path: str = ""):
        # Excluir rutas de API o documentación para que no sean interceptadas
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path == "health" or full_path == "openapi.json":
            raise HTTPException(status_code=404, detail="Not found")
        file_path = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

@app.get("/", tags=["Root"])
async def root():
    """Endpoint raíz: sirve la aplicación web si existe dist, o info de la API"""
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "message": "GameHouse Player Management API",
        "version": "1.0.0",
        "database": "SQLite",
        "docs": "/docs",
        "endpoints": {
            "get_all_players": "GET /api/players",
            "create_player": "POST /api/players",
            "update_player": "PUT /api/players/{id}",
            "delete_player": "DELETE /api/players/{id}",
            "health_check": "GET /health"
        }
    }


# ============================================================================
# MANEJO DE ERRORES
# ============================================================================

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Maneja errores de validación"""
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": str(exc),
            "error": "Validation Error"
        }
    )


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    print("\n╔════════════════════════════════════════════════════════╗")
    print("║  🎮 GameHouse Backend - FastAPI Server                 ║")
    print("╠════════════════════════════════════════════════════════╣")
    print("║  📡 URL:          http://localhost:8000                 ║")
    print("║  📚 Docs:         http://localhost:8000/docs            ║")
    print("║  ⚙️  ReDoc:        http://localhost:8000/redoc           ║")
    print("║  🔌 API Base:     http://localhost:8000/api/players     ║")
    print("╚════════════════════════════════════════════════════════╝\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
