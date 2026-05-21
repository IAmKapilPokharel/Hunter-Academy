const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'super-secret-hunter-academy-key-2026';

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    
    // Core users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        level INTEGER DEFAULT 1,
        exp INTEGER DEFAULT 0,
        rank TEXT DEFAULT 'D',
        gold INTEGER DEFAULT 0,
        class TEXT DEFAULT 'Saber',
        quests_completed INTEGER DEFAULT 0
      )
    `);

    // Quests table
    db.run(`
      CREATE TABLE IF NOT EXISTS quests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        rank TEXT,
        location TEXT,
        reward_gold INTEGER,
        reward_exp INTEGER,
        type TEXT
      )
    `, () => {
      // Seed quests if empty
      db.get("SELECT COUNT(*) AS count FROM quests", (err, row) => {
        if (row && row.count === 0) {
          const initialQuests = [
            ['Subjugate the Shadow Dragon', 'S', 'Mount Igneous', 50000, 10000, 'Combat'],
            ['Retrieve the Lost Artifact', 'A', 'Ancient Ruins', 15000, 3000, 'Exploration'],
            ['Clear the Goblin Camp', 'C', 'Whispering Woods', 2000, 500, 'Combat'],
            ['Escort the Merchant Guild', 'B', 'Trade Route 4', 5000, 1200, 'Escort'],
            ['Investigate Mana Anomaly', 'A', 'Crystal Caves', 20000, 4000, 'Investigation'],
            ['Hunt the Dire Wolves', 'D', 'Northern Plains', 800, 200, 'Combat']
          ];
          const stmt = db.prepare('INSERT INTO quests (title, rank, location, reward_gold, reward_exp, type) VALUES (?, ?, ?, ?, ?, ?)');
          initialQuests.forEach(q => stmt.run(q));
          stmt.finalize();
        }
      });
    });

    // Achievements table
    db.run(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        total_required INTEGER,
        icon TEXT
      )
    `, () => {
      // Seed achievements
      db.get("SELECT COUNT(*) AS count FROM achievements", (err, row) => {
        if (row && row.count === 0) {
          const initialAchv = [
            ['Dragon Slayer', 'Defeat your first S-Rank Dragon.', 1, 'dragon'],
            ['Shadow Walker', 'Complete 50 stealth missions undetected.', 50, 'stealth'],
            ['Guild Master', 'Reach Guild Contribution S-Tier.', 1, 'guild'],
            ['Abyssal Conqueror', 'Clear the Abyssal Labyrinth.', 100, 'abyss'],
            ['Master Blacksmith', 'Craft a Legendary Weapon.', 10, 'craft'],
            ['Arena Champion', 'Win 100 matches in the Grand Colosseum.', 100, 'arena'],
            ['Lore Keeper', 'Collect all ancient academy texts.', 20, 'book'],
            ['Titan Fall', 'Defeat a Titan-class monster solo.', 1, 'titan']
          ];
          const stmt = db.prepare('INSERT INTO achievements (title, description, total_required, icon) VALUES (?, ?, ?, ?)');
          initialAchv.forEach(a => stmt.run(a));
          stmt.finalize();
        }
      });
    });

    // User Achievements linking table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        user_id INTEGER,
        achievement_id INTEGER,
        progress INTEGER DEFAULT 0,
        unlocked_at TEXT,
        PRIMARY KEY (user_id, achievement_id)
      )
    `);
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Authentication Endpoints ---

app.post('/api/register', (req, res) => {
  const { username, password, playerClass } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

  const hash = bcrypt.hashSync(password, 10);
  const pClass = playerClass || 'Saber';

  db.run('INSERT INTO users (username, password_hash, class) VALUES (?, ?, ?)', [username, hash, pClass], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Username already taken.' });
      }
      return res.status(500).json({ error: 'Database error.' });
    }
    
    const token = jwt.sign({ id: this.lastID, username, class: pClass }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ message: 'User created successfully', token, user: { username, class: pClass, level: 1, exp: 0, rank: 'D', gold: 0, quests_completed: 0 } });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials.' });

    const isValid = bcrypt.compareSync(password, row.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ id: row.id, username: row.username, class: row.class }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { 
        username: row.username, 
        class: row.class, 
        level: row.level, 
        exp: row.exp || 0,
        rank: row.rank, 
        gold: row.gold,
        quests_completed: row.quests_completed
      } 
    });
  });
});

// --- Game API Endpoints ---

app.get('/api/me', authenticateToken, (req, res) => {
  db.get('SELECT username, class, level, exp, rank, gold, quests_completed FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'User not found' });
    row.exp = row.exp || 0; // handle null
    res.json({ user: row });
  });
});

app.get('/api/quests', authenticateToken, (req, res) => {
  db.all('SELECT * FROM quests', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.get('/api/achievements', authenticateToken, (req, res) => {
  // Returns all achievements and the user's progress for them
  const query = `
    SELECT a.*, ua.progress, ua.unlocked_at
    FROM achievements a
    LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
  `;
  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    const formatted = rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      icon: r.icon,
      total: r.total_required,
      progress: r.progress || 0,
      unlocked: !!r.unlocked_at,
      date: r.unlocked_at
    }));
    res.json(formatted);
  });
});

app.post('/api/quests/complete', authenticateToken, (req, res) => {
  const { questId } = req.body;
  if (!questId) return res.status(400).json({ error: 'Missing questId' });

  // 1. Fetch quest details (secure reward validation)
  db.get('SELECT * FROM quests WHERE id = ?', [questId], (err, quest) => {
    if (err || !quest) return res.status(404).json({ error: 'Quest not found' });

    // 2. Fetch user
    db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, userRow) => {
      if (err || !userRow) return res.status(404).json({ error: 'User not found' });

      let newGold = userRow.gold + quest.reward_gold;
      let newExp = (userRow.exp || 0) + quest.reward_exp;
      let newQuests = userRow.quests_completed + 1;
      let newLevel = userRow.level;
      let leveledUp = false;

      // Proper EXP leveling system
      let expNeeded = newLevel * 1000; // e.g., Lvl 1 needs 1000 exp
      while (newExp >= expNeeded) {
        newExp -= expNeeded;
        newLevel += 1;
        expNeeded = newLevel * 1000;
        leveledUp = true;
      }

      // Update user
      db.run('UPDATE users SET gold = ?, exp = ?, quests_completed = ?, level = ? WHERE id = ?', 
        [newGold, newExp, newQuests, newLevel, req.user.id], 
        function(err) {
          if (err) return res.status(500).json({ error: 'Failed to update stats' });
          
          if (leveledUp) {
             io.emit('systemMessage', `${userRow.username} has reached Level ${newLevel}!`);
          }

          // Random chance to progress an achievement (just to simulate logic)
          // We'll increment progress on achievement ID 6 (Arena Champion) randomly for demo
          db.run(`
            INSERT INTO user_achievements (user_id, achievement_id, progress)
            VALUES (?, 6, 1)
            ON CONFLICT(user_id, achievement_id) DO UPDATE SET progress = progress + 1
          `, [req.user.id]);

          res.json({ 
            message: 'Quest completed successfully!',
            user: {
              username: userRow.username,
              class: userRow.class,
              level: newLevel,
              exp: newExp,
              rank: userRow.rank,
              gold: newGold,
              quests_completed: newQuests
            },
            reward: {
              gold: quest.reward_gold,
              exp: quest.reward_exp
            }
          });
      });
    });
  });
});

app.get('/api/rankings', (req, res) => {
  db.all('SELECT username as name, level, class, gold as score FROM users ORDER BY level DESC, gold DESC LIMIT 10', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch rankings' });
    
    const rankedData = rows.map((r, i) => ({
      ...r,
      rank: i + 1,
      trend: ['up', 'down', 'same'][Math.floor(Math.random() * 3)]
    }));
    
    res.json(rankedData);
  });
});

// --- Rank Promotion Endpoint ---
app.post('/api/user/promote', authenticateToken, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, userRow) => {
    if (err || !userRow) return res.status(404).json({ error: 'User not found' });

    const currentRank = userRow.rank || 'D';
    const rankOrder = ['D', 'C', 'B', 'A', 'S', 'SS'];
    const currentIndex = rankOrder.indexOf(currentRank);
    
    if (currentIndex === -1 || currentIndex === rankOrder.length - 1) {
      return res.status(400).json({ error: 'Cannot advance rank further.' });
    }

    const nextRank = rankOrder[currentIndex + 1];
    
    // Requirements definition
    const requirements = {
      C: { level: 5, gold: 2000, quests: 2 },
      B: { level: 10, gold: 5000, quests: 5 },
      A: { level: 15, gold: 12000, quests: 10 },
      S: { level: 25, gold: 25000, quests: 20 },
      SS: { level: 40, gold: 60000, quests: 40 }
    };

    const reqs = requirements[nextRank];
    if (!reqs) return res.status(400).json({ error: 'Invalid promotion target' });

    if (userRow.level < reqs.level) {
      return res.status(400).json({ error: `Requires Level ${reqs.level}. Current: ${userRow.level}` });
    }
    if (userRow.gold < reqs.gold) {
      return res.status(400).json({ error: `Requires ${reqs.gold} Gold. Current: ${userRow.gold}` });
    }
    if (userRow.quests_completed < reqs.quests) {
      return res.status(400).json({ error: `Requires ${reqs.quests} Quests Completed. Current: ${userRow.quests_completed}` });
    }

    // Deduct gold and advance rank
    const newGold = userRow.gold - reqs.gold;

    db.run('UPDATE users SET rank = ?, gold = ? WHERE id = ?', [nextRank, newGold, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: 'Failed to advance rank.' });

      io.emit('systemMessage', `🎉 ${userRow.username} has advanced to Rank ${nextRank}!`);

      res.json({
        message: `Advanced to Rank ${nextRank}!`,
        user: {
          username: userRow.username,
          class: userRow.class,
          level: userRow.level,
          exp: userRow.exp || 0,
          rank: nextRank,
          gold: newGold,
          quests_completed: userRow.quests_completed
        }
      });
    });
  });
});

// --- Socket.io Real-time Multiplayer logic ---
let onlinePlayers = 0;

io.on('connection', (socket) => {
  onlinePlayers++;
  console.log(`Player connected. Online: ${onlinePlayers}`);
  
  io.emit('playerCount', onlinePlayers);

  socket.on('disconnect', () => {
    onlinePlayers--;
    console.log(`Player disconnected. Online: ${onlinePlayers}`);
    io.emit('playerCount', onlinePlayers);
  });
});

server.listen(PORT, () => {
  console.log(`Hunter Academy Server running on http://localhost:${PORT}`);
});
