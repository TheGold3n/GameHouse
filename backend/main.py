"""
FastAPI Backend para GameHouse Player Management System
======================================================

CRUD API con base de datos SQLite usando SQLAlchemy.
Endpoints available at http://localhost:8000/api/players
Documentation at http://localhost:8000/docs
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, String, DateTime
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session, Mapped, mapped_column
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum

# ============================================================================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================================================================

# URL de conexión a SQLite (configurable vía variable de entorno)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./players.db")

# Si es SQLite con ruta de archivo, asegurar que el directorio exista
if DATABASE_URL.startswith("sqlite:///") and not DATABASE_URL.startswith("sqlite:///:memory:"):
    db_file_path = DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_file_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

# Crear motor de BD
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Necesario solo para SQLite
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
    status: Mapped[str] = mapped_column(String(20), default="active")
    role: Mapped[str] = mapped_column(String(20), default="player")
    registeredAt: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


# Crear todas las tablas (si no existen)
Base.metadata.create_all(bind=engine)

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


class PlayerFormValues(PlayerBase):
    """Valores que recibe el formulario (sin id ni registeredAt)"""
    pass


class Player(PlayerBase):
    """Modelo completo de un jugador (con id y timestamp)"""
    id: int
    registeredAt: datetime
    
    class Config:
        from_attributes = True  # Para convertir objetos SQLAlchemy a Pydantic


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
# FUNCIÓN DE INICIALIZACIÓN DE DATOS
# ============================================================================

def init_mock_data():
    """Inicializa con datos mock si la tabla está vacía"""
    db = SessionLocal()
    try:
        # Si ya hay jugadores, no hacer nada
        if db.query(PlayerModel).count() > 0:
            print("✓ Base de datos ya contiene jugadores")
            return
        
        print("📝 Inicializando datos mock...")
        
        mock_data = [
            ("ShadowNinja_42", "+1-234-567-8901", "shadowninja_42@tempgaming.local", "active"),
            ("PhantomGamer", "+1-345-678-9012", "phantomgamer@tempgaming.local", "active"),
            ("VortexKing88", "+1-456-789-0123", "vortexking88@tempgaming.local", "inactive"),
            ("NeonStrike", "+1-567-890-1234", "neonstrike@tempgaming.local", "active"),
            ("IceBlast99", "+1-678-901-2345", "iceblast99@tempgaming.local", "active"),
            ("ThunderLord", "+1-789-012-3456", "thunderlord@tempgaming.local", "inactive"),
            ("FirePhoenix", "+1-890-123-4567", "firephoenix@tempgaming.local", "active"),
            ("CyberWolf_1", "+1-901-234-5678", "cyberwolf_1@tempgaming.local", "active"),
            ("SilentAssassin", "+1-012-345-6789", "silentassassin@tempgaming.local", "inactive"),
            ("VoidWalker", "+1-123-456-7890", "voidwalker@tempgaming.local", "active"),
            ("SolarFlare99", "+1-234-567-8902", "solarflare99@tempgaming.local", "active"),
            ("LunaWhisper", "+1-345-678-9013", "lunawhisper@tempgaming.local", "inactive"),
            ("StormBringer", "+1-456-789-0124", "stormbringer@tempgaming.local", "active"),
            ("EchoKnight", "+1-567-890-1235", "echoknight@tempgaming.local", "active"),
            ("SaberEdge77", "+1-678-901-2346", "saberedge77@tempgaming.local", "inactive"),
            ("NovaBlast", "+1-789-012-3457", "novablast@tempgaming.local", "active"),
            ("PrimeHunter", "+1-890-123-4568", "primehunter@tempgaming.local", "active"),
            ("VenomStrike", "+1-901-234-5679", "venomstrike@tempgaming.local", "inactive"),
            ("TitanForce", "+1-012-345-6790", "titanforce@tempgaming.local", "active"),
            ("OmegaRider", "+1-123-456-7891", "omegarider@tempgaming.local", "active"),
            ("IronFist_5", "+1-234-567-8903", "ironfist_5@tempgaming.local", "inactive"),
            ("CrimsonBlade", "+1-345-678-9014", "crimsonblade@tempgaming.local", "active"),
            ("SoulSeeker", "+1-456-789-0125", "soulseeker@tempgaming.local", "active"),
            ("NightCrawler", "+1-567-890-1236", "nightcrawler@tempgaming.local", "inactive"),
            ("PixelMaster", "+1-678-901-2347", "pixelmaster@tempgaming.local", "active"),
            ("RogueWolf", "+1-789-012-3458", "roguewolf@tempgaming.local", "active"),
            ("LumiNova", "+1-890-123-4569", "luminova@tempgaming.local", "inactive"),
            ("SpeedDemon", "+1-901-234-5680", "speeddemon@tempgaming.local", "active"),
            ("QuantumLeap", "+1-012-345-6791", "quantumleap@tempgaming.local", "active"),
            ("EnigmaFox", "+1-123-456-7892", "enigmafox@tempgaming.local", "inactive"),
        ]
        
        for playerName, phone, email, status_val in mock_data:
            player = PlayerModel(
                playerName=playerName,
                phone=phone,
                email=email,
                status=status_val
            )
            db.add(player)
        
        db.commit()
        print(f"✓ {len(mock_data)} jugadores agregados a la BD")
    
    except Exception as e:
        print(f"✗ Error al inicializar datos: {e}")
        db.rollback()
    finally:
        db.close()


# ============================================================================
# ============================================================================
# LIFESPAN (Inicializar BD al iniciar y limpieza al cerrar)
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ciclo de vida de la aplicación: se ejecuta al iniciar y al detener"""
    print("\n" + "="*60)
    print("🚀 Iniciando GameHouse Player Management API")
    print("="*60)
    print(f"📦 Base de datos: {DATABASE_URL}")
    init_mock_data()
    print("✓ API lista en http://localhost:8000")
    print("📚 Documentación: http://localhost:8000/docs\n")
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


@app.post("/api/players", response_model=Player, status_code=status.HTTP_201_CREATED, tags=["Players"])
async def create_player(player_form: PlayerFormValues, db: Session = Depends(get_db)):
    """
    Crea un nuevo jugador.
    
    Args:
        player_form (PlayerFormValues): Datos del nuevo jugador
        db: Sesión de base de datos
    
    Returns:
        Player: El jugador creado con id y registeredAt
    
    Raises:
        HTTPException: Si el email ya existe
    """
    # Verificar si el email ya existe
    existing = db.query(PlayerModel).filter(PlayerModel.email == player_form.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email {player_form.email} already registered"
        )
    
    # Crear nuevo jugador
    db_player = PlayerModel(
        playerName=player_form.playerName,
        phone=player_form.phone,
        email=player_form.email,
        status=player_form.status,
        role=player_form.role or "player"
    )
    
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    
    return db_player


@app.put("/api/players/{player_id}", response_model=Player, tags=["Players"])
async def update_player(player_id: int, player_form: PlayerFormValues, db: Session = Depends(get_db)):
    """
    Actualiza un jugador existente.
    
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
    if player_form.role:
        db_player.role = player_form.role
    
    db.commit()
    db.refresh(db_player)
    
    return db_player


@app.delete("/api/players/{player_id}", tags=["Players"])
async def delete_player(player_id: int, db: Session = Depends(get_db)):
    """
    Elimina un jugador.
    
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
