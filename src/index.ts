// Neon Cipher VR — Word Deduction Puzzle (Wordle-style)
// Build #56 — First word-puzzle genre in the portfolio
// Round 3: 9 modes (zen), 100 achievements, 10 themes, remaining words tracker, per-mode stats

import {
  World,
  createSystem,
  PanelUI,
  PanelDocument,
  UIKitDocument,
  UIKit,
  Follower,
  ScreenSpace,
  eq,
  Entity,
  InputComponent,
} from '@iwsdk/core';
import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  GridHelper,
  Color,
  PointLight,
  AmbientLight,
  DirectionalLight,
  FogExp2,
  SphereGeometry,
  TorusGeometry,
  ConeGeometry,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  AdditiveBlending,
  Vector3,
  Group,
  OctahedronGeometry,
  IcosahedronGeometry,
  CylinderGeometry,
} from '@iwsdk/core';

// --- WORD LISTS ---
const ANSWERS = [
  'ABOUT','ABOVE','ABUSE','ACTOR','ADAPT','ADMIT','ADOPT','ADULT','AFTER','AGAIN',
  'AGENT','AGREE','AHEAD','ALARM','ALBUM','ALERT','ALIEN','ALIGN','ALIVE','ALLOW',
  'ALONE','ALONG','ALTER','AMAZE','AMONG','ANGEL','ANGER','ANGLE','ANGRY','ANKLE',
  'APART','APPLE','APPLY','ARENA','ARGUE','ARISE','ARMOR','ASIDE','ATTIC','AVOID',
  'AWARD','AWARE','BADGE','BASIC','BEACH','BEGIN','BEING','BELOW','BENCH','BLACK',
  'BLADE','BLAME','BLANK','BLAST','BLAZE','BLEED','BLEND','BLESS','BLIND','BLOCK',
  'BLOOD','BLOOM','BLOWN','BOARD','BOOST','BOUND','BRAIN','BRAND','BRAVE','BREAD',
  'BREAK','BREED','BRICK','BRIEF','BRING','BROAD','BROWN','BRUSH','BUILD','BUNCH',
  'BURST','BUYER','CABIN','CANDY','CARGO','CARRY','CATCH','CAUSE','CHAIN','CHAIR',
  'CHARM','CHART','CHASE','CHEAP','CHECK','CHEEK','CHEER','CHESS','CHEST','CHIEF',
  'CHILD','CHINA','CHUNK','CLAIM','CLASS','CLEAN','CLEAR','CLIMB','CLING','CLOCK',
  'CLOSE','CLOTH','CLOUD','COACH','COAST','COLOR','CORAL','COUNT','COURT','COVER',
  'CRACK','CRAFT','CRANE','CRASH','CRAZY','CREAM','CRIME','CROSS','CROWD','CRUEL',
  'CRUSH','CURVE','CYCLE','DANCE','DEATH','DEBUT','DELAY','DEMON','DEPTH','DEVIL',
  'DIARY','DIRTY','DONOR','DOUBT','DOUGH','DRAFT','DRAIN','DRAMA','DRAWN','DREAM',
  'DRESS','DRIFT','DRILL','DRINK','DRIVE','EAGER','EARLY','EARTH','EIGHT','ELECT',
  'ELITE','EMPTY','ENEMY','ENJOY','ENTER','EQUAL','ERROR','EVENT','EVERY','EXACT',
  'EXTRA','FAINT','FAITH','FALSE','FANCY','FAULT','FEAST','FENCE','FEWER','FIBER',
  'FIELD','FIFTH','FIFTY','FIGHT','FINAL','FIRST','FIXED','FLAME','FLASH','FLESH',
  'FLOAT','FLOOD','FLOOR','FLOUR','FLUID','FOCUS','FORCE','FORGE','FORTH','FORUM',
  'FOUND','FRAME','FRAUD','FRESH','FRONT','FROST','FRUIT','FUNNY','GHOST','GIANT',
  'GIVEN','GLARE','GLASS','GLEAM','GLIDE','GLOBE','GLORY','GRACE','GRADE','GRAIN',
  'GRAND','GRANT','GRAPE','GRASP','GRASS','GRAVE','GREAT','GREEN','GREET','GRIEF',
  'GRIND','GROSS','GROUP','GROWN','GUARD','GUESS','GUEST','GUIDE','GUILT','HABIT',
  'HAPPY','HARSH','HAVEN','HEART','HEAVY','HENCE','HONEY','HONOR','HORSE','HOTEL',
  'HOUSE','HUMAN','HUMOR','HURRY','IDEAL','IMAGE','IMPLY','INDEX','INNER','INPUT',
  'IRONY','IVORY','JEWEL','JOINT','JUDGE','JUICE','KARMA','KNOWN','LABEL','LABOR',
  'LARGE','LASER','LATER','LAUGH','LAYER','LEARN','LEASE','LEAST','LEAVE','LEGAL',
  'LEVEL','LIGHT','LIMIT','LINEN','LIVER','LOCAL','LOGIC','LOOSE','LOVER','LOWER',
  'LOYAL','LUCKY','LUNAR','LUNCH','MAGIC','MAJOR','MAKER','MANOR','MAPLE','MARCH',
  'MATCH','MAYOR','MEDIA','MERCY','MERGE','MERIT','METAL','MIGHT','MINOR','MINUS',
  'MODEL','MONEY','MONTH','MORAL','MOTOR','MOUNT','MOUSE','MOUTH','MOVIE','MUSIC',
  'NAIVE','NERVE','NEVER','NIGHT','NOBLE','NOISE','NORTH','NOTED','NOVEL','NURSE',
  'OCCUR','OCEAN','OLIVE','ONSET','OPERA','ORBIT','ORDER','OTHER','OUTER','OWNER',
  'PAINT','PANEL','PANIC','PARTY','PASTE','PATCH','PAUSE','PEACE','PEACH','PEARL',
  'PHASE','PHONE','PHOTO','PIANO','PIECE','PILOT','PITCH','PIXEL','PIZZA','PLACE',
  'PLAIN','PLANE','PLANT','PLATE','PLAZA','PLEAD','POINT','POLAR','POUND','POWER',
  'PRESS','PRICE','PRIDE','PRIME','PRINT','PRIOR','PRIZE','PROOF','PROUD','PROVE',
  'QUEEN','QUERY','QUEST','QUICK','QUIET','QUOTE','RADAR','RADIO','RAISE','RALLY',
  'RANCH','RANGE','RAPID','RATIO','REACH','READY','REALM','REBEL','REIGN','RENEW',
];
const EXTRA_VALID = [
  'ABACK','ABIDE','ABORT','ACIDS','ACORN','ACRES','ACTED','ADMIN','ADORE','AEGIS',
  'AIDED','AIMED','AIRED','AISLE','ALIEN','ALPHA','AMBER','AMPLE','ANGEL','ANTIC',
  'AROSE','ARROW','ASHES','ASKED','ASSET','ATLAS','AUDIT','AZURE','BACON','BADLY',
  'BAKER','BANDS','BANKS','BARON','BASES','BASIN','BASIS','BATCH','BATON','BEANS',
  'BEARS','BEGUN','BIKES','BILLS','BIRDS','BIRTH','BLADE','BLANK','BLISS','BLOWN',
  'BLUES','BLUFF','BOATS','BONDS','BONES','BOOKS','BOOTS','BOUND','BRACE','BRAND',
  'BRASS','BRIDE','BRIEF','BRINK','BROIL','BROOK','BRUNT','BULGE','BULLS','BURNT',
  'BYTES','CABLE','CALLS','CAMPS','CANAL','CANES','CARDS','CASES','CEDAR','CELLS',
  'CENTS','CHANT','CHAOS','CHEAT','CHOSE','CIDER','CITED','CIVIC','CLAMP','CLAPS',
  'CLASH','CLASP','CLICK','CLIFF','CLIPS','CLONE','CLUBS','CLUES','COALS','CODED',
  'COILS','COINS','COMIC','CORAL','CORDS','CORES','COSTS','COUCH','COUGH','COULD',
  'COUPE','CRAMP','CRAZE','CREWS','CRISP','CROPS','CRUDE','CUBES','CURLS','CURSE',
  'DAILY','DAIRY','DARTS','DATES','DEALS','DEALT','DECAY','DECOR','DEEDS','DELTA',
  'DENSE','DEPOT','DERBY','DETER','DICES','DIMLY','DINER','DISCO','DISKS','DITCH',
  'DIVER','DOING','DOSES','DOWDY','DOZED','DRAGS','DRAWS','DRIED','DROPS','DRUMS',
  'DRYLY','DUCAL','DUCKS','DULLS','DUNCE','DUNES','DUNKS','DUSTY','DWARF','DWELL',
  'DYING','EAGLE','EARNS','EASED','EATEN','EAVES','EDGED','EDGES','EIGHT','ELBOW',
  'ELDER','ELFIN','ELVES','EMBER','EMOJI','ENDED','ENTRY','ENVOY','EPOCH','EQUIP',
  'ERASE','ESSAY','EVADE','EXALT','EXILE','EXTRA','FABLE','FACES','FACTS','FADED',
  'FAILS','FAIRY','FALLS','FAMED','FANGS','FARMS','FATAL','FAVOR','FAWNS','FEARS',
  'FEEDS','FEELS','FETCH','FEVER','FIBER','FILED','FILLS','FILMS','FINDS','FINER',
  'FIRES','FIRMS','FIXED','FLAGS','FLAKE','FLANK','FLAPS','FLARE','FLASK','FLEET',
  'FLIES','FLING','FLINT','FLIPS','FLIRT','FLOCK','FLOSS','FLOUR','FLOWS','FLUFF',
  'FLUKE','FLUNG','FLUSH','FOCAL','FOGGY','FOLDS','FOLLY','FONTS','FOODS','FOOLS',
  'FORGE','FORMS','FORTY','FOYER','FRAIL','FRAME','FREED','FRESH','FRIED','FRIES',
  'FROGS','FROZE','FULLY','FUNDS','FUNGI','FUZZY','GAINS','GASES','GAUGE','GAZES',
  'GEARS','GENRE','GHOST','GIFTS','GIRLS','GIVEN','GIVES','GLAZE','GLOOM','GLOSS',
  'GLOVE','GOALS','GOATS','GOING','GOLDS','GONER','GOODS','GOOSE','GORGE','GOWNS',
  'GRABS','GRAIN','GRAMS','GRASP','GRATE','GRAYS','GREED','GRIDS','GRILL','GRINS',
  'GRIPS','GROOM','GROVE','GROWS','GRUEL','GUARD','GULCH','GULLS','GUMMY','GUSTS',
  'HALLS','HALVE','HANDS','HANDY','HANGS','HARSH','HASTE','HATCH','HATED','HAUNT',
  'HEADS','HEALS','HEAPS','HEARD','HEATS','HEDGE','HEELS','HEFTY','HEIRS','HERBS',
  'HERDS','HILLS','HILLY','HINGE','HINTS','HIRED','HITCH','HOIST','HOLDS','HOLES',
  'HOMES','HOOKS','HOPED','HOPES','HORNS','HOSTS','HOUND','HOURS','HOWLS','HUNKS',
  'HUNTS','HUSKY','ICING','IDEAS','IDLES','IDOLS','IGLOO','INEPT','INFER','INFRA',
  'INGOT','INKED','INLAY','INLET','INTRO','IRATE','ISLES','IVORY','JACKS','JAILS',
  'JAUNT','JEANS','JELLY','JERKS','JOINS','JOKER','JOLLY','JOUST','JUICE','JUMBO',
  'JUMPS','JUROR','KAYAK','KEELS','KEEPS','KICKS','KILLS','KINDS','KINGS','KITES',
  'KNACK','KNEEL','KNIFE','KNOBS','KNOTS','KNOWS','LABEL','LACED','LACKS','LADEN',
  'LAKES','LAMPS','LANCE','LANDS','LANES','LAPSE','LARKS','LATCH','LEADS','LEAFY',
  'LEAKS','LEAPS','LEGIT','LEMON','LENDS','LIFTS','LIKED','LIMBS','LINED','LINER',
  'LINES','LINKS','LISTS','LIVED','LIVES','LOADS','LOANS','LOBBY','LOCKS','LODGE',
  'LOFTY','LOOKS','LOOPS','LORDS','LOSES','LOVED','LURED','LYING','LYMPH','MACHO',
  'MAFIA','MAILS','MAINS','MAKES','MANGA','MANIA','MANOR','MARKS','MARSH','MASKS',
  'MASON','MEANT','MEATS','MELEE','MELON','MENDS','MENUS','MERRY','MIDST','MILLS',
  'MIMIC','MINDS','MINED','MINER','MINES','MINOR','MINTS','MISTY','MIXED','MIXER',
  'MOATS','MOCKS','MODES','MOIST','MOLDS','MONKS','MOODS','MOONS','MOOSE','MORPH',
  'MOSSY','MOTHS','MOTTO','MOUND','MOVED','MOVES','MULCH','MURAL','MUSED','MYTHS',
  'NAILS','NAMED','NAMES','NANNY','NECKS','NEEDS','NESTS','NEWER','NEWLY','NICHE',
  'NINJA','NIFTY','NODES','NORMS','NOSES','NOTCH','NOTES','OAKEN','OASIS','OATHS',
  'OFFER','OFTEN','OILED','OLDER','OMITS','OPENS','OPTED','OPTIC','ORCAS','ORGAN',
  'OUGHT','OUNCE','OUTED','OUTDO','OVALS','OVENS','OVERT','OWING','OXIDE','OZONE',
  'PACED','PACES','PACKS','PADRE','PAGED','PAGES','PAILS','PAINS','PAIRS','PALMS',
  'PANDA','PANTS','PAPAL','PAPER','PARKS','PARTS','PATIO','PAVED','PAWED','PEAKS',
  'PEARS','PEEKS','PEELS','PEERS','PELTS','PENCE','PENNY','PERCH','PERKS','PESTO',
  'PICKS','PIETY','PILED','PILES','PILLS','PILOT','PINCH','PINES','PIPES','PIVOT',
  'PLANK','PLANS','PLEAS','PLIED','PLIES','PLOTS','PLUCK','PLUGS','PLUMB','PLUME',
  'PLUMP','PLUMS','PLUSH','POISE','POKED','POKER','POLAR','POLES','POLLS','PONDS',
  'POOLS','PORCH','PORED','PORES','PORTS','POSED','POSES','POSTS','POUCH','POURS',
  'PRAWN','PRAYS','PRESS','PRICK','PRIED','PRIES','PRISM','PRIVY','PROBE','PRODS',
  'PROMS','PRONE','PROPS','PROSE','PROXY','PRUDE','PRUNE','PSALM','PULLS','PULPS',
  'PULSE','PUMPS','PUNCH','PURGE','PURSE','PUSHY','QUACK','QUALM','QUART','QUASI',
  'QUAYS','QUELL','QUILT','QUIRK','QUOTA','RACES','RACKS','RADAR','RAFTS','RAIDS',
  'RAILS','RAINS','RAINY','RAKED','RAMPS','RANKS','RATED','RATES','RAVEN','RAZOR',
  'READS','REAPS','REIGN','REINS','RELAY','RELIC','REMIT','RENAL','RENDS','REPAY',
  'REPEL','REPLY','RERUN','RESET','RESIN','RESTS','RETRY','RIDGE','RIDES','RIFLE',
  'RIGID','RINDS','RINGS','RINSE','RIOTS','RISEN','RISES','RISKS','RISKY','RITES',
  'ROADS','ROARS','ROAST','ROBES','ROCKS','ROCKY','ROGUE','ROLES','ROLLS','ROMAN',
  'ROOFS','ROOMS','ROOTS','ROPED','ROPES','ROSES','ROUGH','RULED','RULER','RULES',
  'RUINS','RUMMY','RUMOR','RURAL','SACKS','SAINT','SALES','SALON','SALTS','SALTY',
  'SANDS','SANDY','SATIN','SAUCE','SAVED','SAVES','SCALE','SCALP','SCAMS','SCANS',
  'SCARE','SCARF','SCARS','SCARY','SCENE','SCENT','SHADE','SHAFT','SHALL','SHAME',
  'SHANK','SHAPE','SHARD','SHARE','SHARK','SHARP','SHAWL','SHEDS','SHEEN','SHEEP',
  'SHEER','SHEET','SHELF','SHELL','SHIFT','SHINE','SHINY','SHIRE','SHIRT','SHOCK',
  'SHOES','SHOOK','SHOOT','SHOPS','SHORE','SHORT','SHOUT','SHOVE','SHOWN','SHOWS',
  'SHRED','SHRUB','SHRUG','SHUTS','SIDED','SIDES','SIEGE','SIGHS','SIGHT','SIGNS',
  'SILKS','SILKY','SILLY','SINCE','SIREN','SITES','SIZED','SIZES','SKATE','SKILL',
  'SKIMS','SKINS','SKIPS','SKIRT','SKULL','SLABS','SLACK','SLAIN','SLAMS','SLANG',
  'SLANT','SLAPS','SLASH','SLATE','SLEEK','SLICK','SLIDE','SLIME','SLIMY','SLING',
  'SLINK','SLIPS','SLOPE','SLOTS','SLUGS','SLUMP','SLUNG','SMACK','SMALL','SMART',
  'SMASH','SMELL','SMILE','SMITH','SMOCK','SMOKE','SNACK','SNAIL','SNAKE','SNAPS',
  'SNARE','SNEAK','SNIFF','SNOBS','SNORE','SNOUT','SOLAR','SOILS','SOLID','SOLVE',
  'SONGS','SORRY','SORTS','SOULS','SOUTH','SOWED','SPACE','SPADE','SPANS','SPARE',
  'SPARK','SPAWN','SPEAR','SPECS','SPEED','SPELL','SPEND','SPENT','SPICE','SPICY',
  'SPIED','SPIES','SPILL','SPINE','SPOKE','SPOON','SPORE','SPORT','SPOTS','SPRAY',
  'SPREE','SPRIG','SQUAD','SQUID','STACK','STAFF','STAGE','STAIN','STAIR','STAKE',
  'STALE','STALL','STAMP','STAND','STANK','STARE','STARK','STARS','START','STASH',
  'STATE','STAYS','STEAK','STEAL','STEAM','STEEL','STEEP','STEER','STEMS','STEPS',
  'STERN','STEWS','STICK','STIFF','STILL','STING','STINK','STIRS','STOCK','STOLE',
  'STOMP','STONE','STOOD','STOOL','STOOP','STORE','STORK','STORM','STORY','STOUT',
  'STOVE','STRAW','STRAY','STRIP','STRUT','STUCK','STUDY','STUFF','STUMP','STUNG',
  'STUNK','STUNT','SUGAR','SUITE','SUITS','SUNNY','SUPER','SURGE','SUSHI','SWAMP',
  'SWANS','SWAPS','SWARM','SWEAR','SWEAT','SWEEP','SWEET','SWEPT','SWIFT','SWIMS',
  'SWINE','SWING','SWIRL','SWORE','SWORN','SWUNG','SYRUP','TABLE','TACKS','TAILS',
  'TAKEN','TALES','TALKS','TAMED','TANKS','TAPED','TAPES','TASKS','TASTE','TAXES',
  'TEACH','TEAMS','TEARS','TEETH','TEMPO','TENDS','TENSE','TERMS','TESTS','THEME',
  'THERE','THICK','THIEF','THIGH','THING','THINK','THIRD','THORN','THREE','THREW',
  'THROW','THUGS','THUMB','TIDAL','TIDES','TIERS','TIGER','TIGHT','TILES','TILTS',
  'TIMER','TIMES','TIMID','TIRED','TITLE','TOAST','TODAY','TOKEN','TOMBS','TONED',
  'TONES','TOOLS','TOPIC','TORCH','TOTAL','TOUCH','TOUGH','TOURS','TOWEL','TOWER',
  'TOWNS','TOXIC','TRACE','TRACK','TRADE','TRAIL','TRAIN','TRAIT','TRAMP','TRANS',
  'TRAPS','TRASH','TRAWL','TREAT','TREES','TREND','TRIAL','TRIBE','TRICK','TRIED',
  'TRIES','TRIMS','TRIPS','TRITE','TROLL','TROOP','TROUT','TRUCE','TRUCK','TRULY',
  'TRUMP','TRUNK','TRUST','TRUTH','TUBES','TUCKS','TULIP','TUMOR','TUNED','TUNES',
  'TURNS','TUTOR','TWANG','TWEED','TWICE','TWIGS','TWINE','TWINS','TWIRL','TWIST',
  'TYPED','TYPES','UDDER','ULCER','ULTRA','UNCUT','UNDER','UNDID','UNDUE','UNFED',
  'UNFIT','UNIFY','UNION','UNITE','UNITY','UNLIT','UNTIL','UNWED','UPPER','UPSET',
  'URBAN','URGED','URGES','USAGE','USERS','USHER','USING','USUAL','UTTER','VAGUE',
  'VALET','VALID','VALUE','VALVE','VAPOR','VAULT','VEINS','VENOM','VENUE','VERBS',
  'VERGE','VERSE','VIDEO','VIEWS','VIGOR','VINES','VINYL','VIOLA','VIRAL','VIRUS',
  'VISOR','VISIT','VISTA','VITAL','VIVID','VOCAL','VODKA','VOGUE','VOICE','VOTER',
  'VOUCH','VOWED','VOWEL','WAGES','WAGON','WAIST','WALKS','WALLS','WALTZ','WANDS',
  'WANTS','WARDS','WARNS','WASTE','WATCH','WATER','WAVED','WAVES','WEARY','WEAVE',
  'WEDGE','WEEDS','WEEKS','WEIGH','WEIRD','WELLS','WHALE','WHEAT','WHEEL','WHERE',
  'WHICH','WHILE','WHINE','WHIPS','WHIRL','WHITE','WHOLE','WHOSE','WIDEN','WIDER',
  'WIDOW','WIDTH','WIELD','WINES','WINGS','WIPED','WIPER','WIRED','WIRES','WITCH',
  'WOMAN','WOMEN','WOODS','WOODY','WORDS','WORLD','WORMS','WORRY','WORSE','WORST',
  'WORTH','WOULD','WOUND','WRAPS','WRATH','WRECK','WRIST','WRITE','WRONG','WROTE',
  'YACHT','YARDS','YEARN','YEARS','YEAST','YIELD','YOUNG','YOURS','YOUTH','ZEBRA',
  'ZONES',
];
const ANSWER_SET = new Set(ANSWERS);
const VALID_SET = new Set([...ANSWERS, ...EXTRA_VALID]);

