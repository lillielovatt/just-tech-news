const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// create User model
class User extends Model { 
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw,this.password);
    }
}

// define table columns, configs
User.init(
    {
        // define an id column
        id: {
            // use special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // equivalent of SQL's "NOT NULL" optin
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4] //pw must be at least 4 char long
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },

        // pass in our import sequelize connection (direct connection to our DB)
        sequelize,
        // dont automatically create createdAt/updatedAt timestamp fields, cuz we don't need them
        timestamps: false,
        // don't pluralize name of DB table
        freezeTableName: true,
        // user underscores instead of camel-casing, so (my_var not myVar)
        underscored: true,
        // make it so our modal name stays lowercase in the DB
        modelName: 'user'
    }
);

module.exports = User;