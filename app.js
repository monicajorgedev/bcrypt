const express = require('express');

const session = require('express-session');

const app = express();
const PORT = 3000;

const usersRouter = require('./routes/users')
const {secret} = require('./crypto/config')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

  app.use('/',usersRouter)

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});