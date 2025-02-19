import prisma from '../db.js'


/**
 * Returns all airport, sorted by the provided field and direction
 * @param {string} sortBy - The field to sort by (optional)
 * @param {string} sortDirection - The direction to sort by (optional, default is 'ASC')
 * @returns {Array} - An array of airport
 */
export const getAll = async (sortBy, sortDirection) => {
    // If the sortBy parameter is provided, we will sort the airport array
    let options = {
        select: {
            id: true,
            name: true,
            iata: true,
            icao: true,
            city: true,
            country: true,
            latitude: true, 
            longitude: true,
            timeZone: true,
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return await prisma.airport.findMany(options)
}

/**
 * Returns a single airport by its id
 * @param {number} id - The id of the airport to get 
 * @returns {object} - The airport object or null if not found
 */
export const getById = async (id) => {
    return await prisma.airport.findUnique({
        select: {
            id: true,
            name: true,
            iata: true,
            icao: true,
            city: true,
            country: true,
            latitude: true, 
            longitude: true,
            timeZone: true,
        },
        where: {
            id
        }
    })
}

/**
 * Deletes a Airport by its id
 * @param {number} id 
 * @returns {boolean} - True if the airport was deleted, false if not found
 */
export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.airport.delete({
            where: {
                id
            }
        })
        return true
    }
    return false
}



export const createAirport = async (name, iata, icao, city, country, latitude, longitude, timeZone) => {
    // Check if the IATA or ICAO code already exists
    const count = await prisma.airport.count({
        where: {
            OR: [
                { iata },
                { icao }
            ]
        }
    });

    if (count > 0) throw new Error('IATA or ICAO code already exists');

    // Create the airport
    const airport = await prisma.airport.create({
        data: {
            name,
            iata,
            icao,
            city,
            country,
            latitude,
            longitude,
            timeZone
        },
        select: {
            id: true,
            name: true,
            iata: true,
            icao: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
            timeZone: true
        }
    });

    return airport;
};

export const updateAirport = async (id, updateData) => {
    // Check if the airport exists
    const airport = await prisma.airport.findUnique({
        where: { id },
    });

    if (!airport) {
        throw new Error('Airport not found');
    }

    // Optional: Validate uniqueness of IATA and ICAO codes if they are being updated
    if (updateData.iata) {
        const iataExists = await prisma.airport.findUnique({
            where: { iata: updateData.iata }
        });

        if (iataExists && iataExists.id !== id) {
            throw new Error('IATA code is already in use');
        }
    }

    if (updateData.icao) {
        const icaoExists = await prisma.airport.findUnique({
            where: { icao: updateData.icao }
        });

        if (icaoExists && icaoExists.id !== id) {
            throw new Error('ICAO code is already in use');
        }
    }

    // Patch the airport data (only the fields provided will be updated)
    const updatedAirport = await prisma.airport.update({
        where: { id },
        data: updateData,  // Only fields in updateData will be updated
        select: {
            id: true,
            name: true,
            iata: true,
            icao: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
            timeZone: true,
        },
    });

    return updatedAirport;
};

export const getWeatherForAirport = async (iata) => {
    try {
        // Fetch airport data (latitude and longitude)
        const airport = await prisma.airport.findUnique({
            select: {
                latitude: true,
                longitude: true,
            },
            where: {
                iata: iata, // Use the IATA code as a string
            }
        });

        if (!airport) {
            throw new Error('Airport not found');
        }

        const { latitude, longitude } = airport;

        // Fetch weather data from Open-Meteo
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm`);

        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();

        // Weather description mapping based on Open-Meteo codes
        const weatherDescriptionMap = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Heavy drizzle',
            56: 'Freezing drizzle',
            57: 'Heavy freezing drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Freezing rain',
            67: 'Heavy freezing rain',
            71: 'Light snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Light rain showers',
            81: 'Moderate rain showers',
            82: 'Heavy rain showers',
            85: 'Light snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Thunderstorm with heavy hail'
        };

        const weatherDescription = weatherDescriptionMap[weatherData.current_weather.weathercode] || 'Unknown weather';

        // Extracting and returning the weather data
        return {
            temperature: `${weatherData.current_weather.temperature} °C`,    // Temperature in Celsius
            windSpeed: `${weatherData.current_weather.windspeed} km/h`,     // Wind speed in km/h
            windDirection: `${weatherData.current_weather.winddirection}°`, // Wind direction in degrees
            weatherDescription: weatherData.current_weather.weatherDescription,    // Converted to a readable description
            elevation: `${weatherData.elevation} m`,        // Elevation in meters
            time: weatherData.current_weather.time,                         // Time of the weather report
        };
    } catch (error) {
        throw new Error(`Error fetching weather data: ${error.message}`);
    }
};
