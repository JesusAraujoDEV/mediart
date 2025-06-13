const passport = require('passport');

const LocalStrategy = require('./strategies/local_strategy');
const JwtStrategy = require('./strategies/jwt_strategy');

passport.use(LocalStrategy);
passport.use(JwtStrategy);
