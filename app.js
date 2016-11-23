"use strict"

// Import the dependencies
const cheerio = require("cheerio")
    , req = require("tinyreq")
    ;

const teamName = 'Aston Villa';
const formattedTeamName = teamName.replace(/ /, '_');
const playerDOMSelector = "tr.vcard .fn";

// Define the scrape function
function scrape(url, data, cb) {
    // 1. Create the request
    req(url, (err, body) => {
        if (err) {
            return cb(err);
        }

        // 2. Parse the HTML
        let $ = cheerio.load(body)
            , pageData = {}
            ;

        // 3. Extract the data
        Object.keys(data).forEach(k => {
            pageData[k] = $(data[k]).map(function (i, el) {
                return $(this).text()
            }).get();
        });

        // Send the data in the callback
        cb(null, pageData);
    });
}

// Extract some data from my website
scrape(`https://en.wikipedia.org/wiki/${formattedTeamName}_F.C.`, {
    players: playerDOMSelector
}, (err, data) => {
    console.log(err || data);
});