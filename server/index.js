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

const client = require("twilio")(twilioApiKey, twilioApiSecret, {
  accountSid: twilioAccountSid,
});

let currentConference = null;

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

  let room = currentConference;
  let isNew = false;

  if (!room) {
    room = req.body.CallSid;
    currentConference = room;
    isNew = true;
  }

  const dial = twiml.dial();
  dial.conference(room);

  res.type("text/xml");
  res.send(twiml.toString());

  if (isNew) {
    client.calls
      .create({
        to: toNumber,
        from: fromNumber,
        url: `https://twilio-voice-backend-f5sm.onrender.com/join-conference?room=${room}`,
        statusCallback:
          "https://twilio-voice-backend-f5sm.onrender.com/call-status",
        statusCallbackMethod: "POST",
      })
      .then((call) => console.log(`Outbound call created: ${call.sid}`))
      .catch((err) => console.error(err));
  }
});

app.all("/voice-webhook", (req, res) => {
  const twiml = new VoiceResponse();

  const fromNumber = req.body.From;
  const toNumber = req.body.To;

  let room = currentConference;
  let isNew = false;

  if (!room) {
    room = req.body.CallSid;
    currentConference = room;
    isNew = true;
  }

  const dial = twiml.dial();
  dial.conference(room);

  res.type("text/xml");
  res.send(twiml.toString());

  if (isNew) {
    client.calls
      .create({
        to: `client:webuser?calledNumber=${encodeURIComponent(
          toNumber
        )}&callerNumber=${encodeURIComponent(fromNumber)}`,
        from: fromNumber,
        url: `https://twilio-voice-backend-f5sm.onrender.com/join-conference?room=${room}`,
        statusCallback:
          "https://twilio-voice-backend-f5sm.onrender.com/call-status",
        statusCallbackMethod: "POST",
      })
      .then((call) => console.log(`Client call created: ${call.sid}`))
      .catch((err) => console.error(err));
  }
});

app.all("/join-conference", (req, res) => {
  const twiml = new VoiceResponse();

  const room = req.query.room || req.body.room;

  if (!room) {
    res.type("text/xml");
    return res.send(twiml.reject().toString());
  }

  const dial = twiml.dial();
  dial.conference(room);

  res.type("text/xml");
  res.send(twiml.toString());
});

app.post("/add-to-conference", (req, res) => {
  if (!currentConference) {
    return res.status(400).send({ error: "No active conference" });
  }

  const number = req.body.number;
  if (!number) {
    return res.status(400).send({ error: "Number required" });
  }

  client.calls
    .create({
      to: number,
      from: process.env.TWILIO_NUMBER,
      url: `https://twilio-voice-backend-f5sm.onrender.com/join-conference?room=${currentConference}`,
      statusCallback:
        "https://twilio-voice-backend-f5sm.onrender.com/call-status",
      statusCallbackMethod: "POST",
    })
    .then((call) => {
      console.log(`Added participant: ${call.sid}`);
      res.send({ success: true, sid: call.sid });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "Failed to add participant" });
    });
});

app.post("/call-status", (req, res) => {
  res.sendStatus(200);

  const { CallStatus } = req.body;

  if (CallStatus === "completed" && currentConference) {
    setTimeout(async () => {
      try {
        const participants = await client
          .conferences(currentConference)
          .participants.list();

        if (participants.length === 0) {
          currentConference = null;
          console.log("Conference ended and reset");
        }
      } catch (err) {
        console.error("Error checking participants:", err);
      }
    }, 2000); // Delay for Twilio updates
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
