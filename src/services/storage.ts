import { Tournament, DuoTeam, Player, PointsTableRow, MatchResult, Winner, NotificationItem } from '../types';

const STORAGE_KEYS = {
  TOURNAMENTS: 'mp_fighter_tournaments',
  DUO_TEAMS: 'mp_fighter_duo_teams',
  CURRENT_PLAYER: 'mp_fighter_current_player',
  ALL_PLAYERS: 'mp_fighter_players',
  POINTS_TABLE: 'mp_fighter_points',
  MATCH_RESULTS: 'mp_fighter_results',
  WINNERS: 'mp_fighter_winners',
  NOTIFICATIONS: 'mp_fighter_notifications',
  ADMIN_AUTH: 'mp_fighter_admin_auth',
  LANGUAGE: 'mp_fighter_lang',
};

// Initial Seed Tournaments
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'mp-tour-101',
    title: 'MP FIGHTER Pro Duo Cup - Bermuda Clash',
    titleHi: 'एमपी फाइटर प्रो डुओ कप - बरमूडा क्लैश',
    subtitle: 'High octane Battle Royale Duo Championship featuring top MP teams',
    gameMap: 'Bermuda',
    matchType: 'Duo Custom BR',
    server: 'India (MP Region)',
    entryFee: 0, // Free Entry
    prizePool: 2500,
    prizeBreakdown: {
      first: 1500,
      second: 700,
      third: 300,
      perKill: 20,
    },
    scheduleDate: 'Today, 08:30 PM IST',
    startTimeIso: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 mins from now
    status: 'upcoming',
    maxSlots: 24,
    registeredSlots: 21,
    bannerImage: '/src/assets/images/ff_bermuda_arena_1794112327694.jpg',
    roomId: '83920194',
    roomPassword: '778',
    roomStatus: 'unlocked', // Unlocked for demonstration
    roomReleaseMinutesBefore: 15,
    rulesEn: [
      'Both players must register their verified Free Fire UID.',
      'Only Mobile devices allowed. Emulators & PC players are strictly banned.',
      'Hacking, script mods, or teaming up with enemy duos leads to permanent ban.',
      'Room ID & Password will be revealed 15 minutes before match kick-off.',
      'All players must sit strictly in their assigned Slot number.'
    ],
    rulesHi: [
      'दोनों खिलाड़ियों को अपना सत्यापित फ्री फायर यूआईडी दर्ज करना अनिवार्य है।',
      'केवल मोबाइल फोन मान्य हैं। एम्युलेटर और पीसी पूरी तरह प्रतिबंधित हैं।',
      'हैक, स्क्रिप्ट या विरोधी टीम से साठगांठ करने पर स्थायी प्रतिबंध लगेगा।',
      'रूम आईडी और पासवर्ड मैच शुरू होने के 15 मिनट पहले जारी किया जाएगा।',
      'सभी खिलाड़ियों को केवल अपने आवंटित स्लॉट नंबर पर बैठना होगा।'
    ]
  },
  {
    id: 'mp-tour-102',
    title: 'Bhopal FireStorm Duo Showdown - Season 5',
    titleHi: 'भोपाल फायरस्टॉर्म डुओ शोडाउन - सीजन 5',
    subtitle: 'Competitive cash tournament with direct live streaming and kill bounty',
    gameMap: 'Purgatory',
    matchType: 'Duo Custom BR',
    server: 'India (MP Region)',
    entryFee: 50,
    prizePool: 5000,
    prizeBreakdown: {
      first: 2800,
      second: 1400,
      third: 800,
      perKill: 50,
    },
    scheduleDate: 'Tonight, 10:00 PM IST',
    startTimeIso: new Date(Date.now() + 1000 * 60 * 150).toISOString(),
    status: 'upcoming',
    maxSlots: 24,
    registeredSlots: 16,
    bannerImage: '/src/assets/images/hero_esports_banner_1794112327194.jpg',
    roomId: '99201481',
    roomPassword: '942',
    roomStatus: 'locked', // locked
    roomReleaseMinutesBefore: 15,
    rulesEn: [
      'Entry fee of ₹50 per duo must be confirmed before match.',
      'Gun skins attribute OFF for balanced competitive esports play.',
      'Gun drop rates are official tournament standard.',
      'Take match end screenshot for prize claim verification.'
    ],
    rulesHi: [
      'मैच से पहले प्रति डुओ ₹50 प्रवेश शुल्क कन्फर्म होना चाहिए।',
      'निष्पक्ष खेल हेतु गन स्किन एट्रिब्यूट बंद (OFF) रहेंगे।',
      'पुरस्कार सत्यापन के लिए मैच अंत का स्क्रीनशॉट आवश्यक है।'
    ]
  },
  {
    id: 'mp-tour-103',
    title: 'Indore Royale Battleground - Live Duo Finals',
    titleHi: 'इंदौर रॉयल बैटलग्राउंड - लाइव डुओ फाइनल',
    subtitle: 'Grand battle currently in progress on Nexterra with real-time kill feed',
    gameMap: 'Nexterra',
    matchType: 'Duo Custom BR',
    server: 'India (MP Region)',
    entryFee: 100,
    prizePool: 10000,
    prizeBreakdown: {
      first: 6000,
      second: 2500,
      third: 1500,
      perKill: 100,
    },
    scheduleDate: 'Live Ongoing Now',
    startTimeIso: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'ongoing',
    maxSlots: 24,
    registeredSlots: 24,
    bannerImage: '/src/assets/images/hero_esports_banner_1794112327194.jpg',
    roomId: '71049281',
    roomPassword: '556',
    roomStatus: 'unlocked',
    roomReleaseMinutesBefore: 15,
    rulesEn: ['Match in progress. Spectators can follow the live points table update.'],
    rulesHi: ['मैच जारी है। दर्शक लाइव पॉइंट्स टेबल पर स्कोर देख सकते हैं।']
  },
  {
    id: 'mp-tour-104',
    title: 'Kalahari Desert Duo Blitz #12',
    titleHi: 'कालाहारी रेगिस्तान डुओ ब्लिट्ज #12',
    subtitle: 'Sniper and Rusher tactical battle concluded with champion Booyah',
    gameMap: 'Kalahari',
    matchType: 'Duo Custom BR',
    server: 'India (MP Region)',
    entryFee: 0,
    prizePool: 3000,
    prizeBreakdown: {
      first: 1800,
      second: 800,
      third: 400,
      perKill: 30,
    },
    scheduleDate: 'Yesterday, 9:00 PM',
    startTimeIso: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'completed',
    maxSlots: 24,
    registeredSlots: 24,
    bannerImage: '/src/assets/images/ff_bermuda_arena_1794112327694.jpg',
    roomId: '56291044',
    roomPassword: '112',
    roomStatus: 'unlocked',
    roomReleaseMinutesBefore: 15,
    rulesEn: ['Tournament concluded. Results are published below.'],
    rulesHi: ['टूर्नामेंट समाप्त हो चुका है। परिणाम नीचे प्रकाशित हैं।']
  }
];

