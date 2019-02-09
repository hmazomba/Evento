const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const app = express();

app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({
    schema:graphQLSchema,
    //bundle of all resolvers
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds255794.mlab.com:55794/${process.env.MONGO_DB}`)
    .then(()=>{
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
});
