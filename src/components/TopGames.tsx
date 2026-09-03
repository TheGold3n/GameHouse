import { Flame, Trophy, Users, Sparkles } from 'lucide-react'

export interface GameItem {
  id: string
  title: string
  developer: string
  rank: number
  genre: string
  monthlyPlayers: string
  tagline: string
  badgeText: string
  isTopRank?: boolean
  accentColor: string
  platforms: string[]
  keyFeatures: string[]
}

const TOP_GAMES: GameItem[] = [
  {
    id: 'minecraft',
    title: 'Minecraft',
    developer: 'Mojang Studios / Xbox',
    rank: 1,
    genre: 'Sandbox • Supervivencia • Multijugador',
    monthlyPlayers: '170M+ Activos',
    tagline: 'El videojuego más jugado y vendido del mundo. Creatividad infinita, modo supervivencia extrema, servidores comunitarios y mundos sin límites.',
    badgeText: '🏆 TOP 1 GLOBAL',
    isTopRank: true,
    accentColor: '#10b981', // Verde esmeralda Minecraft
    platforms: ['PC', 'Console', 'Mobile'],
    keyFeatures: ['Generación Infinita', 'Redstone & Modding', 'Cross-play', 'Supervivencia']
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    developer: 'Epic Games',
    rank: 2,
    genre: 'Battle Royale • Cero Construcción • Creativo',
    monthlyPlayers: '230M+ Activos',
    tagline: 'El fenómeno cultural global de 100 jugadores simultáneos. Conciertos en vivo, modo Cero Construcción y el potente motor Unreal Engine 5.',
    badgeText: '🔥 BATTLE ROYALE #1',
    accentColor: '#3b82f6',
    platforms: ['PC', 'Console', 'Mobile', 'Cloud'],
    keyFeatures: ['100 Jugadores', 'Zero Build', 'Eventos en Vivo', 'Pase de Batalla']
  },
  {
    id: 'valorant',
    title: 'Valorant',
    developer: 'Riot Games',
    rank: 3,
    genre: 'Shooter Táctico 5v5 • Agentes con Habilidades',
    monthlyPlayers: '28M+ Activos',
    tagline: 'Gunplay de máxima precisión y agentes únicos con destrezas tácticas. El estándar contemporáneo de las ligas clasificatorias de esports.',
    badgeText: '🎯 TÁCTICO COMPETITIVO',
    accentColor: '#ef4444',
    platforms: ['PC', 'Consolas Next-Gen'],
    keyFeatures: ['Tickrate 128 Hz', 'Anti-cheat Vanguard', 'Agentes Únicos', 'Ranked VCT']
  },
  {
    id: 'cs2',
    title: 'Counter-Strike 2',
    developer: 'Valve Corporation',
    rank: 4,
    genre: 'FPS Competitivo Clásico • Sub-Tick',
    monthlyPlayers: '31M+ Activos',
    tagline: 'La cúspide del shooter táctico mundial renovado en Source 2. Humos volumétricos reactivos, arquitectura sub-tick y economía de rondas clásica.',
    badgeText: '👑 LEYENDA ESPORTS',
    accentColor: '#f59e0b',
    platforms: ['PC / Steam'],
    keyFeatures: ['Motor Source 2', 'Sub-Tick Precision', 'Humo Dinámico', 'Steam Workshop']
  },
  {
    id: 'apex',
    title: 'Apex Legends',
    developer: 'Respawn Entertainment / EA',
    rank: 5,
    genre: 'Hero Battle Royale • Movimiento Rápido',
    monthlyPlayers: '18M+ Activos',
    tagline: 'Movilidad acrobática, deslizamientos dinámicos y leyendas carismáticas en intensas batallas por escuadrones de 3 jugadores.',
    badgeText: '⚡ ALTA VELOCIDAD',
    accentColor: '#ec4899',
    platforms: ['PC', 'Console', 'Switch'],
    keyFeatures: ['Slide & Jump Mechanics', 'Ultimate Abilities', 'Respawn Beacons', 'Ranked Leagues']
  },
  {
    id: 'warzone',
    title: 'Call of Duty: Warzone',
    developer: 'Activision / Infinity Ward',
    rank: 6,
    genre: 'FPS Militar • Batalla Masiva',
    monthlyPlayers: '50M+ Activos',
    tagline: 'Combate militar a gran escala, enfrentamientos en el Gulag por una segunda oportunidad y personalización táctica en la armería.',
    badgeText: '💥 ACCIÓN MILITAR',
    accentColor: '#8b5cf6',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    keyFeatures: ['Gulag 1v1', 'Personalización Loadouts', 'Vehículos de Combate', 'Mapas Masivos']
  },
  {
    id: 'overwatch2',
    title: 'Overwatch 2',
    developer: 'Blizzard Entertainment',
    rank: 7,
    genre: 'Hero Shooter 5v5 • Trabajo en Equipo',
    monthlyPlayers: '24M+ Activos',
    tagline: 'Enfrentamientos frenéticos con más de 40 héroes divididos en Tanques, Daño y Apoyo compitiendo por carga y puntos de control.',
    badgeText: '🛡️ HERO TEAM ACTION',
    accentColor: '#f97316',
    platforms: ['PC', 'Console', 'Switch'],
    keyFeatures: ['40+ Héroes', 'Sinergia de Escuadrón', 'Modo Push & Flashpoint', 'Temporadas']
  },
  {
    id: 'r6siege',
    title: "Rainbow Six Siege",
    developer: 'Ubisoft Montreal',
    rank: 8,
    genre: 'Táctico Cercano (CQB) • Destrucción',
    monthlyPlayers: '14M+ Activos',
    tagline: 'Asedio táctico de máxima tensión donde cada pared o techo puede ser reforzado o destruido con explosivos y tecnología de asalto.',
    badgeText: '💣 ESTRATEGIA PURA',
    accentColor: '#06b6d4',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    keyFeatures: ['Destrucción Total', 'Operadores SWAT', 'Cámaras y Drones', 'Rápel y Breaching']
  }
]

