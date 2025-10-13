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
const outgoingApplicationSid = process.env.TWIML_APP_SID_OUTGOING;

app.get("/token", (req, res) => {
  const identity = "webuser";
  const selectedFrom = req.query.from;
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
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

  const toNumber =
    req.body?.To ||
    req.body?.to ||
    req.body?.params?.To ||
    req.query?.To ||
    "+15551234567";

  const fromNumber =
    req.body?.From ||
    req.body?.from ||
    req.body?.params?.From ||
    req.query?.From ||
    process.env.TWILIO_NUMBER; // fallback to default

  const dial = twiml.dial({ callerId: fromNumber });
  dial.number(toNumber);

  res.type("text/xml");
  res.send(twiml.toString());
});

app.all("/voice-webhook", (req, res) => {
  const twiml = new VoiceResponse();
  const { To, From, CallSid } = req.body;
  console.log(`Incoming call: CallSid=${CallSid}, To=${To}, From=${From}`);
  const dial = twiml.dial();
  dial.client("webuser");
  twiml.say("Sorry, the dialer is unavailable. Please try again later.");
  res.type("text/xml");
  res.send(twiml.toString());
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
