const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// In-memory store for OTPs (for demo; use DB or cache for production)
const otpStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOTP = (phone) => {
    const otp = generateOTP();
    otpStore[phone] = otp;

    client.messages.create({
        body: `Your OTP code is ${otp}`,
        from: twilioPhone,
        to: phone
    }).catch(err => {
        console.error('Twilio error:', err);
    });

    return otp;
};

exports.verifyOTP = (phone, otp) => {
    if (otpStore[phone] && otpStore[phone] === otp) {
        delete otpStore[phone];
        return true;
    }
    return false;
};