// --- TYPES & CONSTANTS ---
type GameScreen = 'title' | 'modeselect' | 'playing' | 'gameover' | 'stats' | 'achievements' | 'settings' | 'help' | 'leaderboard' | 'pause' | 'countdown' | 'history';
type GameMode = 'random' | 'daily' | 'speed' | 'blitz' | 'streak' | 'hard' | 'blind' | 'practice' | 'zen';
type LetterResult = 'correct' | 'present' | 'absent' | 'empty';

interface GuessResult { letter: string; result: LetterResult; }
interface PlayerStats {
  gamesPlayed: number; gamesWon: number; currentStreak: number; maxStreak: number;
  distribution: number[]; totalTime: number; totalGuesses: number;
  dailyDate: string; dailyCompleted: boolean;
  xp: number; level: number; hintsUsed: number;
}
interface LeaderEntry { score: number; guesses: number; mode: string; time: number; date: string; }
interface HistoryEntry { word: string; won: boolean; guesses: number; mode: string; time: number; date: string; hints: number; }
interface Achievement { id: string; name: string; desc: string; unlocked: boolean; }

const THEMES = [
  { name: 'Neon Holodeck', grid: '#00ccff', accent: '#00ffff', bg: '#050510', fog: '#000011', wall: '#001133', correct: '#00cc44', present: '#ccaa00', absent: '#333344' },
  { name: 'Crimson Arena', grid: '#ff3333', accent: '#ff6644', bg: '#100505', fog: '#110000', wall: '#331100', correct: '#00cc44', present: '#ccaa00', absent: '#332222' },
  { name: 'Toxic Neon', grid: '#33ff33', accent: '#66ff44', bg: '#051005', fog: '#001100', wall: '#003311', correct: '#00cc44', present: '#ccaa00', absent: '#223322' },
  { name: 'Ultra Violet', grid: '#aa44ff', accent: '#cc66ff', bg: '#0a0510', fog: '#0a0011', wall: '#220044', correct: '#00cc44', present: '#ccaa00', absent: '#332233' },
  { name: 'Solar Blaze', grid: '#ff8800', accent: '#ffaa33', bg: '#100a05', fog: '#110800', wall: '#332200', correct: '#00cc44', present: '#ccaa00', absent: '#333322' },
  { name: 'Midnight Ice', grid: '#4488ff', accent: '#66aaff', bg: '#030810', fog: '#000818', wall: '#002244', correct: '#00cc44', present: '#ccaa00', absent: '#222244' },
  { name: 'Rose Gold', grid: '#ff6688', accent: '#ffaacc', bg: '#100508', fog: '#110008', wall: '#331122', correct: '#00cc44', present: '#ccaa00', absent: '#332233' },
  { name: 'Amber Matrix', grid: '#cc8800', accent: '#ffaa44', bg: '#100800', fog: '#0a0600', wall: '#332200', correct: '#00cc44', present: '#ccaa00', absent: '#333322' },
  { name: 'Deep Ocean', grid: '#0066cc', accent: '#3399ff', bg: '#020810', fog: '#000410', wall: '#001144', correct: '#00cc44', present: '#ccaa00', absent: '#222244' },
  { name: 'Cherry Blossom', grid: '#ff88aa', accent: '#ffbbcc', bg: '#0f0508', fog: '#0a0004', wall: '#331122', correct: '#00cc44', present: '#ccaa00', absent: '#332233' },
];