interface TopGamesProps {
  onExploreCommunity?: () => void
}

export function TopGames({ onExploreCommunity }: TopGamesProps) {
  return (
    <section id="top-games" className="top-games-section">
      <div className="top-games-header">
        <div className="section-badge">
          <Flame size={15} className="section-badge-icon" />
          <span>RANKING MUNDIAL • LOS TÍTULOS MÁS DISPUTADOS</span>
        </div>
        <h2>Juegos Más Jugados de la Comunidad</h2>
        <p>
          Los títulos competitivos, de supervivencia y batallas campales que definen la escena gamer actual. 
          Aquí se concentran las mayores comunidades de jugadores y torneos de <strong>GameHouse</strong>.
        </p>
      </div>

      {/* TOP 1 HIGHLIGHT: MINECRAFT */}
      {TOP_GAMES.filter(g => g.isTopRank).map((game) => (
        <div key={game.id} className="top-one-showcase">
          <div className="top-one-glow" />
          <div className="top-one-content">
            <div className="top-one-header">
              <div className="top-one-badge">
                <Trophy size={16} />
                <span>{game.badgeText}</span>
              </div>
              <span className="top-one-stat">
                <Users size={15} /> {game.monthlyPlayers}
              </span>
            </div>

            <div className="top-one-main">
              <div className="top-one-info">
                <span className="top-one-developer">{game.developer}</span>
                <h3 className="top-one-title">{game.title}</h3>
                <span className="top-one-genre">{game.genre}</span>
                <p className="top-one-description">{game.tagline}</p>
                
                <div className="top-one-features">
                  {game.keyFeatures.map((feat, idx) => (
                    <span key={idx} className="feature-pill">
                      <Sparkles size={12} /> {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="top-one-card-side">
                <div className="podium-rank-display">
                  <span className="podium-number">#1</span>
                  <span className="podium-label">EN EL MUNDO</span>
                </div>
                {onExploreCommunity && (
                  <button className="button button-primary top-one-action" onClick={onExploreCommunity}>
                    <Users size={16} /> Ver Jugadores Registrados
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* GRID DE LOS OTROS TÍTULOS POPULARES */}
      <div className="top-games-grid">
        {TOP_GAMES.filter(g => !g.isTopRank).map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            style={{ '--game-accent': game.accentColor } as React.CSSProperties}
          >
            <div className="game-card-top">
              <span className="game-rank-badge">
                #{game.rank}
              </span>
              <span className="game-tag-badge">
                {game.badgeText}
              </span>
            </div>

            <div className="game-card-body">
              <span className="game-developer">{game.developer}</span>
              <h4 className="game-title">{game.title}</h4>
              <span className="game-genre">{game.genre}</span>
              <p className="game-tagline">{game.tagline}</p>

              <div className="game-stats-row">
                <span className="game-player-count">
                  <Users size={13} /> {game.monthlyPlayers}
                </span>
                <div className="game-platforms">
                  {game.platforms.map((p, i) => (
                    <span key={i} className="platform-tag">{p}</span>
                  ))}
                </div>
              </div>

              <div className="game-features-list">
                {game.keyFeatures.map((feat, i) => (
                  <span key={i} className="game-feat-tag">{feat}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="top-games-footer-cta">
        <div className="cta-text">
          <span className="eyebrow">¿JUEGAS ALGUNO DE ESTOS TÍTULOS?</span>
          <h3>Regístrate en GameHouse y encuentra tu escuadrón</h3>
          <p>Consulta el roster de jugadores activos, filtra por estado y únete a las partidas.</p>
        </div>
        {onExploreCommunity && (
          <button className="button button-primary" onClick={onExploreCommunity}>
            Explorar Roster de Jugadores <Users size={16} />
          </button>
        )}
      </div>
    </section>
  )
}
