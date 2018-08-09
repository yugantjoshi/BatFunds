const bcrypt = require('../utils/bcrypt.js')

function loggedIn(req, res, next) {
    if (req.user) {
        res.redirect('/app');
    } else {
        next();
    }
}

module.exports = function(path, app, dbClass, passport) {

    app.get('/login', loggedIn, function(req, res) {
        res.sendFile(path.join(__dirname + '/../views/login.html'))
    })

    app.post('/login', passport.authenticate('localLogin', {
        successRedirect: '/app',
        failureRedirect: '/login?code=-1'
    }))

    app.get('/signup', loggedIn, function(req, res) {
        res.sendFile(path.join(__dirname + '/../views/signup.html'))
    })

    app.post('/signup', function(req, res) {

        const email = req.body.email
        const username = req.body.username
        const password = bcrypt.hash(req.body.password)
        const first_name = req.body.first_name
        const last_name = req.body.last_name
        const phone = req.body.phone

        dbClass.users.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            username: username,
            phone: phone,
            password: password, 
            verified: 1
        }).then(user => {
            res.redirect('/login?code=1')
        }).catch(dbClass.Sequelize.ValidationError, (err) => {
            if (err.errors[0].path == 'email_UNIQUE') res.redirect('/signup?code=-2')
            if (err.errors[0].path == 'username_UNIQUE') res.redirect('/signup?code=-3')
            console.log("Validation Error: " + err)
        }).catch(dbClass.Sequelize.DatabaseError, (err) => {
            res.send("Database Error: " + err)
            console.log(err)
        })
    })

    app.get('/logout', function(req, res) {
        req.logout()
        res.redirect('/login?code=2')
    })
}