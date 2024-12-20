const express = require('express');
const sequelize = require('./db.js'); // Sequelize instance
const EventRoutes = require('./routes/eventRoutes.js'); // Event routes
const UserRoutes = require('./routes/userRoutes.js'); // User routes
const ReviewRoutes = require('./routes/reviewRoutes.js'); // Review routes
const session = require('express-session')
const store = new session.MemoryStore();
const path = require('path');

class Server {
    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.setupRoutes();
        this.syncDatabase();
        this.setUpSession();
    }

    // Configure middleware
    configureMiddleware() {
        this.app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files
        this.app.use(express.json({ limit: '10mb' })); // Parse incoming JSON
        this.setUpSession()
    }

    // Set up routes
    setupRoutes() {
        this.app.use('/api/', EventRoutes); // Routes for event management
        this.app.use('/api/', UserRoutes); // Routes for user management
        this.app.use('/api/', ReviewRoutes); // Routes for review management
    }

    // Synchronize database models
    async syncDatabase() {
        try {
            await sequelize.sync({ force: false });
            console.log('Database synchronized successfully.');
        } catch (error) {
            console.error('Error synchronizing the database:', error);
        }
    }

    // Set up Session

    setUpSession() {
        this.app.use(session({
            secret: "some secret",
            cookie: {
                maxAge: 1000 * 60 * 60 * 24
            },
            saveUninitialized: false,
            resave: false,
            store: store,
        }))
    }

    // Start the server
    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    }
}

// Initialize and start the server
console.log('Starting server...');
const server = new Server();
server.start();
