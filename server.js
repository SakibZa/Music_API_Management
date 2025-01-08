const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const db = require('./db/mongoose');
const port = process.env.PORT || 3000;
app.use(express.json());

const userRoutes = require('./routes/user.routes');
const artistRoutes = require('./routes/artist.routes');
const albumRoutes = require('./routes/album.routes');
const trackRoutes = require('./routes/track.routes');
const favoriteRoutes = require('./routes/favorites.routes');

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/artist', artistRoutes);

app.use('/api/v1/albums', albumRoutes);

app.use('/api/v1/tracks', trackRoutes);

app.use('/api/v1/favorites', favoriteRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