// Seed Duo Teams
const INITIAL_DUO_TEAMS: DuoTeam[] = [
  {
    id: 'team-01',
    tournamentId: 'mp-tour-101',
    teamName: 'MP THUNDERBOLT',
    player1: { ign: 'MP_THUNDER', uid: '1849203810', phone: '9827104928' },
    player2: { ign: 'MP_SHADOW', uid: '1984729104', phone: '9827104929' },
    slotNumber: 1,
    registeredAt: '2 hours ago',
    status: 'confirmed'
  },
  {
    id: 'team-02',
    tournamentId: 'mp-tour-101',
    teamName: 'BHOPAL SNIPERS',
    player1: { ign: 'BHP_HEADSHOT', uid: '2049182741', phone: '9425019284' },
    player2: { ign: 'BHP_EAGLE', uid: '2049182742', phone: '9425019285' },
    slotNumber: 2,
    registeredAt: '3 hours ago',
    status: 'confirmed'
  },
  {
    id: 'team-03',
    tournamentId: 'mp-tour-101',
    teamName: 'INDORE RUSHERS',
    player1: { ign: 'IND_RAAVAN', uid: '3049182751', phone: '9752019482' },
    player2: { ign: 'IND_MAHAKAAL', uid: '3049182752', phone: '9752019483' },
    slotNumber: 3,
    registeredAt: '1 hour ago',
    status: 'confirmed'
  },
  {
    id: 'team-04',
    tournamentId: 'mp-tour-101',
    teamName: 'JABALPUR GHOSTS',
    player1: { ign: 'JBP_SPECTRE', uid: '4019283741', phone: '9179283741' },
    player2: { ign: 'JBP_WRAITH', uid: '4019283742', phone: '9179283742' },
    slotNumber: 4,
    registeredAt: '30 mins ago',
    status: 'confirmed'
  },
  {
    id: 'team-05',
    tournamentId: 'mp-tour-101',
    teamName: 'GWALIOR TIGERS',
    player1: { ign: 'GWL_BAGHIRA', uid: '5019283741', phone: '9893019284' },
    player2: { ign: 'GWL_SHER', uid: '5019283742', phone: '9893019285' },
    slotNumber: 5,
    registeredAt: '45 mins ago',
    status: 'confirmed'
  },
  {
    id: 'team-06',
    tournamentId: 'mp-tour-101',
    teamName: 'UJJAIN MAHAKAAL DUO',
    player1: { ign: 'UJJ_TRISHUL', uid: '6019283741', phone: '9406019284' },
    player2: { ign: 'UJJ_DAMRU', uid: '6019283742', phone: '9406019285' },
    slotNumber: 6,
    registeredAt: '15 mins ago',
    status: 'confirmed'
  }
];

