const express = require('express');
const ClassItem = require('../schemas/ClassSchema');
const userAuth = require('../middleware/userauth');

const router = new express.Router();

module.exports = router;

router.post('/api/classes', userAuth, async (req, res) => {
    if(!req.body.name || !req.body.teacher) return res.status(400).send("Requête incorrecte.");
    if(!req.user.isTeacher) return res.status(400).send("Vous n'êtes pas un professeur.");

    const classItem = new ClassItem(req.body);
    await classItem.save();

    return res.status(201);
});

router.post('/api/classes/modify', userAuth, async (req, res) => {
    if(!req.user.isTeacher) return res.status(400).send("Vous n'êtes pas un professeur.");

    const classItem = await ClassItem.findOne({_id: req.body._id});

    if(classItem && classItem.teacher.username === req.user.username) {
        classItem.name = req.body.name;
        classItem.users = req.body.users;
        await classItem.save();
        return res.status(200);
    }
    return res.status(400);
})

router.get('/api/classes', userAuth, async (req, res) => {
    if(req.user.isTeacher) {
        const classesItems = await ClassItem.find({teacher: {username: req.user.username, name: req.user.name}});
        return res.status(200).send(classesItems);
    } else {
        const classesItems = await ClassItem.find({users: {username: req.user.username}});
        return res.status(200).send(classesItems);
    }
});

router.delete('/api/classes', userAuth, async (req, res) => {
    if(!req.user.isTeacher) return res.status(400).send("Vous n'êtes pas un professeur.");
    await ClassItem.deleteOne({_id: req.body._id});
    return res.status(200);
});