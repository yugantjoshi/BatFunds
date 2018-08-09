testUID = "bff00de0-39e3-11e8-8ddf-49e46dbf263a"
production = 1

module.exports = function(router, dbClass) {
    router.route('/groups/:groupId')
        .get(function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            var group = dbClass.groups.find({
                where: {
                    gid: req.params.groupId
                }
            }).then(function (group) {
                if(!group) {
                    res.status(404).json({success: 0, error: "Group not found"});
                    return;
                }
                res.json({success: 1, group: group});
            })
        });

    router.route('/groups/')
        .post(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
			res.redirect('/login')
       		        return
		}
		uid = testUID
            }
            var name = req.body.name;
            var desc = req.body.desc;
            if(name === undefined || desc === undefined) {
                res.status(400).json({success: 0, error: "Invalid Request"});
                return;
            }
            console.log(name + ' ' + desc);
            var group = dbClass.groups.create({
                name: name,
                description: desc
            }).then((group) => {
                var gid = group.dataValues.gid;
                dbClass.usersgroups.create({
                    uid: uid,
                    gid: gid
                }).then(() => {
                    console.log("Added " + uid + " to the group: " + name);
                }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                    res.status(400).send("Database Error: " + err)
                    console.log(err)
                });
                res.sendStatus(201);
            }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            });
        });

    router.route('/users/:userId')
        .get(function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            var user = dbClass.users.find({
                where: {
                    uid: req.params.userId
                }
            }).then(function (user) {
                if(!user) {
                    res.status(404).json({success: 0, error: "User not found"});
                    return;
                }
                delete user.dataValues['password'];
                res.json({success: 1, user: user});
            })
        });

    router.route('/user/groups/')
        .get(function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }

            dbClass.users.find({
                where: {
                    uid: uid
                }
            }).then((user) => {
                user.getGroups()
                .then((groups) => {
                    if(!groups) {
                        res.status(404).json({success: 0, error: "Error finding groups for user."});
                        return;
                    }
                    res.json({success: 1, groups: groups});
                });
            })
            .catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            });
        });

    router.route('/groups/:groupId/users/')
        .get(function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }
            var usergroup = dbClass.usersgroups.find({
                where: {
                    uid: uid,
                    gid: req.params.groupId
                }
            }).then(function (usergroup) {
                if(!usergroup) {
                    res.status(404).json({success: 0, error: "Error finding users for group."});
                    return;
                }
                var group = dbClass.groups.find({
                    where: {
                        gid: req.params.groupId
                    }
                }).then((group) => {
                    group.getUsers({
                        attributes: ['uid', 'first_name', 'last_name', 'email', 'username']
                    })
                    .then((users) => {
                        res.json({success: 1, users: users});
                    })
                })
            }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            });
        });

    router.route('/groups/member')
        .post(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }
            var username = req.body.username;
            var gid = req.body.gid;
            if(username === undefined || gid === undefined) {
                res.status(400).json({success: 0, error: "Invalid Request"});
                return;
            }

            dbClass.usersgroups.find({
                where: {
                    uid: uid,
                    gid: gid
                }
            }).then((usergroup) => {
                if(!usergroup) {
                    res.status(404).json({success: 0, error: "Must be member of group to add users."});
                    return;
                }
                dbClass.users.find({
                    where: {
                        [dbClass.Sequelize.Op.or]: [{username: username}, {email: username}]
                    }
                }).then((newUid) => {
                    if(!newUid) {
                        res.status(404).json({success: 0, error: "Error finding user."});
                        return;
                    }
                    dbClass.usersgroups.create({
                        uid: newUid.uid,
                        gid: gid
                    }).then(() => {
                        res.status(201).json({success: 1, message: "Successfully added " + username + " to group " + gid});
                    })
                })
            })
            .catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            })
        });

    router.route('/groups/member/:groupId')
        .delete(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }
            var groupId = req.params.groupId;
            if (groupId === undefined) {
                res.status(400).json({success: 0, error: "Invalid Request"});
                return;
            }
            dbClass.usersgroups.find({
                where: {
                    uid: uid,
                    gid: groupId
                }
            }).then((usergroup) => {
                if(!usergroup) {
                    res.status(404).json({success: 0, error: "Error finding group."});
                    return;
                }
                dbClass.usersgroups.destroy({
                    where: {
                        uid : uid,
                        gid : groupId
                    }
                }).then(() => {
                    res.status(200).json({success: 1, message: "Successfully removed " + uid + " from group " + groupId});
                })
            })
            .catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            })
        });

    router.route('/raisepayment')
        .post(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }
            var gid = req.body.gid;
            var amount = req.body.amount;
            var due = req.body.due;
            var description = req.body.description;
            if(gid === undefined || amount === undefined || due === undefined) {
                res.status(400).json({success: 0, error: "Invalid Request"});
                return;
            }
            dbClass.usersgroups.find({
                where: {
                    uid: uid,
                    gid: gid
                }
            }).then((usergroup) => {
                if(!usergroup) {
                    res.status(404).json({success: 0, error: "Error finding group."});
                    return;
                }
                dbClass.paymentflags.create({
                    gid: gid,
                    payee: uid,
                    amount: amount,
                    due: due,
                    description: description
                }).then(() => {
                    console.log("Created payment flag: payee: " + uid + ", amount: " + amount)
                    res.sendStatus(201);
                }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                    res.status(400).send("Database Error: " + err)
                    console.log(err)
                });
            }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            })
        })
    router.route('/paymentflags/:gid')
        .get(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }
            var gid = req.params.gid
            dbClass.usersgroups.findAll({
                where: {
                    uid: uid,
                    gid: gid
                }
            }).then((usergroup) => {
                if(!usergroup) {
                    res.status(404).json({success: 0, error: "Error finding group."});
                    return;
                }
                dbClass.paymentflags.findAll({
                    where: {
                        gid: gid
                    },
                    include: [
                        {
                            model: dbClass.users,
                            attributes: ['username']
                        }
                    ]
                }).then((pf) => {
                    if(!pf) {
                        res.status(200).json({success: 0, error: "Error finding payment flags"});
                        return;
                    }
                    res.json({success: 1, paymentflags: pf});
                })
            }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(400).send("Database Error: " + err)
                console.log(err)
            });
        })

    router.route('/payers')
        .post(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }

            var payer = req.body.uid;
            var pid = req.body.pid;
            var amount = req.body.amount;
            if(pid === undefined || amount === undefined) {
                res.status(400).json({success: 0, error: "Invalid Request"});
                return;
            }
            dbClass.paymentflags.find({
                where: {
                    pid: pid,
                    payee: uid
                }
            }).then((paymentflag) => {
                if(!paymentflag) {
                    res.status(404).json({success: 0, error: "Error finding payment flag."});
                    return;
                }
                dbClass.payers.create({
                    uid: payer,
                    gid: paymentflag.gid,
                    pid: pid,
                    amount: amount,
                    status: "Unpaid"
                }).then(() => {
                    console.log("Added payer: " + payer + " to payment flag: " + pid + ", amount: " + amount)
                    res.sendStatus(201);
                }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                    res.status(400).send("Database Error: " + err)
                    console.log(err)
                });
            }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            })
        })

    router.route('/payers/:pid')
        .get(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		if (production) {
                        res.redirect('/login')
                        return
                }
                uid = testUID
            }
            var uid = req.user.dataValues.uid;
            var pid = req.params.pid
            dbClass.payers.findAll({
                where: {
                    pid: pid,
                }
            }).then((payers) => {
                if(!payers || payers.length == 0) {
                    res.status(404).json({success: 0, error: "Error finding payers."});
                    return;
                }
                res.json({success: 1, payers: payers});
            }).catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(400).send("Database Error: " + err)
                console.log(err)
            });
        })

    router.route('/paymentflags/:pid')
        .delete(function(req, res) {
            if (req.user) uid = req.user.dataValues.uid;
            else {
		        if (production) {
                    res.redirect('/login')
                    return
                }
                uid = testUID
            }
            var pid = req.params.pid;
            if (pid === undefined) {
                res.status(400).json({success: 0, error: "Invalid Request"});
                return;
            }
            dbClass.paymentflags.find({
                where: {
                    pid: pid,
                    payee: uid
                }
            }).then((pf) => {
                if(!pf) {
                    res.status(404).json({success: 0, error: "Error finding payment flag."});
                    return;
                }
                dbClass.paymentflags.destroy({
                    where: {
                        pid : pid
                    }
                }).then(() => {
                    res.status(200).json({success: 1, message: "Successfully removed payment flag" + pid});
                })
            })
            .catch(dbClass.Sequelize.DatabaseError, (err) => {
                res.status(500).json({success: 0, error: "Database Error: " + err});
                console.log(err)
            })
        });
}
