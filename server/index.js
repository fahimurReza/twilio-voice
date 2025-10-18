const express = require("express");
const cors = require("cors");
const {
  twiml: { VoiceResponse },
} = require("twilio");
const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const twilio = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const outgoingApplicationSid = process.env.TWIML_APP_SID_OUTGOING;
const twilioNumber = process.env.TWILIO_NUMBER;

// Twilio REST client
const client = twilio(twilioAccountSid, process.env.TWILIO_AUTH_TOKEN);

// ================================
// 1️⃣ Token endpoint
// ================================
app.get("/token", (req, res) => {
  const identity = "webuser";
  const selectedFrom = req.query.from;
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid,
    incomingAllow: true,
    callerId: selectedFrom,
  });
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity }
  );
  token.addGrant(voiceGrant);
  res.send({ token: token.toJwt(), identity });
});

// ================================
// 2️⃣ Incoming call webhook (or join conference directly)
// Supports both incoming calls and clients joining the conference
// ================================
app.post("/voice", (req, res) => {
  const conferenceName = req.query.conferenceName || "default_conference";
  const fromNumber = req.body.From || twilioNumber;

  const response = new VoiceResponse();
  const dial = response.dial({ callerId: twilioNumber });
  dial.conference(conferenceName, {
    startConferenceOnEnter: true,
    endConferenceOnExit: false,
    beep: "true",
    waitUrl: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
  });

  res.type("text/xml");
  res.send(response.toString());
});

// ================================
// 5️⃣ Client-specific voice webhook
// /voice-webhook updated to support conferences
// ================================
app.post("/voice-webhook", (req, res) => {
  const { To, From, CallSid } = req.body;
  const conferenceName = req.query.conferenceName || "default_conference";

  const response = new VoiceResponse();
  const dial = response.dial({ callerId: From || twilioNumber });

  // Join client to the conference
  const clientDial = dial.client("webuser");
  clientDial.parameter({ name: "calledNumber", value: To });
  clientDial.parameter({ name: "callerNumber", value: From });

  // Also ensure they join the conference
  dial.conference(conferenceName, {
    startConferenceOnEnter: true,
    endConferenceOnExit: false,
    beep: "true",
    waitUrl: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
  });

  res.type("text/xml");
  res.send(response.toString());
});

// ================================
// 3️⃣ Outgoing PSTN call endpoint
// Dials the number and joins them to the conference
// ================================
app.post("/conference-call", async (req, res) => {
  const { fromNumber, toNumber, conferenceName } = req.body;

  if (!fromNumber || !toNumber || !conferenceName) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  try {
    const call = await client.calls.create({
      to: toNumber,
      from: fromNumber,
      url: `https://twilio-voice-backend-f5sm.onrender.com/conference-join-twiml?conferenceName=${conferenceName}`,
    });

    console.log(`📞 Calling ${toNumber} to join conference ${conferenceName}`);
    res.send({ success: true, callSid: call.sid });
  } catch (err) {
    console.error("Error placing call:", err);
    res.status(500).send({ error: "Failed to place call" });
  }
});

// ================================
// 4️⃣ TwiML webhook for PSTN or client joining conference
// ================================
app.post("/conference-join-twiml", (req, res) => {
  const conferenceName = req.query.conferenceName || "default_conference";
  const fromNumber = req.body.From || twilioNumber;

  const response = new VoiceResponse();
  const dial = response.dial({ callerId: fromNumber });

  dial.conference(conferenceName, {
    startConferenceOnEnter: true,
    endConferenceOnExit: false,
    beep: "true",
    waitUrl: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
  });

  res.type("text/xml");
  res.send(response.toString());
});

// ================================
// Start server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
