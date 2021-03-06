import * as dotenv from 'dotenv';
dotenv.config()

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
const RedisStore = require('connect-redis')(session);
import * as cors from 'cors';
import flash = require('connect-flash');
import * as passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './types'
import { context } from './context';
import { router as Login } from './login';
import { router as Hypothesis } from './hypothesis';
import { router as HypothesisClient } from './client';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import { getAccessToken } from './login/oauth';

const PORT = 8000;

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (!!process.env.REDIS_HOST && !!process.env.REDIS_PORT) {
  app.use(session({
    store: new RedisStore({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    secret: process.env.SESSION_SECRET || 'xeepe3uuT1Gieh2ig0Aoyoongie1vooTeloo0Oongieb5mear4pix4aSh2loiCei',
  }));
} else {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'xeepe3uuT1Gieh2ig0Aoyoongie1vooTeloo0Oongieb5mear4pix4aSh2loiCei',
  }));
}
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new AnonymousStrategy());
passport.use(new BearerStrategy((token, done) => {
  getAccessToken(token)
    .then(data => {
      if (!data || !data.user) {
        return done(null, false);
      } else {
        return done(null, data.user, { scope: 'all', message: '' });
      }
    })
    .catch(done);
}));
app.set('view engine', 'ejs');
app.use(Login(context));
app.use('/h/api', Hypothesis(context));
app.use(HypothesisClient(context));

const server = new ApolloServer({ typeDefs, resolvers, context });
server.applyMiddleware({ app });

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
