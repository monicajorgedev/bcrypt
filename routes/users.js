const express = require('express')
const router = express.Router()
const users = require('../data/users')

const {generateToken, verifyToken} = require('../middlewares/authMiddleware')

router.get('/', (req, res) => {
    if(!req.session.token){
    const loginForm = `
    <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>
        
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br>
    
        <button type="submit">Iniciar sesión</button>
    </form>
        <a href="/dashboard">dashboard</a>
    `;
    res.send(loginForm);
    } else {
        res.send(`
            <h1> Bienvenido </>
             <a href="/dashboard">dashboard</a>
                <form action="/logout" method="post"> 
                <button type="submit">Cerrar sesión</button> 
                </form> 
        `)
    }
  });

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password
    );

    if (!user) {
        res.status(401).json({ message: 'Credenciales incorrectas' });
        
    } else {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
    }
});

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((u) => u.id === userId);
    
    if (!user) {
        res.status(401).json({ message: 'Usuario no encontrado' })
        
    } else {
        res.send(
            ` <h1>Bienvenido, ${user.name}!</h1> 
            <p>ID: ${user.id}</p> <p>Usuario: ${user.username}</p> <br> 
            <form action="/logout" method="post"> 
            <button type="submit">Cerrar sesión</button> 
            </form> 
            <a href="/">home</a> `
            );
    }
    });
    
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router