const TITLES = ['Novice','Beginner','Speller','Decoder','Cipher','Linguist','Scholar','Expert','Master','Sage',
  'Oracle','Prophet','Genius','Grandmaster','Legend','Mythic','Titan','Champion','Omega','NEON GOD'];

// Word difficulty: count unique letters, common letter frequency, vowel presence
function getWordDifficulty(word: string): string {
  const uniqueLetters = new Set(word.split('')).size;
  const commonLetters = 'EARIOT';
  const commonCount = word.split('').filter(l => commonLetters.includes(l)).length;
  const vowelCount = word.split('').filter(l => 'AEIOU'.includes(l)).length;
  const score = uniqueLetters * 2 + commonCount + vowelCount;
  if (score >= 12) return 'Easy';
  if (score >= 9) return 'Medium';
  if (score >= 6) return 'Hard';
  return 'Expert';
}

// 80 achievements (doubled from 40)
const ACHIEVEMENTS_DEF: { id: string; name: string; desc: string }[] = [
  // Win milestones
  { id: 'first_win', name: 'First Decode', desc: 'Win your first game' },
  { id: 'win_10', name: 'Dedicated', desc: 'Win 10 games' },
  { id: 'win_25', name: 'Veteran', desc: 'Win 25 games' },
  { id: 'win_50', name: 'Expert', desc: 'Win 50 games' },
  { id: 'win_100', name: 'Master', desc: 'Win 100 games' },
  { id: 'win_250', name: 'Grandmaster', desc: 'Win 250 games' },
  { id: 'win_500', name: 'Legendary', desc: 'Win 500 games' },
  // Guess count
  { id: 'first_guess', name: 'Instant Oracle', desc: 'Guess in 1 try' },
  { id: 'two_guess', name: 'Quick Thinker', desc: 'Guess in 2 tries' },
  { id: 'three_guess', name: 'Sharp Mind', desc: 'Guess in 3 tries' },
  { id: 'last_chance', name: 'Clutch', desc: 'Win on guess 6' },
  // Streaks
  { id: 'streak_3', name: 'Hot Streak', desc: '3 wins in a row' },
  { id: 'streak_5', name: 'On Fire', desc: '5 wins in a row' },
  { id: 'streak_10', name: 'Unstoppable', desc: '10 wins in a row' },
  { id: 'streak_25', name: 'Inferno', desc: '25 wins in a row' },
  { id: 'streak_50', name: 'Eternal Flame', desc: '50 wins in a row' },
  // Daily
  { id: 'daily_done', name: 'Daily Cipher', desc: 'Complete a Daily' },
  { id: 'daily_3', name: 'Daily Regular', desc: '3 dailies done' },
  { id: 'daily_7', name: 'Weekly Warrior', desc: '7 dailies done' },
  { id: 'daily_30', name: 'Monthly Master', desc: '30 dailies done' },
  { id: 'daily_streak_3', name: 'Consistent', desc: '3-day daily streak' },
  { id: 'daily_streak_7', name: 'Committed', desc: '7-day daily streak' },
  { id: 'daily_streak_30', name: 'Iron Will', desc: '30-day daily streak' },
  // Speed & Blitz
  { id: 'speed_win', name: 'Speed Demon', desc: 'Win a Speed game' },
  { id: 'speed_60left', name: 'Lightning', desc: 'Win Speed 60s+ left' },
  { id: 'speed_90left', name: 'Supersonic', desc: 'Win Speed 90s+ left' },
  { id: 'speed_last', name: 'Photo Finish', desc: 'Win Speed on guess 6' },
  { id: 'blitz_win', name: 'Blitz Master', desc: 'Win a Blitz game' },
  { id: 'blitz_15left', name: 'Blitz Lightning', desc: 'Win Blitz 15s+ left' },
  { id: 'blitz_3_row', name: 'Blitz Streak', desc: '3 Blitz wins in a row' },
  // Hard & Blind
  { id: 'hard_win', name: 'Hard Core', desc: 'Win Hard mode' },
  { id: 'hard_3', name: 'Masochist', desc: '3 Hard wins in a row' },
  { id: 'hard_first', name: 'Hard Oracle', desc: 'Win Hard in 1-2 tries' },
  { id: 'blind_win', name: 'In the Dark', desc: 'Win Blind mode' },
  { id: 'blind_3', name: 'Bat Signal', desc: '3 Blind wins' },
  { id: 'blind_first', name: 'Blind Oracle', desc: 'Win Blind in 1-2 tries' },
  // Streak mode
  { id: 'streak_mode_5', name: 'Streak Star', desc: '5 streak mode wins' },
  { id: 'streak_mode_10', name: 'Streak Legend', desc: '10 streak mode wins' },
  // Practice
  { id: 'practice_10', name: 'Studious', desc: '10 practice games' },
  { id: 'practice_50', name: 'Scholar', desc: '50 practice games' },
  // Speed achievements
  { id: 'fast_60', name: 'Quick Solve', desc: 'Win under 60 seconds' },
  { id: 'fast_30', name: 'Flash Solve', desc: 'Win under 30 seconds' },
  { id: 'fast_15', name: 'Warp Speed', desc: 'Win under 15 seconds' },
  // Letter patterns
  { id: 'all_green', name: 'Perfect Row', desc: 'All 5 correct first guess' },
  { id: 'no_yellow', name: 'Precision', desc: 'Win with no yellows' },
  { id: 'triple_green', name: 'Triple Lock', desc: '3+ greens first guess' },
  { id: 'vowel_start', name: 'Vowel Master', desc: 'Win with vowel opener' },
  { id: 'consonant', name: 'Consonant King', desc: 'No vowels in first guess' },
  { id: 'double_letter', name: 'Double Down', desc: 'Win with a double-letter word' },
  { id: 'no_repeat', name: 'Unique Five', desc: 'Win with all unique letters' },
  // Games played
  { id: 'games_10', name: 'Getting Started', desc: 'Play 10 games' },
  { id: 'games_50', name: 'Regular', desc: 'Play 50 games' },
  { id: 'games_100', name: 'Centurion', desc: 'Play 100 games' },
  { id: 'games_500', name: 'Obsessed', desc: 'Play 500 games' },
  // Levels
  { id: 'lvl_10', name: 'Rising Star', desc: 'Reach level 10' },
  { id: 'lvl_25', name: 'Skilled', desc: 'Reach level 25' },
  { id: 'lvl_50', name: 'NEON GOD', desc: 'Reach level 50' },
  // Modes
  { id: 'all_modes', name: 'Explorer', desc: 'Win in all 8 modes' },
  { id: 'four_modes', name: 'Versatile', desc: 'Win in 4 different modes' },
  // Themes
  { id: 'theme_all', name: 'Decorator', desc: 'Try all themes' },
  { id: 'theme_3', name: 'Stylist', desc: 'Try 3 different themes' },
  // Hints
  { id: 'hint_used', name: 'Helper', desc: 'Use a hint' },
  { id: 'no_hints_10', name: 'Purist', desc: '10 wins without hints' },
  { id: 'hint_win', name: 'Assisted', desc: 'Win after using a hint' },
  // Share
  { id: 'shared', name: 'Socialite', desc: 'Share a result' },
  // History
  { id: 'history_view', name: 'Nostalgia', desc: 'View word history' },
  // Difficulty
  { id: 'win_easy', name: 'Warm Up', desc: 'Win an Easy word' },
  { id: 'win_hard_word', name: 'Heavy Hitter', desc: 'Win a Hard word' },
  { id: 'win_expert_word', name: 'Word Wizard', desc: 'Win an Expert word' },
  // Multi-mode combos
  { id: 'hard_blind', name: 'Nightmare', desc: 'Win Hard then Blind' },
  { id: 'speed_blitz_back', name: 'Speed Freak', desc: 'Win Speed then Blitz' },
  // Misc
  { id: 'comeback', name: 'Comeback Kid', desc: 'Win after 3+ losses' },
  { id: 'perfect_daily', name: 'Perfect Day', desc: 'Daily in 1-2 guesses' },
  { id: 'guess_vowel_word', name: 'Vowel Heavy', desc: 'Win word with 3+ vowels' },
  { id: 'xp_1000', name: 'XP Hoarder', desc: 'Earn 1000+ total XP' },
  { id: 'marathon', name: 'Marathon', desc: 'Play 5 games in one session' },
  { id: 'first_blitz', name: 'Need for Speed', desc: 'Play your first Blitz' },
  { id: 'first_blind', name: 'Lights Out', desc: 'Play your first Blind game' },
  // Zen mode
  { id: 'zen_win', name: 'Inner Peace', desc: 'Win a Zen game' },
  { id: 'zen_10', name: 'Zen Master', desc: '10 Zen wins' },
  { id: 'zen_first_try', name: 'Zen Oracle', desc: 'Win Zen in 1-2 tries' },
  // Advanced combos
  { id: 'all_themes_win', name: 'Chameleon', desc: 'Win in every theme' },
  { id: 'triple_mode', name: 'Triathlete', desc: '3 modes in one session' },
  { id: 'no_hints_25', name: 'Self-Reliant', desc: '25 wins without hints' },
  { id: 'no_hints_50', name: 'Unaided', desc: '50 wins without hints' },
  // Score milestones
  { id: 'score_500', name: 'High Scorer', desc: 'Score 500+ in one game' },
  { id: 'score_600', name: 'Elite Score', desc: 'Score 600+ in one game' },
  // XP milestones
  { id: 'xp_5000', name: 'XP Hunter', desc: 'Earn 5000+ total XP' },
  { id: 'xp_10000', name: 'XP Titan', desc: 'Earn 10000+ total XP' },
  // Remaining words tracker
  { id: 'narrow_1', name: 'Sherlock', desc: 'Narrow to 1 word before guessing' },
  { id: 'narrow_5', name: 'Deductive', desc: 'Narrow to 5 or fewer words' },
  // Win streaks
  { id: 'streak_100', name: 'Immortal', desc: '100 wins in a row' },
  // Games played
  { id: 'games_1000', name: 'Addicted', desc: 'Play 1000 games' },
  // Speed records
  { id: 'fast_10', name: 'Instant Win', desc: 'Win under 10 seconds' },
  // Daily
  { id: 'daily_100', name: 'Daily Devotee', desc: '100 dailies completed' },
  { id: 'daily_streak_14', name: 'Two Weeks', desc: '14-day daily streak' },
  // Perfect games
  { id: 'perfect_streak_3', name: 'Flawless', desc: '3 first-guess wins' },
];

// --- SEEDED PRNG ---
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function dateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function getDailyWord(): string {
  const rng = mulberry32(dateSeed());
  return ANSWERS[Math.floor(rng() * ANSWERS.length)];
}

// --- WORD EVALUATION ---
function evaluateGuess(guess: string, target: string): GuessResult[] {
  const results: GuessResult[] = Array(5).fill(null).map((_, i) => ({ letter: guess[i], result: 'absent' as LetterResult }));
  const targetCounts: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) { results[i].result = 'correct'; }
    else { targetCounts[target[i]] = (targetCounts[target[i]] || 0) + 1; }
  }
  for (let i = 0; i < 5; i++) {
    if (results[i].result !== 'correct' && targetCounts[guess[i]] && targetCounts[guess[i]] > 0) {
      results[i].result = 'present';
      targetCounts[guess[i]]--;
    }
  }
  return results;
}

// --- SHARE RESULT GENERATION ---
function generateShareText(guesses: string[], target: string, won: boolean, mode: GameMode, guessCount: number): string {
  const rows: string[] = [];
  for (const guess of guesses) {
    const results = evaluateGuess(guess, target);
    const row = results.map(r => {
      if (r.result === 'correct') return '[G]';
      if (r.result === 'present') return '[Y]';
      return '[_]';
    }).join('');
    rows.push(row);
  }
  const header = `NEON CIPHER ${mode.toUpperCase()} ${won ? guessCount + '/6' : 'X/6'}`;
  return header + '\n' + rows.join('\n');
}

