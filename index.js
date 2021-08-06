const express = require('express')
const dialogflow = require('@google-cloud/dialogflow')

const uuid = require('uuid')

const app = express()

app.listen(process.env.PORT || 5500, () => console.log("Listening on port 80"))

const sessionId = uuid.v4();

const sessionClient = new dialogflow.SessionsClient({

});
const sessionPath = sessionClient.projectAgentSessionPath(
    "healthbot-fhgf",
    sessionId
);

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./healthbot.json"

app.get('/', (req, res) => res.render('index'))
app.get('/getResponse', async (req, res) => {
    let input = req.query.input;

    if (!input) return res.json({
        success: false,
        message: "Sorry, there was an error."
    })

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: input,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    
    const result = responses[0].queryResult;
    res.json({
        success: true,
        message: result.fulfillmentText
    })

    if (result.intent) {
        console.log(`  Intent: ${ result.intent.displayName }`);
    } else {
        console.log('  No intent matched.');
        res.json({
            success: false,
            message: "Intent unavailable."
        })
    }
})

app.set('view engine', 'ejs')
app.use(express.static('static'))