const express = require('express');
const TimeTableItem = require('../schemas/TimeTableSchema');
const userAuth = require('../middleware/userauth');

const router = new express.Router();

router.post('/api/timetable', userAuth, async (req, res) => {
    if(!req.body.date || !req.body.keyword) return res.status(400);
    if(!req.body.teacher) return res.status(400).send("Vous n'êtes pas un professeur.");

    let usersArray = []

    req.body.users.forEach(user => {
        usersArray.push(user.username)    
    });

    req.body.users = usersArray;
    const timetableItem = new TimeTableItem(req.body);

    await timetableItem.save();
    return res.status(200);
});

router.get('/api/timetable', userAuth, async(req, res) => {
    if(req.user.teacher) {
        const timetableItems = await TimeTableItem.find({teacher: req.user.username});
        return res.status(200).send(timetableItems);
    } else {
        const timetableItems = await TimeTableItem.find({users: req.user.username});
        return res.status(200).send(timetableItems);
    }
})

router.delete('/api/timetable', userAuth, async(req, res) => {
    await TimeTableItem.deleteOne({_id: req.body._id});
    return res.status(200);
})

module.exports = router;