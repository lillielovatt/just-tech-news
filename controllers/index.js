const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require('./home-routes.js');

// we are collecting the packaged group of API endpoints and prefixing them all with path "/api"
router.use("/api", apiRoutes);
router.use('/', homeRoutes);

// if we make a request to any endpoint that doesn't exist, we receive 404 error
router.use((req, res) => {
    res.status(404).send();
});

module.exports = router;
// now when we import routes to server.js, they'll all be packaged and ready to go in this ONE FILE