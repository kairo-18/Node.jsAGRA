var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
const app = express();
const router = express.Router();

var givenCode = ``;
var output = ``;


app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/output', function (req, res) {
    res.json({ givenCode: givenCode, output: output });
});


app.post('/', function (req, res) {
    givenCode = req.body.givenCode;
    givenCode.toString();
    process.stdout.write(givenCode);

    var program = {
        script: `${givenCode}`,
        language: "java",
        versionIndex: "0",
        clientId: "7ca68a9f7ef5a8ba75361c0c9be79a9c",
        clientSecret: "86434b93d7121e507991d382fa2d2356d6770854909c793ee044056d23f4973f"
    };


    request({
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
    },
        function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            output = body.output;
            res.redirect('back');

        })


});


app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');



