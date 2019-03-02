const {dateToString} = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');
const {morphEvent} = require('./merge');


module.exports = {
    events: async () => {
        try{
            const events = await Event.find();
            return events.map(event => {
                return morphEvent(event);
            });
        }
        catch(err){
            throw err;
        };
    },
    createEvent: async (args, req) =>{
        if(!eq.isAuth){
            throw new Error('Unauthenticated');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try{
            const result = await event.save();
            createdEvent = morphEvent(result);
            const creator = await User.findById('5c5f233190a6724a22cc55cb');
            if(!creator){
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        }catch(err){
            console.log(err);
            throw err;
        }
    },

    
    

};