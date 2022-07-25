// 5 routes that will work with User model to perform CRUD - create, read, update, delete

const router = require("express").Router();
const { rmSync } = require("fs");
const { User } = require("../../models");

// GET /api/users
router.get("/", (req, res) => {
    // access our User model and run .findAll() method, equivalent to "SELECT * FROM users"
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// GET /api/users/1
router.get("/:id", (req, res) => {
    // findOne method, equivalent to "SELECT * FROM users WHERE id = 1"
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// POST /api/users
router.post("/", (req, res) => {
    // expects {username:'Lernantino',email:'lernantino@gmail.com',password:'password2234'}
    User.create({
        // pass in key/value pairs where keys are what's defined in User modle, and values are what we get from req.body
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// verify user
router.post("/login", (req, res) => {
    // expects  {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: "No user with that email address!" });
                return;
            }

            // verify user
            const validPassword = dbUserData.checkPassword(req.body.password);
            if(!validPassword){
                res.status(400).json({message:"Incorrect password!"});
                return;
            }
            res.json({user:dbUserData,message:"You are now logged in!"});
        })
})

// PUT /api/users/1
router.put("/:id", (req, res) => {
    // expects {username:'Lernantino',email:'lernantino@gmail.com',password:'password2234'}

    //pass in req.body to provide new data we want to us in the update
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id //use this to indicate where exactly we want new data to be used
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) { //why in this instance do we look for [0]?
                res.status(400).json({ message: "No user found with this id" });
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// DELETE /api/users/1
router.delete("/:id", (req, res) => {

    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

module.exports = router;