// --- PERSISTENCE ---
const STORAGE_KEY = 'neon-cipher';
function loadStats(): PlayerStats {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-stats'); if (raw) return JSON.parse(raw); } catch {}
  return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0, distribution: [0,0,0,0,0,0], totalTime: 0, totalGuesses: 0, dailyDate: '', dailyCompleted: false, xp: 0, level: 1, hintsUsed: 0 };
}
function saveStats(s: PlayerStats) { try { localStorage.setItem(STORAGE_KEY + '-stats', JSON.stringify(s)); } catch {} }
function loadAchievements(): Set<string> {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-ach'); if (raw) return new Set(JSON.parse(raw)); } catch {}
  return new Set();
}
function saveAchievements(a: Set<string>) { try { localStorage.setItem(STORAGE_KEY + '-ach', JSON.stringify([...a])); } catch {} }
function loadLeaderboard(): LeaderEntry[] {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-lb'); if (raw) return JSON.parse(raw); } catch {}
  return [];
}
function saveLeaderboard(lb: LeaderEntry[]) { try { localStorage.setItem(STORAGE_KEY + '-lb', JSON.stringify(lb.slice(0, 20))); } catch {} }
function loadVolumes(): { master: number; sfx: number; music: number } {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-vol'); if (raw) return JSON.parse(raw); } catch {}
  return { master: 100, sfx: 100, music: 100 };
}
function saveVolumes(v: { master: number; sfx: number; music: number }) { try { localStorage.setItem(STORAGE_KEY + '-vol', JSON.stringify(v)); } catch {} }
function loadThemeIdx(): number {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-theme'); if (raw) return parseInt(raw); } catch {}
  return 0;
}
function saveThemeIdx(i: number) { try { localStorage.setItem(STORAGE_KEY + '-theme', String(i)); } catch {} }
function loadModesWon(): Set<string> {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-modes'); if (raw) return new Set(JSON.parse(raw)); } catch {}
  return new Set();
}
function saveModesWon(m: Set<string>) { try { localStorage.setItem(STORAGE_KEY + '-modes', JSON.stringify([...m])); } catch {} }
function loadThemesUsed(): Set<number> {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-themes-used'); if (raw) return new Set(JSON.parse(raw)); } catch {}
  return new Set();
}
function saveThemesUsed(t: Set<number>) { try { localStorage.setItem(STORAGE_KEY + '-themes-used', JSON.stringify([...t])); } catch {} }
function loadDailyCount(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-daily-count'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveDailyCount(n: number) { try { localStorage.setItem(STORAGE_KEY + '-daily-count', String(n)); } catch {} }
function loadDailyStreak(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-daily-streak'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveDailyStreak(n: number) { try { localStorage.setItem(STORAGE_KEY + '-daily-streak', String(n)); } catch {} }
function loadPracticeCount(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-practice'); if (raw) return parseInt(raw); } catch {} return 0; }
function savePracticeCount(n: number) { try { localStorage.setItem(STORAGE_KEY + '-practice', String(n)); } catch {} }
function loadStreakModeWins(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-streak-wins'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveStreakModeWins(n: number) { try { localStorage.setItem(STORAGE_KEY + '-streak-wins', String(n)); } catch {} }
function loadBlindWins(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-blind-wins'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveBlindWins(n: number) { try { localStorage.setItem(STORAGE_KEY + '-blind-wins', String(n)); } catch {} }
function loadBlitzStreak(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-blitz-streak'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveBlitzStreak(n: number) { try { localStorage.setItem(STORAGE_KEY + '-blitz-streak', String(n)); } catch {} }
function loadHardStreak(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-hard-streak'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveHardStreak(n: number) { try { localStorage.setItem(STORAGE_KEY + '-hard-streak', String(n)); } catch {} }
function loadLossStreak(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-loss-streak'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveLossStreak(n: number) { try { localStorage.setItem(STORAGE_KEY + '-loss-streak', String(n)); } catch {} }
function loadNoHintWins(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-nohint-wins'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveNoHintWins(n: number) { try { localStorage.setItem(STORAGE_KEY + '-nohint-wins', String(n)); } catch {} }
function loadHistory(): HistoryEntry[] { try { const raw = localStorage.getItem(STORAGE_KEY + '-history'); if (raw) return JSON.parse(raw); } catch {} return []; }
function saveHistory(h: HistoryEntry[]) { try { localStorage.setItem(STORAGE_KEY + '-history', JSON.stringify(h.slice(0, 100))); } catch {} }
function loadLastModeWin(): string { try { return localStorage.getItem(STORAGE_KEY + '-last-mode-win') || ''; } catch { return ''; } }
function saveLastModeWin(m: string) { try { localStorage.setItem(STORAGE_KEY + '-last-mode-win', m); } catch {} }
function loadTotalXpEarned(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-total-xp'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveTotalXpEarned(n: number) { try { localStorage.setItem(STORAGE_KEY + '-total-xp', String(n)); } catch {} }
function loadZenWins(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-zen-wins'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveZenWins(n: number) { try { localStorage.setItem(STORAGE_KEY + '-zen-wins', String(n)); } catch {} }
function loadFirstGuessStreak(): number { try { const raw = localStorage.getItem(STORAGE_KEY + '-first-streak'); if (raw) return parseInt(raw); } catch {} return 0; }
function saveFirstGuessStreak(n: number) { try { localStorage.setItem(STORAGE_KEY + '-first-streak', String(n)); } catch {} }
interface ModeStats { played: number; won: number; bestGuesses: number; bestTime: number; }
function loadModeStats(): Record<string, ModeStats> {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-mode-stats'); if (raw) return JSON.parse(raw); } catch {}
  return {};
}
function saveModeStats(ms: Record<string, ModeStats>) { try { localStorage.setItem(STORAGE_KEY + '-mode-stats', JSON.stringify(ms)); } catch {} }
function loadThemeWins(): Set<number> {
  try { const raw = localStorage.getItem(STORAGE_KEY + '-theme-wins'); if (raw) return new Set(JSON.parse(raw)); } catch {}
  return new Set();
}
function saveThemeWins(t: Set<number>) { try { localStorage.setItem(STORAGE_KEY + '-theme-wins', JSON.stringify([...t])); } catch {} }

// --- REMAINING WORDS FILTER ---
function getPossibleWords(guesses: string[], target: string): string[] {
  if (guesses.length === 0) return [...ANSWERS];
  // Build constraints from all guesses
  const mustBeAt: (string | null)[] = [null, null, null, null, null];
  const mustNotBeAt: Set<string>[] = [new Set(), new Set(), new Set(), new Set(), new Set()];
  const mustContain = new Set<string>();
  const absent = new Set<string>();
  const letterMinCounts: Record<string, number> = {};

  for (const guess of guesses) {
    const results = evaluateGuess(guess, target);
    const guessCounts: Record<string, number> = {};
    for (let i = 0; i < 5; i++) {
      const r = results[i];
      if (r.result === 'correct') {
        mustBeAt[i] = r.letter;
        mustContain.add(r.letter);
        guessCounts[r.letter] = (guessCounts[r.letter] || 0) + 1;
      } else if (r.result === 'present') {
        mustNotBeAt[i].add(r.letter);
        mustContain.add(r.letter);
        guessCounts[r.letter] = (guessCounts[r.letter] || 0) + 1;
      } else {
        mustNotBeAt[i].add(r.letter);
      }
    }
    // Track minimum counts for each letter
    for (const [letter, count] of Object.entries(guessCounts)) {
      letterMinCounts[letter] = Math.max(letterMinCounts[letter] || 0, count);
    }
    // Mark truly absent letters (not in any position)
    for (let i = 0; i < 5; i++) {
      if (results[i].result === 'absent' && !mustContain.has(results[i].letter)) {
        absent.add(results[i].letter);
      }
    }
  }

  return ANSWERS.filter(word => {
    for (let i = 0; i < 5; i++) {
      if (mustBeAt[i] && word[i] !== mustBeAt[i]) return false;
      if (mustNotBeAt[i].has(word[i])) return false;
    }
    for (const letter of mustContain) {
      if (!word.includes(letter)) return false;
    }
    for (const letter of absent) {
      if (word.includes(letter)) return false;
    }
    // Check minimum counts
    for (const [letter, minCount] of Object.entries(letterMinCounts)) {
      const wordCount = word.split('').filter(l => l === letter).length;
      if (wordCount < minCount) return false;
    }
    return true;
  });
}

// --- AUDIO ---
class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  volumes = loadVolumes();

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.masterGain);
    this.musicGain = this.ctx.createGain();
    this.musicGain.connect(this.masterGain);
    this.applyVolumes();
  }

  applyVolumes() {
    if (!this.masterGain || !this.sfxGain || !this.musicGain) return;
    this.masterGain.gain.value = this.volumes.master / 100;
    this.sfxGain.gain.value = this.volumes.sfx / 100;
    this.musicGain.gain.value = this.volumes.music / 100;
  }

  private playTone(freq: number, type: OscillatorType, dur: number, vol = 0.3) {
    if (!this.ctx || !this.sfxGain) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g); g.connect(this.sfxGain);
    o.start(); o.stop(this.ctx.currentTime + dur);
  }

  keyPress() { this.playTone(800, 'sine', 0.08, 0.15); }
  keyDelete() { this.playTone(400, 'triangle', 0.1, 0.15); }
  invalidWord() { this.playTone(200, 'sawtooth', 0.3, 0.2); this.playTone(150, 'sawtooth', 0.3, 0.15); }
  revealCorrect(idx: number) { this.playTone([523, 587, 659, 698, 784][idx], 'sine', 0.25, 0.25); }
  revealPresent(idx: number) { this.playTone(440 + idx * 30, 'triangle', 0.2, 0.2); }
  revealAbsent() { this.playTone(220, 'square', 0.1, 0.08); }
  hint() { this.playTone(660, 'triangle', 0.15, 0.2); this.playTone(880, 'sine', 0.2, 0.15); }

  win() {
    if (!this.ctx || !this.sfxGain) return;
    [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.3, 0.25), i * 100));
  }
  lose() {
    if (!this.ctx || !this.sfxGain) return;
    [440, 392, 349, 330].forEach((f, i) => setTimeout(() => this.playTone(f, 'sawtooth', 0.4, 0.2), i * 150));
  }
  achievement() { [659, 784, 880, 1047, 1175].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.2, 0.2), i * 80)); }
  countdown() { this.playTone(660, 'sine', 0.15, 0.2); }
  countdownGo() { this.playTone(880, 'sine', 0.3, 0.25); }
  click() { this.playTone(600, 'sine', 0.06, 0.1); }
  share() { this.playTone(523, 'sine', 0.15, 0.15); this.playTone(784, 'sine', 0.15, 0.15); }

  startDrone() {
    if (!this.ctx || !this.musicGain) return;
    this.stopDrone();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.15; lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain); lfo.start();
    const freqs: [number, OscillatorType][] = [[55, 'sine'], [82.5, 'triangle'], [110, 'sine']];
    freqs.forEach(([freq, type]) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const lp = this.ctx!.createBiquadFilter();
      o.type = type; o.frequency.value = freq;
      g.gain.value = 0.06;
      lp.type = 'lowpass'; lp.frequency.value = 400;
      lfoGain.connect(g.gain);
      o.connect(lp); lp.connect(g); g.connect(this.musicGain!);
      o.start(); this.droneOscs.push(o);
    });
    this.droneOscs.push(lfo);
  }

  stopDrone() {
    this.droneOscs.forEach(o => { try { o.stop(); } catch {} });
    this.droneOscs = [];
  }
}
const audio = new AudioManager();

// --- PARTICLE SYSTEM ---
interface Particle { mesh: Mesh; vx: number; vy: number; vz: number; life: number; maxLife: number; }
const particles: Particle[] = [];
const particlePool: Particle[] = [];
let particleParent: Group;

function createParticlePool(scene: any) {
  particleParent = new Group();
  scene.add(particleParent);
  for (let i = 0; i < 150; i++) {
    const g = new SphereGeometry(0.012, 4, 4);
    const m = new MeshBasicMaterial({ color: 0x00ffff, transparent: true, blending: AdditiveBlending });
    const mesh = new Mesh(g, m);
    mesh.visible = false;
    particleParent.add(mesh);
    particlePool.push({ mesh, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 1 });
  }
}

function spawnParticles(x: number, y: number, z: number, color: number, count: number) {
  for (let i = 0; i < count; i++) {
    const p = particlePool.find(pp => pp.life <= 0);
    if (!p) break;
    p.mesh.position.set(x, y, z);
    p.vx = (Math.random() - 0.5) * 1.5;
    p.vy = Math.random() * 2 + 0.5;
    p.vz = (Math.random() - 0.5) * 1.5;
    p.life = 1.0; p.maxLife = 0.8 + Math.random() * 0.4;
    (p.mesh.material as MeshBasicMaterial).color.set(color);
    p.mesh.visible = true;
    particles.push(p);
  }
}

function updateParticles(dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt / p.maxLife;
    if (p.life <= 0) { p.mesh.visible = false; particles.splice(i, 1); continue; }
    p.vy -= 4.0 * dt;
    p.mesh.position.x += p.vx * dt;
    p.mesh.position.y += p.vy * dt;
    p.mesh.position.z += p.vz * dt;
    (p.mesh.material as MeshBasicMaterial).opacity = Math.max(0, p.life);
  }
}

