const express = require('express');
const { createClient } = require('redis');

const app = express();
const port = 3000;

const client = createClient({
    socket: {
        host: 'redis',
        port: 6379,
    },
});

client.on('error', (err) => {
    console.error('Erreur Redis:', err);
});

async function connectToRedis() {
    try {
        await client.connect();
        console.log('Connecté à Redis');

        const message = await client.get('message');
        if (!message) {
            await client.set('message', 'Hello from Redis!');
            console.log('Message inséré dans Redis');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion à Redis:', error);
    }
}

app.get('/', async (req, res) => {
    try {
        const message = await client.get('message');
        if (!message) {
            return res.status(404).send('Aucun message trouvé dans Redis');
        }
        res.send(message);
    } catch (err) {
        console.error('Erreur lors de la récupération du message:', err);
        res.status(500).send('Erreur lors de la récupération du message');
    }
});

app.listen(port, async () => {
    await connectToRedis();
    console.log(`L'application écoute sur le port ${port}`);
});
