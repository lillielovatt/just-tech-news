const router = require("express").Router();

const apiRoutes = require("./api");

// we are collecting the packaged group of API endpoints and prefixing them all with path "/api"
router.use("/api", apiRoutes);

// if we make a request to any endpoint that doesn't exist, we receive 404 error
router.use((req,res)=>{
    res.status(404).send();
});

module.exports=router;
// now when we import routes to server.js, they'll all be packaged and ready to go in this ONE FILE