// --- MAIN GAME SYSTEM ---
class NeonCipherSystem extends createSystem({
  titlePanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/title.json')] },
  modePanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/modeselect.json')] },
  boardPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/board.json')] },
  kbPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/keyboard.json')] },
  hudPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/hud.json')] },
  goPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/gameover.json')] },
  statsPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/stats.json')] },
  achPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/achievements.json')] },
  settingsPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/settings.json')] },
  helpPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/help.json')] },
  toastPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/toast.json')] },
  pausePanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/pause.json')] },
  lbPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/leaderboard.json')] },
  countdownPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/countdown.json')] },
  historyPanel: { required: [PanelUI, PanelDocument], where: [eq(PanelUI, 'config', './ui/history.json')] },
}) {
  private panelEntities: Record<string, Entity> = {};
  private docs: Record<string, UIKitDocument> = {};

  // Game state
  private screen: GameScreen = 'title';
  private gameMode: GameMode = 'random';
  private targetWord = '';
  private guesses: string[] = [];
  private currentGuess = '';
  private currentRow = 0;
  private gameOver = false;
  private won = false;
  private startTime = 0;
  private elapsed = 0;
  private speedTimeLeft = 120;
  private letterStatus: Record<string, LetterResult> = {};
  private revealQueue: { row: number; col: number; result: LetterResult; letter: string }[] = [];
  private revealTimer = 0;
  private revealIdx = 0;
  private isRevealing = false;
  private hadYellow = false;
  private hintsUsedThisGame = 0;
  private hintedPositions = new Set<number>();
  private sessionGames = 0;

  // Toast system
  private toastQueue: string[] = [];
  private toastTimer = 0;
  private toastVisible = false;

  // Countdown
  private countdownValue = 3;
  private countdownTimer = 0;
  private countdownActive = false;
  private pendingMode: GameMode = 'random';

  // Shake animation
  private shakeTimer = 0;
  private shakeEntity: Entity | null = null;
  private shakeOrigX = 0;

  // Stats
  private stats = loadStats();
  private unlockedAch = loadAchievements();
  private leaderboard = loadLeaderboard();
  private modesWon = loadModesWon();
  private themesUsed = loadThemesUsed();
  private dailyCount = loadDailyCount();
  private dailyStreak = loadDailyStreak();
  private practiceCount = loadPracticeCount();
  private streakModeWins = loadStreakModeWins();
  private blindWins = loadBlindWins();
  private blitzStreak = loadBlitzStreak();
  private hardStreak = loadHardStreak();
  private lossStreak = loadLossStreak();
  private noHintWins = loadNoHintWins();
  private history = loadHistory();
  private lastModeWin = loadLastModeWin();
  private totalXpEarned = loadTotalXpEarned();
  private zenWins = loadZenWins();
  private firstGuessStreak = loadFirstGuessStreak();
  private modeStats = loadModeStats();
  private themeWins = loadThemeWins();
  private possibleWordsCount = ANSWERS.length;
  private sessionModesPlayed = new Set<string>();
  private achPage = 0;
  private historyPage = 0;
  private themeIdx = loadThemeIdx();
  private hasShared = false;

  // Environment refs
  private envMeshes: Mesh[] = [];
  private decorations: Group[] = [];
  private ambientParticles: Mesh[] = [];

  // Keyboard state
  private keysDown = new Set<string>();

  private getDoc(entity: Entity): UIKitDocument | undefined {
    return PanelDocument.data.document[entity.index] as UIKitDocument | undefined;
  }
  private setText(entity: Entity, id: string, text: string) {
    const doc = this.getDoc(entity);
    const el = doc?.getElementById(id) as UIKit.Text | undefined;
    el?.setProperties({ text });
  }
  private setProps(entity: Entity, id: string, props: Record<string, any>) {
    const doc = this.getDoc(entity);
    const el = doc?.getElementById(id) as UIKit.Text | undefined;
    el?.setProperties(props);
  }

  init() {
    const panels: [string, any][] = [
      ['title', this.queries.titlePanel], ['mode', this.queries.modePanel],
      ['board', this.queries.boardPanel], ['kb', this.queries.kbPanel],
      ['hud', this.queries.hudPanel], ['go', this.queries.goPanel],
      ['stats', this.queries.statsPanel], ['ach', this.queries.achPanel],
      ['settings', this.queries.settingsPanel], ['help', this.queries.helpPanel],
      ['toast', this.queries.toastPanel], ['pause', this.queries.pausePanel],
      ['lb', this.queries.lbPanel], ['countdown', this.queries.countdownPanel],
      ['history', this.queries.historyPanel],
    ];

    panels.forEach(([name, query]) => {
      query.subscribe('qualify', (entity: Entity) => {
        this.panelEntities[name] = entity;
        this.docs[name] = this.getDoc(entity)!;
        this.bindPanel(name, entity);
        this.updateVisibility();
      });
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (this.keysDown.has(e.key)) return;
        this.keysDown.add(e.key);
        this.handleKey(e.key);
      });
      window.addEventListener('keyup', (e) => { this.keysDown.delete(e.key); });
    }

    audio.init();
    audio.startDrone();
  }

  private bindPanel(name: string, entity: Entity) {
    const doc = this.getDoc(entity);
    if (!doc) return;
    const btn = (id: string, cb: () => void) => {
      const el = doc.getElementById(id) as UIKit.Text | undefined;
      el?.addEventListener('click', () => { audio.click(); cb(); });
    };

    switch (name) {
      case 'title':
        btn('btn-play', () => this.setScreen('modeselect'));
        btn('btn-daily', () => this.startCountdown('daily'));
        btn('btn-scores', () => { this.refreshLeaderboard(); this.setScreen('leaderboard'); });
        btn('btn-achieve', () => { this.refreshAchievements(); this.setScreen('achievements'); });
        btn('btn-stats', () => { this.refreshStats(); this.setScreen('stats'); });
        btn('btn-settings', () => this.setScreen('settings'));
        btn('btn-help', () => this.setScreen('help'));
        this.refreshTitle();
        break;
      case 'mode':
        btn('btn-random', () => this.startCountdown('random'));
        btn('btn-daily', () => this.startCountdown('daily'));
        btn('btn-speed', () => this.startCountdown('speed'));
        btn('btn-blitz', () => this.startCountdown('blitz'));
        btn('btn-streak', () => this.startCountdown('streak'));
        btn('btn-hard', () => this.startCountdown('hard'));
        btn('btn-blind', () => this.startCountdown('blind'));
        btn('btn-practice', () => this.startCountdown('practice'));
        btn('btn-zen', () => this.startCountdown('zen'));
        btn('btn-back', () => this.setScreen('title'));
        break;
      case 'kb':
        'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').forEach(l => {
          btn('k-' + l.toLowerCase(), () => this.handleKey(l));
        });
        btn('k-enter', () => this.handleKey('Enter'));
        btn('k-back', () => this.handleKey('Backspace'));
        break;
      case 'go':
        btn('btn-again', () => this.startCountdown(this.gameMode));
        btn('btn-menu', () => this.setScreen('title'));
        btn('btn-share', () => this.shareResult());
        btn('btn-history', () => { this.unlockAch('history_view'); this.refreshHistory(); this.setScreen('history'); });
        break;
      case 'stats':
        btn('btn-back', () => this.setScreen('title'));
        break;
      case 'ach':
        btn('btn-back', () => this.setScreen('title'));
        btn('btn-prev', () => { if (this.achPage > 0) { this.achPage--; this.refreshAchievements(); } });
        btn('btn-next', () => { if ((this.achPage + 1) * 15 < ACHIEVEMENTS_DEF.length) { this.achPage++; this.refreshAchievements(); } });
        break;
      case 'settings':
        btn('btn-back', () => this.setScreen('title'));
        btn('btn-master-up', () => this.adjustVolume('master', 10));
        btn('btn-master-down', () => this.adjustVolume('master', -10));
        btn('btn-sfx-up', () => this.adjustVolume('sfx', 10));
        btn('btn-sfx-down', () => this.adjustVolume('sfx', -10));
        btn('btn-music-up', () => this.adjustVolume('music', 10));
        btn('btn-music-down', () => this.adjustVolume('music', -10));
        btn('btn-theme-next', () => this.cycleTheme(1));
        btn('btn-theme-prev', () => this.cycleTheme(-1));
        this.refreshSettings();
        break;
      case 'help':
        btn('btn-back', () => this.setScreen('title'));
        break;
      case 'pause':
        btn('btn-resume', () => this.setScreen('playing'));
        btn('btn-quit', () => this.setScreen('title'));
        break;
      case 'lb':
        btn('btn-back', () => this.setScreen('title'));
        break;
      case 'hud':
        btn('hint-btn', () => this.useHint());
        break;
      case 'history':
        btn('btn-back', () => this.setScreen('title'));
        btn('btn-prev', () => { if (this.historyPage > 0) { this.historyPage--; this.refreshHistory(); } });
        btn('btn-next', () => { if ((this.historyPage + 1) * 15 < this.history.length) { this.historyPage++; this.refreshHistory(); } });
        break;
    }
  }

  // --- SCREEN MANAGEMENT ---
  private setScreen(screen: GameScreen) {
    this.screen = screen;
    this.updateVisibility();
  }

  private updateVisibility() {
    const vis: Record<string, string[]> = {
      title: ['title'],
      modeselect: ['mode'],
      playing: ['board', 'kb', 'hud'],
      gameover: ['board', 'go'],
      stats: ['stats'],
      achievements: ['ach'],
      settings: ['settings'],
      help: ['help'],
      leaderboard: ['lb'],
      pause: ['pause'],
      countdown: ['countdown'],
      history: ['history'],
    };
    const active: string[] = vis[this.screen] || [];
    const allPanels = ['title', 'mode', 'board', 'kb', 'hud', 'go', 'stats', 'ach', 'settings', 'help', 'toast', 'pause', 'lb', 'countdown', 'history'];
    allPanels.forEach(name => {
      const entity = this.panelEntities[name];
      if (!entity) return;
      const show = active.includes(name) || (name === 'toast' && this.toastVisible);
      if (entity.object3D) entity.object3D.visible = show;
    });
  }

  // --- GAME FLOW ---
  private startCountdown(mode: GameMode) {
    this.pendingMode = mode;
    this.countdownValue = 3;
    this.countdownTimer = 0;
    this.countdownActive = true;
    const e = this.panelEntities['countdown'];
    if (e) this.setText(e, 'count-text', '3');
    this.setScreen('countdown');
    audio.countdown();
  }

  private startGame(mode: GameMode) {
    this.gameMode = mode;
    this.gameOver = false;
    this.won = false;
    this.guesses = [];
    this.currentGuess = '';
    this.currentRow = 0;
    this.letterStatus = {};
    this.revealQueue = [];
    this.revealTimer = 0;
    this.revealIdx = 0;
    this.isRevealing = false;
    this.hadYellow = false;
    this.hintsUsedThisGame = 0;
    this.hintedPositions.clear();
    this.hasShared = false;
    this.startTime = Date.now();
    this.sessionGames++;
    this.sessionModesPlayed.add(mode);
    this.possibleWordsCount = ANSWERS.length;
    this.speedTimeLeft = mode === 'blitz' ? 30 : 120;

    // Track first-time mode plays
    if (mode === 'blitz') this.unlockAch('first_blitz');
    if (mode === 'blind') this.unlockAch('first_blind');

    if (mode === 'daily') {
      this.targetWord = getDailyWord();
      const today = dateSeed().toString();
      if (this.stats.dailyDate === today && this.stats.dailyCompleted) {
        this.showToast('Already completed today!');
        this.setScreen('title');
        return;
      }
    } else {
      this.targetWord = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    }

    this.resetBoard();
    this.resetKeyboard();
    this.updateHUD();
    this.themesUsed.add(this.themeIdx);
    saveThemesUsed(this.themesUsed);
    this.setScreen('playing');
  }

  private resetBoard() {
    const e = this.panelEntities['board'];
    if (!e) return;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        this.setProps(e, `c${r}${c}`, { text: ' ', backgroundColor: '#222233', borderColor: '#444466' });
      }
    }
  }

  private resetKeyboard() {
    const e = this.panelEntities['kb'];
    if (!e) return;
    'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').forEach(l => {
      this.setProps(e, 'k-' + l.toLowerCase(), { backgroundColor: '#333355', color: '#ffffff' });
    });
  }

  // --- HINT SYSTEM ---
  private useHint() {
    if (this.screen !== 'playing' || this.gameOver || this.isRevealing) return;
    if (this.gameMode === 'hard' || this.gameMode === 'blind') {
      this.showToast('No hints in this mode!');
      return;
    }
    // Find an unrevealed position
    const unrevealed: number[] = [];
    for (let i = 0; i < 5; i++) {
      if (!this.hintedPositions.has(i) && !this.letterStatus[this.targetWord[i]]) {
        unrevealed.push(i);
      }
    }
    if (unrevealed.length === 0) {
      this.showToast('No more hints available');
      return;
    }
    const pos = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    this.hintedPositions.add(pos);
    this.hintsUsedThisGame++;
    this.stats.hintsUsed++;
    saveStats(this.stats);
    this.unlockAch('hint_used');

    // Flash the position on the keyboard
    const letter = this.targetWord[pos];
    const kbEntity = this.panelEntities['kb'];
    if (kbEntity) {
      this.setProps(kbEntity, 'k-' + letter.toLowerCase(), { backgroundColor: '#ffaa00', color: '#000000' });
    }
    this.showToast(`Hint: Position ${pos + 1} is ${letter}`);
    audio.hint();
    spawnParticles((pos - 2) * 0.16, 1.85, -2.0, 0xffaa00, 6);
  }

  // --- SHARE ---
  private shareResult() {
    if (!this.gameOver) return;
    const text = generateShareText(this.guesses, this.targetWord, this.won, this.gameMode, this.guesses.length);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copied to clipboard!');
        audio.share();
      }).catch(() => {
        this.showToast('Share: ' + text.split('\n')[0]);
      });
    } else {
      this.showToast('Share: ' + text.split('\n')[0]);
    }
    if (!this.hasShared) {
      this.hasShared = true;
      this.unlockAch('shared');
    }
  }

  // --- INPUT HANDLING ---
  private handleKey(key: string) {
    if (this.screen === 'playing' && !this.gameOver && !this.isRevealing) {
      if (key === 'Escape' || key === 'P' || key === 'p') { this.setScreen('pause'); return; }
      if (key === 'H' || key === 'h') { this.useHint(); return; }
      if (key === 'Enter') { this.submitGuess(); return; }
      if (key === 'Backspace' || key === 'Delete') {
        if (this.currentGuess.length > 0) {
          this.currentGuess = this.currentGuess.slice(0, -1);
          this.updateCurrentRow();
          audio.keyDelete();
        }
        return;
      }
      const letter = key.toUpperCase();
      if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {
        if (this.currentGuess.length < 5) {
          this.currentGuess += letter;
          this.updateCurrentRow();
          audio.keyPress();
        }
      }
    } else if (this.screen === 'pause') {
      if (key === 'Escape' || key === 'P' || key === 'p') { this.setScreen('playing'); }
    } else if (this.screen === 'gameover') {
      if (key === 'Enter' || key === 'r' || key === 'R') { this.startCountdown(this.gameMode); }
      if (key === 'Escape' || key === 'm' || key === 'M') { this.setScreen('title'); }
      if (key === 's' || key === 'S') { this.shareResult(); }
    }
  }

  private updateCurrentRow() {
    const e = this.panelEntities['board'];
    if (!e) return;
    for (let c = 0; c < 5; c++) {
      const letter = this.currentGuess[c] || ' ';
      const hasBorder = c < this.currentGuess.length;
      this.setProps(e, `c${this.currentRow}${c}`, {
        text: letter,
        borderColor: hasBorder ? '#00ccff' : '#444466',
      });
    }
  }

  private triggerShake() {
    const e = this.panelEntities['board'];
    if (!e || !e.object3D) return;
    this.shakeEntity = e;
    this.shakeOrigX = e.object3D.position.x;
    this.shakeTimer = 0.4;
  }

  private submitGuess() {
    if (this.currentGuess.length !== 5) { this.showToast('Not enough letters'); return; }
    if (!VALID_SET.has(this.currentGuess)) {
      this.showToast('Not in word list');
      audio.invalidWord();
      this.triggerShake();
      return;
    }

    // Hard mode validation
    if (this.gameMode === 'hard' && this.guesses.length > 0) {
      const lastResults = evaluateGuess(this.guesses[this.guesses.length - 1], this.targetWord);
      for (let i = 0; i < 5; i++) {
        if (lastResults[i].result === 'correct' && this.currentGuess[i] !== lastResults[i].letter) {
          this.showToast(`Position ${i+1} must be ${lastResults[i].letter}`);
          audio.invalidWord(); this.triggerShake(); return;
        }
      }
      for (const r of lastResults) {
        if (r.result === 'present' && !this.currentGuess.includes(r.letter)) {
          this.showToast(`Must use ${r.letter}`);
          audio.invalidWord(); this.triggerShake(); return;
        }
      }
    }

    const results = evaluateGuess(this.currentGuess, this.targetWord);
    this.guesses.push(this.currentGuess);

    // Queue reveal animation
    this.revealQueue = results.map((r, i) => ({
      row: this.currentRow, col: i, result: r.result, letter: r.letter,
    }));
    this.revealIdx = 0;
    this.revealTimer = 0;
    this.isRevealing = true;
    if (results.some(r => r.result === 'present')) this.hadYellow = true;
    this.currentGuess = '';
    this.currentRow++;
  }

  private finishReveal() {
    this.isRevealing = false;
    const lastGuess = this.guesses[this.guesses.length - 1];
    const results = evaluateGuess(lastGuess, this.targetWord);

    // Compute remaining possible words
    const possibleWords = getPossibleWords(this.guesses, this.targetWord);
    this.possibleWordsCount = possibleWords.length;

    // Check narrowing achievements
    if (this.possibleWordsCount <= 1) this.unlockAch('narrow_1');
    if (this.possibleWordsCount <= 5) this.unlockAch('narrow_5');

    // Update keyboard colors (skip in blind mode)
    if (this.gameMode !== 'blind') {
      results.forEach(r => {
        const current = this.letterStatus[r.letter];
        if (r.result === 'correct') { this.letterStatus[r.letter] = 'correct'; }
        else if (r.result === 'present' && current !== 'correct') { this.letterStatus[r.letter] = 'present'; }
        else if (!current) { this.letterStatus[r.letter] = 'absent'; }
      });
      this.updateKeyboardColors();
    }

    const allCorrect = results.every(r => r.result === 'correct');
    if (allCorrect) { this.won = true; this.gameOver = true; this.onGameEnd(); }
    else if (this.currentRow >= 6) { this.won = false; this.gameOver = true; this.onGameEnd(); }
  }

  private updateKeyboardColors() {
    const e = this.panelEntities['kb'];
    if (!e) return;
    const theme = THEMES[this.themeIdx];
    for (const [letter, status] of Object.entries(this.letterStatus)) {
      const color = status === 'correct' ? theme.correct : status === 'present' ? theme.present : theme.absent;
      this.setProps(e, 'k-' + letter.toLowerCase(), { backgroundColor: color });
    }
  }

  // --- GAME END ---
  private onGameEnd() {
    this.elapsed = (Date.now() - this.startTime) / 1000;
    const guessCount = this.guesses.length;

    this.stats.gamesPlayed++;
    if (this.won) {
      this.stats.gamesWon++;
      this.stats.currentStreak++;
      this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
      this.stats.distribution[guessCount - 1]++;
      this.stats.totalGuesses += guessCount;
      this.stats.totalTime += this.elapsed;

      const xp = Math.max(10, 100 - (guessCount - 1) * 15 + Math.floor(Math.max(0, 120 - this.elapsed)));
      this.stats.xp += xp;
      this.totalXpEarned += xp;
      saveTotalXpEarned(this.totalXpEarned);
      while (this.stats.xp >= (100 + this.stats.level * 50) && this.stats.level < 50) {
        this.stats.xp -= (100 + this.stats.level * 50);
        this.stats.level++;
      }

      this.modesWon.add(this.gameMode);
      saveModesWon(this.modesWon);

      const score = Math.round((7 - guessCount) * 100 + Math.max(0, 300 - this.elapsed));
      this.leaderboard.push({ score, guesses: guessCount, mode: this.gameMode, time: Math.round(this.elapsed), date: new Date().toLocaleDateString() });
      this.leaderboard.sort((a, b) => b.score - a.score);
      this.leaderboard = this.leaderboard.slice(0, 20);
      saveLeaderboard(this.leaderboard);

      audio.win();
      spawnParticles(0, 1.6, -2, 0x00ff88, 30);
      spawnParticles(-0.3, 1.8, -2, 0x00ffff, 15);
      spawnParticles(0.3, 1.8, -2, 0xffcc00, 15);
      spawnParticles(0, 2.0, -2, 0xff66ff, 10);

      // Track loss streak reset
      if (this.lossStreak >= 3) this.unlockAch('comeback');
      this.lossStreak = 0; saveLossStreak(0);

      // No-hint tracking
      if (this.hintsUsedThisGame === 0) { this.noHintWins++; saveNoHintWins(this.noHintWins); }
      else { this.unlockAch('hint_win'); }

      // Mode-specific streaks
      if (this.gameMode === 'blitz') { this.blitzStreak++; saveBlitzStreak(this.blitzStreak); }
      else { this.blitzStreak = 0; saveBlitzStreak(0); }
      if (this.gameMode === 'hard') { this.hardStreak++; saveHardStreak(this.hardStreak); }
      else { this.hardStreak = 0; saveHardStreak(0); }

      // Combo tracking
      if (this.lastModeWin === 'hard' && this.gameMode === 'blind') this.unlockAch('hard_blind');
      if (this.lastModeWin === 'speed' && this.gameMode === 'blitz') this.unlockAch('speed_blitz_back');
      this.lastModeWin = this.gameMode;
      saveLastModeWin(this.gameMode);
    } else {
      this.stats.currentStreak = 0;
      this.lossStreak++; saveLossStreak(this.lossStreak);
      this.blitzStreak = 0; saveBlitzStreak(0);
      this.hardStreak = 0; saveHardStreak(0);
      this.lastModeWin = '';
      saveLastModeWin('');
      audio.lose();
    }

    // Daily tracking
    if (this.gameMode === 'daily') {
      this.stats.dailyDate = dateSeed().toString();
      this.stats.dailyCompleted = true;
      if (this.won) {
        this.dailyCount++; saveDailyCount(this.dailyCount);
        this.dailyStreak++; saveDailyStreak(this.dailyStreak);
      } else { this.dailyStreak = 0; saveDailyStreak(0); }
    }
    if (this.gameMode === 'practice') { this.practiceCount++; savePracticeCount(this.practiceCount); }
    if (this.gameMode === 'streak' && this.won) { this.streakModeWins++; saveStreakModeWins(this.streakModeWins); }
    if (this.gameMode === 'blind' && this.won) { this.blindWins++; saveBlindWins(this.blindWins); }
    if (this.gameMode === 'zen' && this.won) { this.zenWins++; saveZenWins(this.zenWins); }

    // Per-mode stats
    if (!this.modeStats[this.gameMode]) { this.modeStats[this.gameMode] = { played: 0, won: 0, bestGuesses: 0, bestTime: 0 }; }
    const ms = this.modeStats[this.gameMode];
    ms.played++;
    if (this.won) {
      ms.won++;
      if (ms.bestGuesses === 0 || guessCount < ms.bestGuesses || (guessCount === ms.bestGuesses && this.elapsed < ms.bestTime)) {
        ms.bestGuesses = guessCount;
        ms.bestTime = Math.round(this.elapsed);
      }
    }
    saveModeStats(this.modeStats);

    // Theme win tracking
    if (this.won) {
      this.themeWins.add(this.themeIdx);
      saveThemeWins(this.themeWins);
    }

    // First-guess streak
    if (this.won && guessCount === 1) { this.firstGuessStreak++; saveFirstGuessStreak(this.firstGuessStreak); }
    else { this.firstGuessStreak = 0; saveFirstGuessStreak(0); }

    // History
    this.history.unshift({ word: this.targetWord, won: this.won, guesses: guessCount, mode: this.gameMode, time: Math.round(this.elapsed), date: new Date().toLocaleDateString(), hints: this.hintsUsedThisGame });
    saveHistory(this.history);

    saveStats(this.stats);
    this.checkAchievements();
    this.showGameOver();
  }

  private showGameOver() {
    const e = this.panelEntities['go'];
    if (!e) { this.setScreen('gameover'); return; }

    this.setText(e, 'result-title', this.won ? 'DECODED!' : 'FAILED');
    this.setProps(e, 'result-title', { color: this.won ? '#00ff88' : '#ff4444' });
    this.setText(e, 'answer-label', this.targetWord);
    const modeNames2: Record<GameMode, string> = { random: 'Random', daily: 'Daily', speed: 'Speed', blitz: 'Blitz', streak: 'Streak', hard: 'Hard', blind: 'Blind', practice: 'Practice', zen: 'Zen' };
    this.setText(e, 'mode-info', `Mode: ${modeNames2[this.gameMode]}`);
    this.setText(e, 'guesses-val', `${this.guesses.length}/6`);
    const mins = Math.floor(this.elapsed / 60);
    const secs = Math.floor(this.elapsed % 60);
    this.setText(e, 'time-val', `${mins}:${secs.toString().padStart(2, '0')}`);
    this.setText(e, 'streak-val', String(this.stats.currentStreak));
    const xp = this.won ? Math.max(10, 100 - (this.guesses.length - 1) * 15 + Math.floor(Math.max(0, 120 - this.elapsed))) : 0;
    this.setText(e, 'xp-val', `+${xp}`);
    this.setText(e, 'diff-label', `Difficulty: ${getWordDifficulty(this.targetWord)}`);
    this.setText(e, 'words-remaining', `Words remaining: ${this.possibleWordsCount}`);
    // Mode best
    const ms = this.modeStats[this.gameMode];
    const modeBest = ms && ms.bestGuesses > 0 ? `Best: ${ms.bestGuesses}/6 in ${ms.bestTime}s` : 'No record yet';
    this.setText(e, 'mode-record', `${modeNames2[this.gameMode]} ${modeBest}`);

    // Share preview
    const shareText = generateShareText(this.guesses, this.targetWord, this.won, this.gameMode, this.guesses.length);
    const sharePreview = shareText.split('\n').slice(0, 4).join(' | ');
    this.setText(e, 'share-text', sharePreview);

    this.setScreen('gameover');
  }

  // --- ACHIEVEMENTS ---
  private unlockAch(id: string) {
    if (this.unlockedAch.has(id)) return;
    this.unlockedAch.add(id);
    saveAchievements(this.unlockedAch);
    const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
    if (def) this.showToast(`Achievement: ${def.name}`);
    audio.achievement();
  }

  private checkAchievements() {
    const unlock = (id: string) => this.unlockAch(id);
    const gc = this.guesses.length;

    if (this.won) {
      unlock('first_win');
      if (gc === 1) unlock('first_guess');
      if (gc <= 2) unlock('two_guess');
      if (gc <= 3) unlock('three_guess');
      if (gc === 6) unlock('last_chance');
      if (!this.hadYellow) unlock('no_yellow');
      if (this.elapsed < 60) unlock('fast_60');
      if (this.elapsed < 30) unlock('fast_30');
      if (this.elapsed < 15) unlock('fast_15');

      const firstGuess = this.guesses[0];
      const firstResults = evaluateGuess(firstGuess, this.targetWord);
      const greensInFirst = firstResults.filter(r => r.result === 'correct').length;
      if (greensInFirst === 5) unlock('all_green');
      if (greensInFirst >= 3) unlock('triple_green');
      const vowels = 'AEIOU';
      if (vowels.includes(firstGuess[0])) unlock('vowel_start');
      if (!firstGuess.split('').some(l => vowels.includes(l))) unlock('consonant');

      // Word characteristics
      const uniqueInTarget = new Set(this.targetWord.split('')).size;
      if (uniqueInTarget < 5) unlock('double_letter');
      if (uniqueInTarget === 5) unlock('no_repeat');
      const vowelCountInWord = this.targetWord.split('').filter(l => vowels.includes(l)).length;
      if (vowelCountInWord >= 3) unlock('guess_vowel_word');

      // Difficulty
      const diff = getWordDifficulty(this.targetWord);
      if (diff === 'Easy') unlock('win_easy');
      if (diff === 'Hard') unlock('win_hard_word');
      if (diff === 'Expert') unlock('win_expert_word');

      // Daily
      if (this.gameMode === 'daily') {
        unlock('daily_done');
        if (this.dailyCount >= 3) unlock('daily_3');
        if (this.dailyCount >= 7) unlock('daily_7');
        if (this.dailyCount >= 30) unlock('daily_30');
        if (gc <= 2) unlock('perfect_daily');
      }
      // Speed
      if (this.gameMode === 'speed') {
        unlock('speed_win');
        if (this.speedTimeLeft >= 60) unlock('speed_60left');
        if (this.speedTimeLeft >= 90) unlock('speed_90left');
        if (gc === 6) unlock('speed_last');
      }
      // Blitz
      if (this.gameMode === 'blitz') {
        unlock('blitz_win');
        if (this.speedTimeLeft >= 15) unlock('blitz_15left');
        if (this.blitzStreak >= 3) unlock('blitz_3_row');
      }
      // Hard
      if (this.gameMode === 'hard') {
        unlock('hard_win');
        if (this.hardStreak >= 3) unlock('hard_3');
        if (gc <= 2) unlock('hard_first');
      }
      // Blind
      if (this.gameMode === 'blind') {
        unlock('blind_win');
        if (this.blindWins >= 3) unlock('blind_3');
        if (gc <= 2) unlock('blind_first');
      }
      // Streak mode
      if (this.gameMode === 'streak' && this.streakModeWins >= 5) unlock('streak_mode_5');
      if (this.gameMode === 'streak' && this.streakModeWins >= 10) unlock('streak_mode_10');
    }

    // General
    if (this.stats.gamesWon >= 10) unlock('win_10');
    if (this.stats.gamesWon >= 25) unlock('win_25');
    if (this.stats.gamesWon >= 50) unlock('win_50');
    if (this.stats.gamesWon >= 100) unlock('win_100');
    if (this.stats.gamesWon >= 250) unlock('win_250');
    if (this.stats.gamesWon >= 500) unlock('win_500');
    if (this.stats.currentStreak >= 3) unlock('streak_3');
    if (this.stats.currentStreak >= 5) unlock('streak_5');
    if (this.stats.currentStreak >= 10) unlock('streak_10');
    if (this.stats.currentStreak >= 25) unlock('streak_25');
    if (this.stats.currentStreak >= 50) unlock('streak_50');
    if (this.stats.gamesPlayed >= 10) unlock('games_10');
    if (this.stats.gamesPlayed >= 50) unlock('games_50');
    if (this.stats.gamesPlayed >= 100) unlock('games_100');
    if (this.stats.gamesPlayed >= 500) unlock('games_500');
    if (this.stats.level >= 10) unlock('lvl_10');
    if (this.stats.level >= 25) unlock('lvl_25');
    if (this.stats.level >= 50) unlock('lvl_50');
    if (this.modesWon.size >= 8) unlock('all_modes');
    if (this.modesWon.size >= 4) unlock('four_modes');
    if (this.themesUsed.size >= THEMES.length) unlock('theme_all');
    if (this.themesUsed.size >= 3) unlock('theme_3');
    if (this.practiceCount >= 10) unlock('practice_10');
    if (this.practiceCount >= 50) unlock('practice_50');
    if (this.dailyStreak >= 3) unlock('daily_streak_3');
    if (this.dailyStreak >= 7) unlock('daily_streak_7');
    if (this.dailyStreak >= 30) unlock('daily_streak_30');
    if (this.noHintWins >= 10) unlock('no_hints_10');
    if (this.totalXpEarned >= 1000) unlock('xp_1000');
    if (this.totalXpEarned >= 5000) unlock('xp_5000');
    if (this.totalXpEarned >= 10000) unlock('xp_10000');
    if (this.sessionGames >= 5) unlock('marathon');
    if (this.sessionModesPlayed.size >= 3) unlock('triple_mode');
    if (this.noHintWins >= 25) unlock('no_hints_25');
    if (this.noHintWins >= 50) unlock('no_hints_50');
    if (this.stats.currentStreak >= 100) unlock('streak_100');
    if (this.stats.gamesPlayed >= 1000) unlock('games_1000');
    if (this.themeWins.size >= THEMES.length) unlock('all_themes_win');
    if (this.firstGuessStreak >= 3) unlock('perfect_streak_3');
    if (this.dailyCount >= 100) unlock('daily_100');
    if (this.dailyStreak >= 14) unlock('daily_streak_14');

    // Zen
    if (this.gameMode === 'zen' && this.won) {
      unlock('zen_win');
      if (this.zenWins >= 10) unlock('zen_10');
      if (gc <= 2) unlock('zen_first_try');
    }

    // Score-based
    if (this.won) {
      const score = Math.round((7 - gc) * 100 + Math.max(0, 300 - this.elapsed));
      if (score >= 500) unlock('score_500');
      if (score >= 600) unlock('score_600');
      if (this.elapsed < 10) unlock('fast_10');
    }
  }

  // --- UI REFRESH ---
  private refreshTitle() {
    const e = this.panelEntities['title'];
    if (!e) return;
    this.setText(e, 'streak-info', `Streak: ${this.stats.currentStreak} | Best: ${this.stats.maxStreak}`);
    const title = TITLES[Math.min(Math.floor((this.stats.level - 1) / 2.5), TITLES.length - 1)];
    this.setText(e, 'level-info', `Level ${this.stats.level} - ${title}`);
  }

  private refreshStats() {
    const e = this.panelEntities['stats'];
    if (!e) return;
    this.setText(e, 'stat-played', String(this.stats.gamesPlayed));
    const pct = this.stats.gamesPlayed > 0 ? Math.round(this.stats.gamesWon / this.stats.gamesPlayed * 100) : 0;
    this.setText(e, 'stat-winpct', String(pct));
    this.setText(e, 'stat-streak', String(this.stats.currentStreak));
    this.setText(e, 'stat-best', String(this.stats.maxStreak));
    const maxDist = Math.max(1, ...this.stats.distribution);
    for (let i = 0; i < 6; i++) {
      const val = this.stats.distribution[i];
      const barLen = Math.round(val / maxDist * 20);
      const bar = '#'.repeat(barLen).padEnd(20, '-');
      this.setText(e, `dist-${i + 1}`, `${i + 1}: ${bar}  ${val}`);
    }
    const avgGuesses = this.stats.gamesWon > 0 ? (this.stats.totalGuesses / this.stats.gamesWon).toFixed(1) : '--';
    const avgTime = this.stats.gamesWon > 0 ? Math.round(this.stats.totalTime / this.stats.gamesWon) : 0;
    this.setText(e, 'stat-avg', `Avg guesses: ${avgGuesses}`);
    this.setText(e, 'stat-time', `Avg time: ${avgTime > 0 ? avgTime + 's' : '--'}`);
    // Mode records
    const allModes: GameMode[] = ['random', 'daily', 'speed', 'blitz', 'hard', 'blind', 'streak', 'practice', 'zen'];
    const modeLabels: Record<string, string> = { random: 'Random', daily: 'Daily', speed: 'Speed', blitz: 'Blitz', hard: 'Hard', blind: 'Blind', streak: 'Streak', practice: 'Practice', zen: 'Zen' };
    allModes.forEach((mode, i) => {
      const ms = this.modeStats[mode];
      if (ms && ms.played > 0) {
        const pct = Math.round(ms.won / ms.played * 100);
        const best = ms.bestGuesses > 0 ? ` Best:${ms.bestGuesses}/6` : '';
        this.setText(e, `mode-stat-${i}`, `${modeLabels[mode]}: ${ms.won}/${ms.played} (${pct}%)${best}`);
      } else {
        this.setText(e, `mode-stat-${i}`, `${modeLabels[mode]}: --`);
      }
    });
  }

  private refreshAchievements() {
    const e = this.panelEntities['ach'];
    if (!e) return;
    this.setText(e, 'ach-count', `${this.unlockedAch.size} / ${ACHIEVEMENTS_DEF.length}`);
    const start = this.achPage * 15;
    const totalPages = Math.ceil(ACHIEVEMENTS_DEF.length / 15);
    this.setText(e, 'page-label', `${this.achPage + 1}/${totalPages}`);
    for (let i = 0; i < 15; i++) {
      const idx = start + i;
      if (idx < ACHIEVEMENTS_DEF.length) {
        const a = ACHIEVEMENTS_DEF[idx];
        const mark = this.unlockedAch.has(a.id) ? '[OK] ' : '[ ] ';
        this.setText(e, `ach-${i}`, `${mark}${a.name} - ${a.desc}`);
        this.setProps(e, `ach-${i}`, { color: this.unlockedAch.has(a.id) ? '#00ff88' : '#666688' });
      } else {
        this.setText(e, `ach-${i}`, '');
      }
    }
  }

  private refreshLeaderboard() {
    const e = this.panelEntities['lb'];
    if (!e) return;
    for (let i = 0; i < 10; i++) {
      if (i < this.leaderboard.length) {
        const lb = this.leaderboard[i];
        this.setText(e, `lb-${i}`, `${i + 1}. ${lb.score}pts  ${lb.guesses}/6  ${lb.mode}  ${lb.time}s  ${lb.date}`);
      } else {
        this.setText(e, `lb-${i}`, `${i + 1}. ---`);
      }
    }
  }

  private refreshHistory() {
    const e = this.panelEntities['history'];
    if (!e) return;
    const totalPages = Math.max(1, Math.ceil(this.history.length / 15));
    this.setText(e, 'hist-page', `${this.historyPage + 1}/${totalPages}`);
    const start = this.historyPage * 15;
    for (let i = 0; i < 15; i++) {
      const idx = start + i;
      if (idx < this.history.length) {
        const h = this.history[idx];
        const icon = h.won ? '+' : 'x';
        const hint = h.hints > 0 ? ` H${h.hints}` : '';
        this.setText(e, `hist-${i}`, `${icon} ${h.word} ${h.guesses}/6 ${h.mode} ${h.time}s${hint} ${h.date}`);
        this.setProps(e, `hist-${i}`, { color: h.won ? '#00ff88' : '#ff4444' });
      } else {
        this.setText(e, `hist-${i}`, '--');
        this.setProps(e, `hist-${i}`, { color: '#88aacc' });
      }
    }
  }

  private refreshSettings() {
    const e = this.panelEntities['settings'];
    if (!e) return;
    this.setText(e, 'master-vol', String(audio.volumes.master));
    this.setText(e, 'sfx-vol', String(audio.volumes.sfx));
    this.setText(e, 'music-vol', String(audio.volumes.music));
    this.setText(e, 'theme-name', THEMES[this.themeIdx].name);
  }

  private adjustVolume(type: 'master' | 'sfx' | 'music', delta: number) {
    audio.volumes[type] = Math.max(0, Math.min(100, audio.volumes[type] + delta));
    audio.applyVolumes();
    saveVolumes(audio.volumes);
    this.refreshSettings();
  }

  private cycleTheme(dir: number) {
    this.themeIdx = (this.themeIdx + dir + THEMES.length) % THEMES.length;
    saveThemeIdx(this.themeIdx);
    this.applyTheme();
    this.refreshSettings();
  }

  private updateHUD() {
    const e = this.panelEntities['hud'];
    if (!e) return;
    const modeNames: Record<GameMode, string> = { random: 'RANDOM', daily: 'DAILY', speed: 'SPEED', blitz: 'BLITZ', streak: 'STREAK', hard: 'HARD', blind: 'BLIND', practice: 'PRACTICE', zen: 'ZEN' };
    this.setText(e, 'mode-label', modeNames[this.gameMode]);
    this.setText(e, 'attempt-label', `Row ${this.currentRow + 1}/6`);
    this.setText(e, 'streak-label', `x${this.stats.currentStreak}`);
    this.setText(e, 'words-left', this.guesses.length > 0 ? `${this.possibleWordsCount} left` : `~${ANSWERS.length}`);
    if (this.gameMode === 'speed' || this.gameMode === 'blitz') {
      const mins = Math.floor(this.speedTimeLeft / 60);
      const secs = Math.floor(this.speedTimeLeft % 60);
      this.setText(e, 'timer-label', `${mins}:${secs.toString().padStart(2, '0')}`);
    } else {
      const elapsed = (Date.now() - this.startTime) / 1000;
      const mins = Math.floor(elapsed / 60);
      const secs = Math.floor(elapsed % 60);
      this.setText(e, 'timer-label', `${mins}:${secs.toString().padStart(2, '0')}`);
    }
  }

  // --- TOAST SYSTEM ---
  private showToast(msg: string) {
    this.toastQueue.push(msg);
    if (!this.toastVisible) this.displayNextToast();
  }

  private displayNextToast() {
    if (this.toastQueue.length === 0) { this.toastVisible = false; this.updateVisibility(); return; }
    const msg = this.toastQueue.shift()!;
    this.toastVisible = true;
    this.toastTimer = 2.0;
    const e = this.panelEntities['toast'];
    if (e) this.setText(e, 'toast-text', msg);
    this.updateVisibility();
  }

  // --- ENVIRONMENT ---
  private applyTheme() {
    const theme = THEMES[this.themeIdx];
    const gridColor = new Color(theme.grid);
    this.envMeshes.forEach(m => {
      if (m.userData.isGrid) {
        const mat = (m as any).material;
        if (Array.isArray(mat)) mat.forEach((m2: any) => m2.color?.set(gridColor));
        else if (mat?.color) mat.color.set(gridColor);
      }
    });
    this.decorations.forEach(g => {
      g.children.forEach(c => {
        if (c instanceof LineSegments) { (c.material as LineBasicMaterial).color.set(gridColor); }
      });
    });
  }

  // --- UPDATE LOOP ---
  update(delta: number) {
    // Countdown
    if (this.countdownActive) {
      this.countdownTimer += delta;
      if (this.countdownTimer >= 1.0) {
        this.countdownTimer = 0;
        this.countdownValue--;
        if (this.countdownValue <= 0) {
          this.countdownActive = false;
          audio.countdownGo();
          this.startGame(this.pendingMode);
        } else {
          const e = this.panelEntities['countdown'];
          if (e) this.setText(e, 'count-text', String(this.countdownValue));
          audio.countdown();
        }
      }
    }

    // Reveal animation
    if (this.isRevealing) {
      this.revealTimer += delta;
      if (this.revealTimer >= 0.25 && this.revealIdx < this.revealQueue.length) {
        this.revealTimer = 0;
        const r = this.revealQueue[this.revealIdx];
        const theme = THEMES[this.themeIdx];
        // In blind mode, all cells show the same gray color
        const isBlind = this.gameMode === 'blind';
        const bgColor = isBlind ? '#444455' : (r.result === 'correct' ? theme.correct : r.result === 'present' ? theme.present : theme.absent);
        const borderColor = isBlind ? '#555566' : (r.result === 'correct' ? '#00ff88' : r.result === 'present' ? '#ffee00' : '#555566');
        const e = this.panelEntities['board'];
        if (e) {
          this.setProps(e, `c${r.row}${r.col}`, { text: r.letter, backgroundColor: bgColor, borderColor });
        }
        if (!isBlind) {
          if (r.result === 'correct') audio.revealCorrect(this.revealIdx);
          else if (r.result === 'present') audio.revealPresent(this.revealIdx);
          else audio.revealAbsent();
          if (r.result === 'correct') {
            spawnParticles((r.col - 2) * 0.16, 1.85 - r.row * 0.14, -2.0, 0x00ff88, 8);
          }
        } else {
          audio.revealAbsent();
        }
        this.revealIdx++;
        if (this.revealIdx >= this.revealQueue.length) {
          setTimeout(() => this.finishReveal(), 300);
        }
      }
    }

    // Timer modes (speed & blitz)
    if (this.screen === 'playing' && (this.gameMode === 'speed' || this.gameMode === 'blitz') && !this.gameOver && !this.isRevealing) {
      this.speedTimeLeft -= delta;
      if (this.speedTimeLeft <= 0) {
        this.speedTimeLeft = 0;
        this.won = false;
        this.gameOver = true;
        this.onGameEnd();
      }
    }

    if (this.screen === 'playing' && !this.gameOver) { this.updateHUD(); }

    // Toast timer
    if (this.toastVisible) {
      this.toastTimer -= delta;
      if (this.toastTimer <= 0) this.displayNextToast();
    }

    // Shake animation
    if (this.shakeTimer > 0 && this.shakeEntity?.object3D) {
      this.shakeTimer -= delta;
      const intensity = Math.sin(this.shakeTimer * 40) * 0.02 * Math.max(0, this.shakeTimer / 0.4);
      this.shakeEntity.object3D.position.x = this.shakeOrigX + intensity;
      if (this.shakeTimer <= 0) {
        this.shakeEntity.object3D.position.x = this.shakeOrigX;
        this.shakeEntity = null;
      }
    }

    // Animate decorations
    const time = Date.now() * 0.001;
    this.decorations.forEach((g, i) => {
      g.rotation.y += delta * 0.3;
      g.rotation.x += delta * 0.15;
      g.position.y += Math.sin(time * 0.5 + i * 1.2) * delta * 0.05;
    });

    this.ambientParticles.forEach((p, i) => {
      p.position.y += Math.sin(time * 0.3 + i * 0.7) * delta * 0.02;
      (p.material as MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 0.5 + i * 1.1) * 0.15;
    });

    updateParticles(delta);
  }
}


