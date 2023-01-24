/* eslint-disable func-names */
import express from 'express';
import cors from 'cors';
import status from 'http-status';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import dbConnection from './Connection/dbConnect';


dbConnection();

const app = express();

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(
    express.urlencoded({
        extended: false,
    }),
);



app.use(express.json());

app.get('/', (req, res) => {
    res.status(status.OK).send({ Message: 'Connected', status: status.OK });
});



// Import the Google Maps API
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.Google_API_key
});

// Define the API endpoint for calculating distance
app.get('/calculate-distance', (req, res) => {

    // Get the origin and destination coordinates from the query parameters
    // eslint-disable-next-line prefer-destructuring
    const origin = req.query.origin;
    // eslint-disable-next-line prefer-destructuring
    const destination = req.query.destination;

    // Use the Google Maps API to calculate the distance
    googleMapsClient.distanceMatrix({
        origins: [origin],
        destinations: [destination],
        mode: 'driving',
        units: 'imperial'
    }, (err, response) => {
        if (!err) {
            // Extract the distance from the API response
            const distance = response.json.rows[0].elements[0].distance.text;

            // Send the distance as the API response
            res.json({ distance });
        } else {
            // Send an error message if there was an issue with the API request
            res.json({ error: 'Unable to calculate distance' });
        }
    });
});



const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log(`App listening On port http://localhost:${port}`),
);