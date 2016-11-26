'use strict'

// Import the dependencies
const cheerio = require('cheerio');
const _ = require('lodash');
const req = require('tinyreq');

const teamName = 'Chelsea';
const formattedTeamName = teamName.replace(/ /, '_');
const playerDOMSelector = 'tr.vcard.agent';

// Define the scrape function
function scrape(url, cb) {
    req(url, (err, body) => {
        if (err) {
            return cb(err);
        }

        let $ = cheerio.load(body);
        let countries = [];
        let positions = [];

        // Get names
        const names = $('tr.vcard.agent .fn').map(function() {
            return $(this).text()
        }).get();


        // Get countries
        $('tr.vcard.agent .flagicon a').toArray().forEach(e => {
            countries.push(e.attribs.title)
        });

        // Get positions
        $('tr.vcard.agent td a').toArray().forEach(e => {
            const { title } = e.attribs;

            const possiblePositions = [
                'goalkeeper',
                'defender',
                'midfielder',
                'forward'
            ];

            if (_.some(possiblePositions, position => title.toLowerCase().indexOf(position) > -1)) {
                // Get the first word of the position
                positions.push(title.split(' ')[0])
            }
        });

        cb(null, _.zip(names, countries, positions));
    });
}

// Extract some data from my website
scrape(
    `https://en.wikipedia.org/wiki/${formattedTeamName}_F.C.`,
    (err, data) => {
        console.log(err || data);
    }
);