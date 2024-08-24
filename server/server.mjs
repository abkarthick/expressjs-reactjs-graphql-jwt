import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/graphql_jwt')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Redis client setup
const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
});

// Set up Redis PubSub
const pubsub = new RedisPubSub({
    pubsub: redisClient,
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model('User', userSchema);

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
        getUsers: [User!]!
        getUser(id: ID!): User
    }

    type Mutation {
        register(userInput: UserInput): User
        login(email: String!, password: String!): User
        updateUser(id: ID!, userInput: UserInput): User
        deleteUser(id: ID!): Boolean
    }
`);

const root = {
    register: async ({ userInput }) => {
        const { email, password } = userInput;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new UserModel({ email, password: hashedPassword });
        await user.save();
        return { ...user.toObject(), password: null };
    },
    login: async ({ email, password }, context) => {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({ userId: user._id.toString(), email: user.email }, 'somesupersecretkey', {
            expiresIn: '1h',
        });

        context.res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return {
            id: user._id.toString(),
            email: user.email,
            token,
        };
    },
    getUsers: async () => {
        const users = await UserModel.find();
        return users.map(user => ({ ...user.toObject(), id: user._id.toString() }));
    },
    getUser: async ({ id }) => {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return { ...user.toObject(), id: user._id.toString() };
    },
    updateUser: async ({ id, userInput }) => {
        const { email, password } = userInput;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await UserModel.findByIdAndUpdate(id, { email, password: hashedPassword }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return { ...user.toObject(), id: user._id.toString(), password: null };
    },
    deleteUser: async ({ id }) => {
        const result = await UserModel.findByIdAndDelete(id);
        return result ? true : false;
    },
};

app.use('/graphql', graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: root,
    context: { req, res, pubsub },
    graphiql: true,
})));

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
});
