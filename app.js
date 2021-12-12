const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

const events = [];
// app.use(application.json())
app.get("/", (req, res, next) => {
  res.send("hello");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
        events: [String!]!
    }


    input EventInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }


    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);

//Dummy Data
/* mutation {
  createEvent(
    eventInput: 
    {title:"Test",
    description:"this is test",
    price:2.22,
    date:"sun dec 12 2021 15:53:32 gmt+0500 (pakistan standard time)"
    })
  {
    title
  }
} */
