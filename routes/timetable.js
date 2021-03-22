const express = require('express');
const TimeTableItem = require('../schemas/TimeTableSchema');
const ClassItem = require('../schemas/ClassSchema');
const userAuth = require('../middleware/userauth');

const router = new express.Router();

router.post('/api/timetable', userAuth, async (req, res) => {
    if(!req.body.date || !req.body.keyword) return res.status(400);
    if(!req.user.isTeacher) return res.status(400).send("Vous n'êtes pas un professeur.");

    const timetableItem = new TimeTableItem(req.body);

    await timetableItem.save();
    return res.status(200);
});

router.get('/api/timetable', userAuth, async(req, res) => {
    if(req.user.isTeacher) {
        const timetableItems = await TimeTableItem.find({teacher: {username: req.user.username, name: req.user.name}});
        for(let i = 0; i < timetableItems.length; i++) {
            for(let k = 0; k < timetableItems[i].classes.length; k++) {
                const classConverted = await ClassItem.findOne({_id: timetableItems[i].classes[k]});
                timetableItems[i].classes[k] = classConverted;
            }
        }
        return res.status(200).send(timetableItems);
    } else {
        const timetableUser = await TimeTableItem.find({"users.username": req.user.username});
        let responseArray = [];

        responseArray.push(timetableUser)

        const classes = await ClassItem.find({"users.username": req.user.username})
        for(let i = 0; i < classes.length; i++) {
            const timetableItems = await TimeTableItem.find({classes: classes[i]._id});
            responseArray.push(timetableItems);
        }
        
        return res.status(200).send(responseArray);
    }
})

router.post('/api/timetable/modify', userAuth, async(req, res) => {
    if(!req.user.isTeacher) return res.status(400).send("Vous n'êtes pas un professeur.");

    const timetableItem = await TimeTableItem.findOne({_id: req.body._id});

    if(timetableItem && timetableItem.teacher.username === req.user.username) {
        timetableItem.keyword = req.body.keyword;
        timetableItem.date = req.body.date;
        timetableItem.description = req.body.description;
        timetableItem.users = req.body.users;
        timetableItem.classes = req.body.classes;
        await timetableItem.save();
        return res.status(200);
    }
    return res.status(400);
})

router.delete('/api/timetable', userAuth, async(req, res) => {
    await TimeTableItem.deleteOne({_id: req.body._id});
    return res.status(200);
})

module.exports = router;