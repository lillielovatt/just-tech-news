const express = require("express");
const routes = require("./controllers"); //automatically uses index.js if not otherwise specified
const sequelize = require("./config/connection");
const path = require("path");
const exphbs = require("express-handlebars");
const helpers = require("./utils/helper");
const hbs = exphbs.create({ helpers });
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;
const sess = {
    secret: process.env.DB_SECRET,
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// middleware that takes all contents of a folder and serves them as static assets
// useful for front-end specific files like images/stylesheets/JS files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log("Now listening!"));
});
// we import connection to sequelize from config/connection.js
// we use sync method to establish connection to db, "sync" means Sequelize takes models and connects them to assoc DB tables
// if it doesn't find a table, it'll create it for you

// force:false is default, but if force:true, it drops and re-creates all of DB tables on startup (like DROP TABLE IF EXISTS)
// good when we need to make changes to Sequelize models, as DB needs to know something has changed
