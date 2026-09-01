"""
FastAPI Backend para GameHouse Player Management System
======================================================

CRUD API with in-memory database for player management.
Endpoints available at http://localhost:8000/api/players
Documentation at http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
import json

# ============================================================================
# TIPOS Y ESQUEMAS
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


class PlayerFormValues(PlayerBase):
    """Valores que recibe el formulario (sin id ni registeredAt)"""
    pass


class Player(PlayerBase):
    """Modelo completo de un jugador (con id y timestamp)"""
    id: int
    registeredAt: str  # ISO format


# ============================================================================
# INICIALIZACIÓN DE FASTAPI
# ============================================================================

app = FastAPI(
    title="GameHouse Player Management API",
    description="CRUD API para gestionar jugadores",
    version="1.0.0"
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
# BASE DE DATOS EN MEMORIA (Simulada)
# ============================================================================

class PlayerDatabase:
    """
    Simulación de base de datos en memoria.
    En producción, usar PostgreSQL, MongoDB, etc.
    """
    
    def __init__(self):
        self.players: List[Player] = []
        self.next_id = 1
        self._initialize_mock_data()
    
    def _initialize_mock_data(self):
        """Inicializa con 30 jugadores mock"""
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
        
        for playerName, phone, email, status in mock_data:
            self.players.append(Player(
                id=self.next_id,
                playerName=playerName,
                phone=phone,
                email=email,
                status=status,
                registeredAt=datetime.utcnow().isoformat() + "Z"
            ))
            self.next_id += 1
    
    def get_all(self) -> List[Player]:
        """Obtiene todos los jugadores"""
        return self.players
    
    def get_by_id(self, player_id: int) -> Optional[Player]:
        """Obtiene un jugador por ID"""
        return next((p for p in self.players if p.id == player_id), None)
    
    def create(self, form_values: PlayerFormValues) -> Player:
        """Crea un nuevo jugador"""
        player = Player(
            id=self.next_id,
            playerName=form_values.playerName,
            phone=form_values.phone,
            email=form_values.email,
            status=form_values.status,
            registeredAt=datetime.utcnow().isoformat() + "Z"
        )
        self.players.append(player)
        self.next_id += 1
        return player
    
    def update(self, player_id: int, form_values: PlayerFormValues) -> Optional[Player]:
        """Actualiza un jugador existente"""
        player = self.get_by_id(player_id)
        if not player:
            return None
        
        player.playerName = form_values.playerName
        player.phone = form_values.phone
        player.email = form_values.email
        player.status = form_values.status
        return player
    
    def delete(self, player_id: int) -> bool:
        """Elimina un jugador"""
        player = self.get_by_id(player_id)
        if not player:
            return False
        
        self.players.remove(player)
        return True


# Instancia global de base de datos
db = PlayerDatabase()

# ============================================================================
# RUTAS (ENDPOINTS)
# ============================================================================

@app.get("/", tags=["Info"])
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "GameHouse Player Management API",
        "version": "1.0.0",
        "docs": "http://localhost:8000/docs",
        "endpoints": {
            "get_all_players": "GET /api/players",
            "create_player": "POST /api/players",
            "update_player": "PUT /api/players/{id}",
            "delete_player": "DELETE /api/players/{id}",
            "health_check": "GET /health"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Verificación de salud del servidor"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "total_players": len(db.players)
    }


# ============================================================================
# ENDPOINTS CRUD PARA JUGADORES
# ============================================================================

@app.get("/api/players", response_model=List[Player], tags=["Players"])
async def get_all_players():
    """
    Obtiene la lista de todos los jugadores.
    
    Returns:
        List[Player]: Lista de jugadores
    """
    return db.get_all()


@app.post("/api/players", response_model=Player, status_code=status.HTTP_201_CREATED, tags=["Players"])
async def create_player(player_form: PlayerFormValues):
    """
    Crea un nuevo jugador.
    
    Args:
        player_form (PlayerFormValues): Datos del nuevo jugador
    
    Returns:
        Player: El jugador creado con id y registeredAt
    """
    return db.create(player_form)


@app.put("/api/players/{player_id}", response_model=Player, tags=["Players"])
async def update_player(player_id: int, player_form: PlayerFormValues):
    """
    Actualiza un jugador existente.
    
    Args:
        player_id (int): ID del jugador
        player_form (PlayerFormValues): Nuevos datos
    
    Returns:
        Player: El jugador actualizado
    
    Raises:
        HTTPException: Si el jugador no existe
    """
    player = db.update(player_id, player_form)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id {player_id} not found"
        )
    return player


@app.delete("/api/players/{player_id}", tags=["Players"])
async def delete_player(player_id: int):
    """
    Elimina un jugador.
    
    Args:
        player_id (int): ID del jugador a eliminar
    
    Returns:
        dict: { "success": true }
    
    Raises:
        HTTPException: Si el jugador no existe
    """
    success = db.delete(player_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id {player_id} not found"
        )
    return {"success": True}


# ============================================================================
# MANEJO DE ERRORES
# ============================================================================

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Maneja errores de validación"""
    return {
        "detail": str(exc),
        "error": "Validation Error"
    }


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
