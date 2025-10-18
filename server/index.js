const express = require("express");
const cors = require("cors");
const {
  twiml: { VoiceResponse },
} = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const applicationSid = process.env.TWIML_APP_SID;

app.get("/token", (req, res) => {
  const identity = "webuser";
  const selectedFrom = req.query.from;
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: applicationSid,
    incomingAllow: true,
    callerId: selectedFrom,
  });
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    {
      identity: identity,
    }
  );
  console.log(token.toJwt());
  token.addGrant(voiceGrant);
  res.send({ token: token.toJwt(), identity });
});

app.all("/voice", (req, res) => {
  const twiml = new VoiceResponse();

  const toNumber = req.body?.To;
  const fromNumber = req.body?.From;

  const conferenceName = req.query?.conferenceName;

  if (conferenceName) {
    // Join the conference (3-way call scenario)
    const dial = twiml.dial({ callerId: fromNumber });
    dial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: false,
      beep: "true",
      waitUrl:
        "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
    });
  } else if (toNumber) {
    // Normal PSTN call
    const dial = twiml.dial({ callerId: fromNumber });
    dial.number(toNumber);
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

app.all("/voice-webhook", (req, res) => {
  const twiml = new VoiceResponse();
  const { To, From, CallSid } = req.body;

  const dial = twiml.dial();
  const client = dial.client("webuser");
  client.parameter({ name: "calledNumber", value: To });
  client.parameter({ name: "callerNumber", value: From });

  res.type("text/xml");
  res.send(twiml.toString());
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
