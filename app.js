'use strict'

// Import the dependencies
const cheerio = require('cheerio');
const _ = require('lodash');
const req = require('tinyreq');

const teamName = 'Liverpool';
const formattedTeamName = teamName.replace(/ /, '_');

// Define the scrape function
const Players = module.exports = {
    scrape: function(url, cb) {


        req({
                url: url,
                headers: {},
            },
            (err, body) => {

                if (err) {
                    return cb(err);
                }

                let $ = cheerio.load(body);
                let names = [];
                let countries = [];
                let positions = [];

                const namesSelector = 'tr.vcard.agent .fn';
                const countriesSelector = 'tr.vcard.agent .flagicon a';
                const positionsSelector = 'tr.vcard.agent td a';

                // Get names
                names = $(namesSelector).map(function() {
                    return {name: $(this).text()}
                }).get();


                // Get countries
                $(countriesSelector).toArray().forEach(e => {
                    countries.push({country: e.attribs.title})
                });

                // Get positions
                $(positionsSelector).toArray().forEach(e => {
                    const { title } = e.attribs;

                    const possiblePositions = [
                        'goalkeeper',
                        'defender',
                        'midfielder',
                        'forward'
                    ];

                    // This should be optimised to be more specific, because it's targetting too many things.
                    // It's hard to target accurately because of a lack of specificity in markup.
                    if (!!title && _.some(possiblePositions, position => title.toLowerCase().includes(position))) {
                        // Get the first word of the position
                        positions.push({position: title.split(' ')[0]})
                    }
                });

                cb(null, // because no error
                    _.flatten( // because each object is still in its own array
                        _.zip( // because each array is still separate
                            _.merge( // because each object is separate and should be joined to its sibling objects
                                names, countries, positions
                            )
                        )
                    ));
            });
    }
}


// TODO: Make this exportable so that the react app can access it
Players.scrape(
    `https://en.wikipedia.org/wiki/${formattedTeamName}_F.C.`,
    (err, data) => {
        console.log(err || data);
    }
);