// Seed Player Profile (Default Logged-in demo player)
const DEFAULT_PLAYER: Player = {
  id: 'player-default',
  ign: 'MP_THUNDER',
  uid: '1849203810',
  phone: '9827104928',
  email: 'mp_thunder@fighter.in',
  avatarSeed: 'mp_warrior',
  state: 'Madhya Pradesh',
  city: 'Bhopal',
  role: 'Rusher',
  balance: 350,
  totalKills: 84,
  tournamentsPlayed: 14,
  booyahs: 6,
  registeredTournamentIds: ['mp-tour-101', 'mp-tour-103']
};

// Seed Points Table (Official Free Fire scoring)
const INITIAL_POINTS_TABLE: PointsTableRow[] = [
  {
    rank: 1,
    teamId: 'team-01',
    teamName: 'MP THUNDERBOLT',
    players: ['MP_THUNDER', 'MP_SHADOW'],
    matchesPlayed: 4,
    booyahs: 2,
    kills: 22,
    killPoints: 22,
    placementPoints: 33,
    totalPoints: 55,
  },
  {
    rank: 2,
    teamId: 'team-03',
    teamName: 'INDORE RUSHERS',
    players: ['IND_RAAVAN', 'IND_MAHAKAAL'],
    matchesPlayed: 4,
    booyahs: 1,
    kills: 26,
    killPoints: 26,
    placementPoints: 25,
    totalPoints: 51,
  },
  {
    rank: 3,
    teamId: 'team-02',
    teamName: 'BHOPAL SNIPERS',
    players: ['BHP_HEADSHOT', 'BHP_EAGLE'],
    matchesPlayed: 4,
    booyahs: 1,
    kills: 18,
    killPoints: 18,
    placementPoints: 26,
    totalPoints: 44,
  },
  {
    rank: 4,
    teamId: 'team-05',
    teamName: 'GWALIOR TIGERS',
    players: ['GWL_BAGHIRA', 'GWL_SHER'],
    matchesPlayed: 4,
    booyahs: 0,
    kills: 17,
    killPoints: 17,
    placementPoints: 21,
    totalPoints: 38,
  },
  {
    rank: 5,
    teamId: 'team-04',
    teamName: 'JABALPUR GHOSTS',
    players: ['JBP_SPECTRE', 'JBP_WRAITH'],
    matchesPlayed: 4,
    booyahs: 0,
    kills: 14,
    killPoints: 14,
    placementPoints: 19,
    totalPoints: 33,
  },
  {
    rank: 6,
    teamId: 'team-06',
    teamName: 'UJJAIN MAHAKAAL DUO',
    players: ['UJJ_TRISHUL', 'UJJ_DAMRU'],
    matchesPlayed: 4,
    booyahs: 0,
    kills: 11,
    killPoints: 11,
    placementPoints: 16,
    totalPoints: 27,
  },
  {
    rank: 7,
    teamId: 'team-07',
    teamName: 'REWA PANTHERS',
    players: ['REW_VIPER', 'REW_STORM'],
    matchesPlayed: 4,
    booyahs: 0,
    kills: 10,
    killPoints: 10,
    placementPoints: 14,
    totalPoints: 24,
  },
  {
    rank: 8,
    teamId: 'team-08',
    teamName: 'SAGAR WARRIORS',
    players: ['SGR_SNIPEX', 'SGR_BLAZE'],
    matchesPlayed: 4,
    booyahs: 0,
    kills: 8,
    killPoints: 8,
    placementPoints: 10,
    totalPoints: 18,
  }
];

