const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// START server
app.listen(process.env.PORT || 3000, () => {
    console.log(`1, Server running at port no. ${process.env.PORT || 3000}.`);
});

const axios = require('axios');
const xml2js = require('xml2js');

app.use('/', express.static(process.cwd() + '/frontend/dist/newsfeed'))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,authorization,accessToken," +
        "lat lng,app_version,platform,ios_version,countryISO,Authorization");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
    next();
});

// Get Feed API call
app.post('/get_feed', (req, res) => {

    console.log('url -------> ', req.body.feed_name);

    axios.get(req.body.feed_name).then(async (response) => {
        let result = await xml2js.parseStringPromise(response.data, { mergeAttrs: true });

        let items = result.rss.channel[0].item || [];

        items.map((v) => {
            if (v['media:thumbnail'] && v['media:thumbnail'].length) {
                v.image = v['media:thumbnail'][0]['url'];
            } else {
                v.image = 'https://iitpkd.ac.in/sites/default/files/default_images/default-news-image_0.png'
            }
        });

        res.json(result);

    }).catch((error) => {
        console.log(error);
    })
})