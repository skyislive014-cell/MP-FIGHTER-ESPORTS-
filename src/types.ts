export type Language = 'en' | 'hi';

export type UserRole = 'player' | 'admin';

export interface Player {
  id: string;
  ign: string; // In-Game Name e.g. MP_THUNDER
  uid: string; // Free Fire UID e.g. 1849203810
  phone: string;
  email: string;
  avatarSeed: string;
  state: string; // e.g. Madhya Pradesh
  city?: string;
  role: 'Rusher' | 'Sniper' | 'Assaulter' | 'IGL' | 'Support';
  balance: number; // In-app tournament wallet
  totalKills: number;
  tournamentsPlayed: number;
  booyahs: number;
  registeredTournamentIds: string[];
}

export interface DuoMember {
  ign: string;
  uid: string;
  phone: string;
}

export interface DuoTeam {
  id: string;
  tournamentId: string;
  teamName: string;
  player1: DuoMember; // Team Leader
  player2: DuoMember; // Teammate
  slotNumber: number;
  registeredAt: string;
  status: 'confirmed' | 'pending' | 'waitlist';
  transactionId?: string;
}

export type TournamentMap = 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nexterra';

export interface Tournament {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  gameMap: TournamentMap;
  matchType: 'Duo Custom BR' | 'Duo Clash Squad' | 'Duo Survival';
  server: string;
  entryFee: number; // ₹0 for Free, or ₹30, ₹50, ₹100
  prizePool: number; // in ₹
  prizeBreakdown: {
    first: number;
    second: number;
    third: number;
    perKill: number;
  };
  scheduleDate: string; // e.g. "Today, 8:00 PM"
  startTimeIso: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  maxSlots: number; // typically 24 Duos = 48 players
  registeredSlots: number;
  bannerImage: string;
  roomId?: string;
  roomPassword?: string;
  roomStatus: 'locked' | 'unlocked';
  roomReleaseMinutesBefore: number;
  rulesEn: string[];
  rulesHi: string[];
}

export interface PointsTableRow {
  rank: number;
  teamId: string;
  teamName: string;
  players: string[];
  matchesPlayed: number;
  booyahs: number;
  kills: number;
  killPoints: number;
  placementPoints: number;
  totalPoints: number;
}

export interface MatchResultTeam {
  rank: number;
  teamName: string;
  player1: string;
  player2: string;
  kills: number;
  placementPts: number;
  killPts: number;
  totalPts: number;
}

export interface MatchResult {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  map: TournamentMap;
  completedAt: string;
  mvp: {
    ign: string;
    uid: string;
    teamName: string;
    kills: number;
    damage: number;
  };
  teams: MatchResultTeam[];
}

export interface Winner {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  tournamentTitleHi: string;
  date: string;
  map: TournamentMap;
  prizePool: number;
  championTeam: string;
  championPlayers: [string, string];
  championPrize: number;
  runnerUpTeam: string;
  runnerUpPlayers: [string, string];
  runnerUpPrize: number;
  thirdTeam: string;
  thirdPrize: number;
  mvpPlayer: string;
  mvpKills: number;
  trophyImage?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  timestamp: string;
  type: 'room_released' | 'registration_success' | 'match_alert' | 'tournament_created' | 'announcement';
  read: boolean;
  tournamentId?: string;
  roomId?: string;
  roomPassword?: string;
}