// Seed Winners List
const INITIAL_WINNERS: Winner[] = [
  {
    id: 'win-01',
    tournamentId: 'mp-tour-104',
    tournamentTitle: 'Kalahari Desert Duo Blitz #12',
    tournamentTitleHi: 'कालाहारी रेगिस्तान डुओ ब्लिट्ज #12',
    date: 'Yesterday, 07 Nov',
    map: 'Kalahari',
    prizePool: 3000,
    championTeam: 'MP THUNDERBOLT',
    championPlayers: ['MP_THUNDER', 'MP_SHADOW'],
    championPrize: 1800,
    runnerUpTeam: 'INDORE RUSHERS',
    runnerUpPlayers: ['IND_RAAVAN', 'IND_MAHAKAAL'],
    runnerUpPrize: 800,
    thirdTeam: 'BHOPAL SNIPERS',
    thirdPrize: 400,
    mvpPlayer: 'MP_THUNDER',
    mvpKills: 9,
    trophyImage: '/src/assets/images/esports_champion_trophy_1794112327479.jpg'
  },
  {
    id: 'win-02',
    tournamentId: 'mp-tour-099',
    tournamentTitle: 'MP Diwali Special Grand Duo Cup',
    tournamentTitleHi: 'एमपी दिवाली स्पेशल ग्रैंड डुओ कप',
    date: '02 Nov 2026',
    map: 'Bermuda',
    prizePool: 15000,
    championTeam: 'BHOPAL SNIPERS',
    championPlayers: ['BHP_HEADSHOT', 'BHP_EAGLE'],
    championPrize: 9000,
    runnerUpTeam: 'GWALIOR TIGERS',
    runnerUpPlayers: ['GWL_BAGHIRA', 'GWL_SHER'],
    runnerUpPrize: 4000,
    thirdTeam: 'MP THUNDERBOLT',
    thirdPrize: 2000,
    mvpPlayer: 'BHP_HEADSHOT',
    mvpKills: 14,
    trophyImage: '/src/assets/images/esports_champion_trophy_1794112327479.jpg'
  }
];

