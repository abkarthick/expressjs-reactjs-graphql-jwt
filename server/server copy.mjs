import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const users = [];

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

const schema = buildSchema(`
    type User {
        id: ID!
        email: String!
        token: String
    }

    input UserInput {
        email: String!
        password: String!
    }

    type Query {
        login(email: String!, password: String!): User
    }

    type Mutation {
        register(userInput: UserInput): User
        login(email: String!, password: String!): User
    }
`);

const root = {
    register: async ({ userInput }) => {
        const { email, password } = userInput;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = { id: users.length + 1, email, password: hashedPassword };
        users.push(user);
        return { ...user, password: null };
    },
    login: async ({ email, password }, context) => {
        const user = users.find((user) => user.email === email);
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
            expiresIn: '1h',
        });

        // Set the HttpOnly cookie
        context.res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return { ...user, password: null, token };
    },
};

app.use('/graphql', graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: root,
    context: { req, res },
    graphiql: true,
})));


app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
});
