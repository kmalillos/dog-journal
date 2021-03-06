// DEPENDENCIES
// =============================================================================

// -- require sequelize in models
var db = require("../models");

// -- require for authentication
var passport = require("../config/passport");

// ROUTING
// =============================================================================

module.exports = function (app) {

    // *** FOR AUTHENTICATION ***
    // =============================================================================

    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
        // So we're sending the user back the route to the members page because the redirect will happen on the front end
        // They won't get this or even be able to access this page if they aren't authed
        res.json("/home");
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function (req, res) {
        console.log(req.body);
        db.User.create({
            email: req.body.email,
            password: req.body.password
        }).then(function () {
            res.redirect(307, "/api/login");
        }).catch(function (err) {
            console.log(err);
            res.json(err);
            // res.status(422).json(err.errors[0].message);
        });
    });

    // Route for logging user out
    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        }
        else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });


    // PET INFO SECTION
    // =============================================================================
    app.get("/api/petinfo", function (req, res) {
        db.PetInfo.findAll({})
            .then(function (petData) {
                res.json(petData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.post("/api/petinfo", function (req, res) {
        db.PetInfo.create({
            petName: req.body.petName,
            breed: req.body.breed,
            weight: req.body.weight,
            age: req.body.age
        })
            .then(function (petinfoCreatedData) {
                // .dataValues = specifies what data to console.log
                console.log("New pet info created", petinfoCreatedData.dataValues);
                res.json(petinfoCreatedData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })

    });

    app.delete("/api/petinfo/:id", function(req, res) {
        db.PetInfo.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            // .dataValues = specifies what data to console.log
            console.log("Deleted data", data.dataValues)
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.json(err)
        })
    });


    // VET INFO 
    // =============================================================================
    app.get("/api/vet", function (req, res) {
        db.VetInfo.findAll({})
            .then(function (vetData) {
                res.json(vetData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.post("/api/vet", function (req, res) {
        db.VetInfo.create({
            hospital: req.body.hospital,
            vetName: req.body.vetName,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address
        })
            .then(function (vetinfoCreatedData) {
                // .dataValues = specifies what data to console.log
                console.log("New vet info created", vetinfoCreatedData.dataValues);
                res.json(vetinfoCreatedData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            });
    });

    
    app.delete("/api/vet/:id", function(req, res) {
        db.VetInfo.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            // .dataValues = specifies what data to console.log
            console.log("Deleted data", data.dataValues)
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.json(err)
        })
    });

    // VACCINATIONS
    // =============================================================================
    app.get("/api/vaccines", function (req, res) {
        db.Vaccinations.findAll({})
            .then(function (vaccinationsData) {
                res.json(vaccinationsData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.post("/api/vaccines", function (req, res) {
        db.Vaccinations.create({
            vaccineName: req.body.vaccineName,
            vaccineDate: req.body.vaccineDate,
            expires: req.body.expires
        })
            .then(function (vaccinationsCreatedData) {
                // .dataValues = specifies what data to console.log
                console.log("New vaccination info created", vaccinationsCreatedData.dataValues);
                res.json(vaccinationsCreatedData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.delete("/api/vaccines/:id", function(req, res) {
        db.Vaccinations.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            // .dataValues = specifies what data to console.log
            console.log("Deleted data", data.dataValues)
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.json(err)
        })
    });


    // ACTIVITY SECTION
    // =============================================================================
    app.get("/api/activity", function (req, res) {
        db.ActivityTracker.findAll({})
            .then(function (activityData) {
                res.json(activityData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.post("/api/activity", function (req, res) {
        db.ActivityTracker.create({
            activityType: req.body.activityType,
            startOrStop: req.body.startOrStop,
            // startTime: req.body.startTime,
            // endTime: req.body.endTime,
            notes: req.body.notes
        })
            .then(function (newActivityData) {
                console.log("New activity info created", newActivityData.dataValues);
                res.json(newActivityData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.delete("/api/activity/:id", function(req, res) {
        db.ActivityTracker.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            // .dataValues = specifies what data to console.log
            console.log("Deleted data", data.dataValues)
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.json(err)
        })
    });

    // DIET SECTION
    // ===========================================================================

    app.get("/api/diet", function (req, res) {
        db.DietTracker.findAll({})
            .then(function (dietData) {
                res.json(dietData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.post("/api/diet", function (req, res) {
        db.DietTracker.create({
            mealType: req.body.mealType,
            // mealTime: req.body.mealTime,
            notes: req.body.notes
        })
            .then(function (newDietData) {
                // .dataValues = specifies what data to console.log
                console.log("New diet info created", newDietData.dataValues);
                res.json(newDietData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    
    app.delete("/api/diet/:id", function(req, res) {
        db.DietTracker.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            // .dataValues = specifies what data to console.log
            console.log("Deleted data", data.dataValues)
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.json(err)
        })
    });

    // POTTY SECTION
    // ===========================================================================

    app.get("/api/potty", function (req, res) {
        db.PottyTracker.findAll({})
            .then(function (pottyTrackerData) {
                res.json(pottyTrackerData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    // this route should add a new petInfo to the table
    app.post("/api/potty", function (req, res) {
        db.PottyTracker.create({
            pottyType: req.body.pottyType,
            // pottyTime: req.body.pottyTime,
            notes: req.body.notes
        })
            .then(function (newPottyData) {
                // .dataValues = specifies what data to console.log
                console.log("New potty info created", newPottyData.dataValues);
                res.json(newPottyData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    app.delete("/api/potty/:id", function(req, res) {
        db.PottyTracker.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            // .dataValues = specifies what data to console.log
            console.log("Deleted data", data.dataValues)
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.json(err)
        })
    });

    // HYGIENE SECTION
    // ===========================================================================
    app.get("/api/hygiene", function (req, res) {
        db.Hygiene.findAll({})
            .then(function (hygieneData) {
                res.json(hygieneData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    // this route should add a new petInfo to the table
    app.post("/api/hygiene", function (req, res) {
        db.Hygiene.create({
            hygieneType: req.body.hygieneType,
            // timeReceived: req.body.timeReceived,
            notes: req.body.notes
        })
            .then(function (hygieneCreatedData) {
                // .dataValues = specifies what data to console.log
                console.log("New hygiene info created", hygieneCreatedData.dataValues);
                res.json(hygieneCreatedData);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err)
            })
    });

    
    app.delete("/api/hygiene/:id", function(req, res) {
        db.Hygiene.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            // .dataValues = specifies what data to console.log
            console.log("Deleted data", data.dataValues)
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.json(err)
        })
    });

}; //CLOSE MODULE.EXPORTS
