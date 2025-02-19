// routes/index.js
import usersRouter from './users.router.js';
import airportRouter from './airport.router.js';
import statusRouter from './status.router.js';
import aircraft_modelRouter from './aircraft_model.router.js';
import maintenance_reportRouter from './maintenance_report.router.js';
import aircraftRouter from './aircraft.router.js';
import crew_assignementRouter from './crew_assignement.router.js';
import crewRouter from './crew.router.js';
import flightRouter from './flight.router.js';

const routes = {
    usersRouter,
    airportRouter,
    statusRouter,
    aircraft_modelRouter,
    maintenance_reportRouter,
    aircraftRouter,
    crew_assignementRouter,
    crewRouter,
    flightRouter
};

export default routes;