// Seed Match Results
const INITIAL_MATCH_RESULTS: MatchResult[] = [
  {
    id: 'res-104',
    tournamentId: 'mp-tour-104',
    tournamentTitle: 'Kalahari Desert Duo Blitz #12 - Final Round',
    map: 'Kalahari',
    completedAt: 'Yesterday at 9:45 PM',
    mvp: {
      ign: 'MP_THUNDER',
      uid: '1849203810',
      teamName: 'MP THUNDERBOLT',
      kills: 9,
      damage: 2450
    },
    teams: [
      { rank: 1, teamName: 'MP THUNDERBOLT', player1: 'MP_THUNDER', player2: 'MP_SHADOW', kills: 11, placementPts: 12, killPts: 11, totalPts: 23 },
      { rank: 2, teamName: 'INDORE RUSHERS', player1: 'IND_RAAVAN', player2: 'IND_MAHAKAAL', kills: 8, placementPts: 9, killPts: 8, totalPts: 17 },
      { rank: 3, teamName: 'BHOPAL SNIPERS', player1: 'BHP_HEADSHOT', player2: 'BHP_EAGLE', kills: 6, placementPts: 8, killPts: 6, totalPts: 14 },
      { rank: 4, teamName: 'GWALIOR TIGERS', player1: 'GWL_BAGHIRA', player2: 'GWL_SHER', kills: 5, placementPts: 7, killPts: 5, totalPts: 12 },
      { rank: 5, teamName: 'JABALPUR GHOSTS', player1: 'JBP_SPECTRE', player2: 'JBP_WRAITH', kills: 4, placementPts: 6, killPts: 4, totalPts: 10 },
      { rank: 6, teamName: 'UJJAIN MAHAKAAL DUO', player1: 'UJJ_TRISHUL', player2: 'UJJ_DAMRU', kills: 2, placementPts: 5, killPts: 2, totalPts: 7 },
      { rank: 7, teamName: 'REWA PANTHERS', player1: 'REW_VIPER', player2: 'REW_STORM', kills: 3, placementPts: 4, killPts: 3, totalPts: 7 },
      { rank: 8, teamName: 'SAGAR WARRIORS', player1: 'SGR_SNIPEX', player2: 'SGR_BLAZE', kills: 1, placementPts: 3, killPts: 1, totalPts: 4 },
      { rank: 9, teamName: 'SATNA STRIKERS', player1: 'STN_DEVIL', player2: 'STN_VIPER', kills: 2, placementPts: 2, killPts: 2, totalPts: 4 },
      { rank: 10, teamName: 'RATLAM TITANS', player1: 'RTL_COMMANDO', player2: 'RTL_ACE', kills: 1, placementPts: 1, killPts: 1, totalPts: 2 },
    ]
  }
];

// Seed Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Room ID & Password Released!',
    titleHi: 'रूम आईडी और पासवर्ड जारी किया गया!',
    message: 'Custom Room for "MP FIGHTER Pro Duo Cup" is now OPEN. Room ID: 83920194 | Pass: 778. Join within 10 minutes!',
    messageHi: '"एमपी फाइटर प्रो डुओ कप" का कस्टम रूम अब खुला है। रूम आईडी: 83920194 | पासवर्ड: 778। 10 मिनट के भीतर जुड़ें!',
    timestamp: '5 mins ago',
    type: 'room_released',
    read: false,
    tournamentId: 'mp-tour-101',
    roomId: '83920194',
    roomPassword: '778'
  },
  {
    id: 'notif-02',
    title: 'Duo Registration Confirmed',
    titleHi: 'डुओ पंजीकरण की पुष्टि हुई',
    message: 'Your team "MP THUNDERBOLT" has been allotted Slot #1 for Bermuda Clash.',
    messageHi: 'आपकी टीम "MP THUNDERBOLT" को बरमूडा क्लैश के लिए स्लॉट #1 आवंटित किया गया है।',
    timestamp: '1 hour ago',
    type: 'registration_success',
    read: false,
    tournamentId: 'mp-tour-101'
  },
  {
    id: 'notif-03',
    title: 'Fair Play & Anti-Hack Notice',
    titleHi: 'फेयर प्ले और एंटी-हैक निर्देश',
    message: 'Only registered Free Fire mobile players allowed. Emulators will be kicked out automatically by room referee.',
    messageHi: 'केवल पंजीकृत फ्री फायर मोबाइल खिलाड़ी ही मान्य हैं। एम्युलेटर खिलाड़ियों को रूम रेफरी तुरंत निष्कासित कर देगा।',
    timestamp: '3 hours ago',
    type: 'announcement',
    read: true
  }
];