// --- ENTRY POINT ---
async function main() {
  const container = document.getElementById('app') as HTMLDivElement;
  const world = await World.create(container, {
    xr: { offer: 'once' },
    render: { defaultLighting: false },
    features: {
      locomotion: true,
    },
  });
  const scene = world.scene;

  // Theme from storage
  const themeIdx = loadThemeIdx();
  const theme = THEMES[themeIdx];

  // --- ENVIRONMENT ---
  // Floor grid
  const grid = new GridHelper(40, 40, new Color(theme.grid), new Color(theme.grid));
  (grid.material as any).opacity = 0.3;
  (grid.material as any).transparent = true;
  grid.position.y = 0;
  grid.userData.isGrid = true;
  scene.add(grid);

  // Fog
  scene.fog = new FogExp2(new Color(theme.fog).getHex(), 0.04);
  scene.background = new Color(theme.bg);

  // Ambient + directional lighting
  const ambient = new AmbientLight(0x222244, 0.6);
  scene.add(ambient);
  const dirLight = new DirectionalLight(0xffffff, 0.4);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // Accent point lights
  const accentColors = [0x00ccff, 0x00ffaa, 0xff44aa, 0xffcc00, 0xaa44ff, 0xff8844];
  accentColors.forEach((color, i) => {
    const light = new PointLight(color, 0.5, 15);
    const angle = (i / accentColors.length) * Math.PI * 2;
    light.position.set(Math.cos(angle) * 8, 3, Math.sin(angle) * 8);
    scene.add(light);
  });

  // Holodeck walls — wireframe boxes
  const wallPositions: [number, number, number, number, number, number][] = [
    [0, 3, -12, 24, 6, 0.1],
    [0, 3, 12, 24, 6, 0.1],
    [-12, 3, 0, 0.1, 6, 24],
    [12, 3, 0, 0.1, 6, 24],
  ];
  wallPositions.forEach(([x, y, z, w, h, d]) => {
    const geo = new BoxGeometry(w, h, d);
    const edges = new EdgesGeometry(geo);
    const line = new LineSegments(edges, new LineBasicMaterial({ color: new Color(theme.grid), transparent: true, opacity: 0.15 }));
    line.position.set(x, y, z);
    scene.add(line);
  });

  // Floating geometric decorations
  const envMeshes: Mesh[] = [grid as unknown as Mesh];
  const decorations: Group[] = [];
  const decoGeometries = [
    new OctahedronGeometry(0.3),
    new IcosahedronGeometry(0.25),
    new TorusGeometry(0.2, 0.05, 8, 16),
    new ConeGeometry(0.15, 0.4, 6),
    new CylinderGeometry(0.05, 0.05, 0.5, 8),
  ];
  for (let i = 0; i < 12; i++) {
    const group = new Group();
    const geoIdx = i % decoGeometries.length;
    const edges = new EdgesGeometry(decoGeometries[geoIdx]);
    const line = new LineSegments(edges, new LineBasicMaterial({
      color: new Color(theme.grid), transparent: true, opacity: 0.3, blending: AdditiveBlending,
    }));
    group.add(line);
    const angle = (i / 12) * Math.PI * 2;
    const radius = 5 + Math.random() * 5;
    group.position.set(Math.cos(angle) * radius, 1.5 + Math.random() * 3, Math.sin(angle) * radius);
    group.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(group);
    decorations.push(group);
  }

  // Ambient floating particles
  const ambientParticles: Mesh[] = [];
  for (let i = 0; i < 40; i++) {
    const pGeo = new SphereGeometry(0.015, 4, 4);
    const pMat = new MeshBasicMaterial({ color: new Color(theme.accent), transparent: true, opacity: 0.3, blending: AdditiveBlending });
    const pMesh = new Mesh(pGeo, pMat);
    pMesh.position.set((Math.random() - 0.5) * 16, Math.random() * 4 + 0.5, (Math.random() - 0.5) * 16);
    scene.add(pMesh);
    ambientParticles.push(pMesh);
  }

  // Init particle pool
  createParticlePool(scene);

  // --- PANEL ENTITIES ---

  interface PanelDef {
    config: string;
    pos: [number, number, number];
    scale: number;
    follower?: boolean;
    screenSpace?: boolean;
  }

  const panelDefs: PanelDef[] = [
    // Title - screen space overlay
    { config: './ui/title.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Mode select - screen space
    { config: './ui/modeselect.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Board - world space in front of player
    { config: './ui/board.json', pos: [0, 1.9, -2.0], scale: 1.0, screenSpace: true },
    // Keyboard - below board
    { config: './ui/keyboard.json', pos: [0, 1.0, -1.8], scale: 1.0, screenSpace: true },
    // HUD - head-locked
    { config: './ui/hud.json', pos: [0, 0.22, -0.6], scale: 1.0, follower: true },
    // Game over - screen space
    { config: './ui/gameover.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Stats - screen space
    { config: './ui/stats.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Achievements - screen space
    { config: './ui/achievements.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Settings - screen space
    { config: './ui/settings.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Help - screen space
    { config: './ui/help.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Toast - head-locked
    { config: './ui/toast.json', pos: [0, 0.12, -0.6], scale: 1.0, follower: true },
    // Pause - screen space
    { config: './ui/pause.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Leaderboard - screen space
    { config: './ui/leaderboard.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
    // Countdown - screen space
    { config: './ui/countdown.json', pos: [0, 1.6, -2.0], scale: 1.0, screenSpace: true },
    // History - screen space
    { config: './ui/history.json', pos: [0, 1.6, -2.5], scale: 1.0, screenSpace: true },
  ];

  panelDefs.forEach(def => {
    const entity = world.createTransformEntity();
    entity.addComponent(PanelUI, { config: def.config });
    if (def.follower) {
      entity.addComponent(Follower);
      const offsetView = entity.getVectorView(Follower, 'offsetPosition');
      offsetView[0] = def.pos[0];
      offsetView[1] = def.pos[1];
      offsetView[2] = def.pos[2];
    } else if (def.screenSpace) {
      entity.addComponent(ScreenSpace);
    }
    if (entity.object3D) {
      if (!def.follower) {
        entity.object3D.position.set(def.pos[0], def.pos[1], def.pos[2]);
      }
      if (def.scale !== 1.0) {
        entity.object3D.scale.setScalar(def.scale);
      }
    }
  });

  // Register the system
  world.registerSystem(NeonCipherSystem);

  // Inject environment references into system
  const cipherSystem = world.getSystem(NeonCipherSystem);
  if (cipherSystem) {
    (cipherSystem as any).envMeshes = envMeshes;
    (cipherSystem as any).decorations = decorations;
    (cipherSystem as any).ambientParticles = ambientParticles;
  }
}

main().catch(console.error);
