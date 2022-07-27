const express = require("express");
const routes = require("./routes"); //automatically uses index.js if not otherwise specified
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
