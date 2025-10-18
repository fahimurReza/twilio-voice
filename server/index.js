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
    const dial = twiml.dial({ callerId: fromNumber });
    dial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: false,
      beep: "true",
      waitUrl:
        "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
    });
  } else if (toNumber) {
    const dial = twiml.dial({ callerId: fromNumber });
    dial.number(toNumber);
  } else {
    twiml.say("No number provided to connect the call.");
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

app.post("/merge-to-conference", async (req, res) => {
  try {
    const { callSid1, callSid2 } = req.body;
    if (!callSid1 || !callSid2) {
      return res.status(400).send({ error: "Both call SIDs are required" });
    }
    const conferenceName = `conf_${Date.now()}`;
    const client = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.calls(callSid1).update({
      url: `${process.env.BASE_URL}/conference-join?conferenceName=${conferenceName}`,
      method: "POST",
    });
    await client.calls(callSid2).update({
      url: `${process.env.BASE_URL}/conference-join?conferenceName=${conferenceName}`,
      method: "POST",
    });
    res.send({ success: true, conferenceName });
  } catch (err) {
    console.error("Error merging calls:", err);
    res.status(500).send({ error: err.message });
  }
});

app.post("/conference-join", (req, res) => {
  const { conferenceName } = req.query;
  const response = new VoiceResponse();

  const dial = response.dial();
  dial.conference(conferenceName, {
    startConferenceOnEnter: true,
    endConferenceOnExit: false,
    beep: "true",
    waitUrl: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
  });

  res.type("text/xml");
  res.send(response.toString());
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