export class StorageService {
  // Tournaments
  static getTournaments(): Tournament[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(INITIAL_TOURNAMENTS));
      return INITIAL_TOURNAMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TOURNAMENTS;
    }
  }

  static saveTournaments(tournaments: Tournament[]): void {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  }

  static updateTournament(updated: Tournament): void {
    const list = this.getTournaments().map(t => t.id === updated.id ? updated : t);
    this.saveTournaments(list);
  }

  static createTournament(tournament: Tournament): void {
    const list = [tournament, ...this.getTournaments()];
    this.saveTournaments(list);
  }

  static deleteTournament(id: string): void {
    const list = this.getTournaments().filter(t => t.id !== id);
    this.saveTournaments(list);
  }

  // Duo Teams
  static getDuoTeams(): DuoTeam[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DUO_TEAMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DUO_TEAMS, JSON.stringify(INITIAL_DUO_TEAMS));
      return INITIAL_DUO_TEAMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DUO_TEAMS;
    }
  }

  static saveDuoTeams(teams: DuoTeam[]): void {
    localStorage.setItem(STORAGE_KEYS.DUO_TEAMS, JSON.stringify(teams));
  }

  static registerDuoTeam(team: DuoTeam): void {
    const teams = this.getDuoTeams();
    teams.push(team);
    this.saveDuoTeams(teams);

    // Increment registered slots on tournament
    const tournaments = this.getTournaments().map(t => {
      if (t.id === team.tournamentId) {
        return { ...t, registeredSlots: Math.min(t.maxSlots, t.registeredSlots + 1) };
      }
      return t;
    });
    this.saveTournaments(tournaments);

    // Update current player registered tournaments
    const player = this.getCurrentPlayer();
    if (player && !player.registeredTournamentIds.includes(team.tournamentId)) {
      player.registeredTournamentIds.push(team.tournamentId);
      this.saveCurrentPlayer(player);
    }
  }

  // Current Player
  static getCurrentPlayer(): Player | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, JSON.stringify(DEFAULT_PLAYER));
      return DEFAULT_PLAYER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PLAYER;
    }
  }

  static saveCurrentPlayer(player: Player | null): void {
    if (player) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, JSON.stringify(player));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
    }
  }

  // Points Table
  static getPointsTable(): PointsTableRow[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POINTS_TABLE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POINTS_TABLE, JSON.stringify(INITIAL_POINTS_TABLE));
      return INITIAL_POINTS_TABLE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_POINTS_TABLE;
    }
  }

  static savePointsTable(table: PointsTableRow[]): void {
    // Sort automatically by totalPoints descending, then kills descending
    const sorted = [...table].sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return b.kills - a.kills;
    }).map((row, idx) => ({ ...row, rank: idx + 1 }));
    localStorage.setItem(STORAGE_KEYS.POINTS_TABLE, JSON.stringify(sorted));
  }

  // Winners
  static getWinners(): Winner[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WINNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(INITIAL_WINNERS));
      return INITIAL_WINNERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_WINNERS;
    }
  }

  static saveWinners(winners: Winner[]): void {
    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
  }

  // Match Results
  static getMatchResults(): MatchResult[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCH_RESULTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MATCH_RESULTS, JSON.stringify(INITIAL_MATCH_RESULTS));
      return INITIAL_MATCH_RESULTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MATCH_RESULTS;
    }
  }

  static saveMatchResults(results: MatchResult[]): void {
    localStorage.setItem(STORAGE_KEYS.MATCH_RESULTS, JSON.stringify(results));
  }

  // Notifications
  static getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static saveNotifications(notifications: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  static addNotification(item: NotificationItem): void {
    const list = [item, ...this.getNotifications()];
    this.saveNotifications(list);
  }

  static markAllNotificationsRead(): void {
    const updated = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
  }

  // Admin Auth
  static isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }

  static setAdminLoggedIn(status: boolean): void {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  }

  // Language
  static getLanguage(): 'en' | 'hi' {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return lang === 'hi' ? 'hi' : 'en';
  }

  static setLanguage(lang: 'en' | 'hi'): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  // Reset to sample defaults if desired
  static resetData(): void {
    localStorage.removeItem(STORAGE_KEYS.TOURNAMENTS);
    localStorage.removeItem(STORAGE_KEYS.DUO_TEAMS);
    localStorage.removeItem(STORAGE_KEYS.POINTS_TABLE);
    localStorage.removeItem(STORAGE_KEYS.WINNERS);
    localStorage.removeItem(STORAGE_KEYS.MATCH_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  }
}
