const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const app = express();



app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event{
            _id: ID
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]!
        }
        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //bundle of all resolvers
    rootValue: {
        events: () => {
            return Event.find()
            .then(events => {
                return events.map(event => {
                    return{...event._doc, _id: event.id};
                });
            })
            .catch(err => {

            });
        },
        createEvent: args =>{
            /* const event ={
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }; */
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event
                .save()
                .then(result =>{
                    console.log(result);
                return {...result._doc, _id: result._doc._id.toString()};
            }).catch(err => {
                console.log(err);
                throw err;
            });
           
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds255794.mlab.com:55794/${process.env.MONGO_DB}`)
    .then(()=>{
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
});