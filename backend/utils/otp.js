const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const isTwilioConfigured = accountSid && authToken && twilioPhone &&
    accountSid !== 'your-twilio-account-sid' &&
    authToken !== 'your-twilio-auth-token' &&
    twilioPhone !== 'your-twilio-phone-number';

const client = isTwilioConfigured ? twilio(accountSid, authToken) : null;


const otpStore = {};


const pendingUsersStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOTP = (phone) => {
    const otp = generateOTP();
    otpStore[phone] = {
        otp: otp,
        timestamp: Date.now(),
        expires: Date.now() + (10 * 60 * 1000)
    };

    if (isTwilioConfigured && client) {
        client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: twilioPhone,
            to: phone
        }).catch(err => {
            console.error('Twilio error:', err);
        });
        console.log(`📱 SMS sent to ${phone}`);
    } else {
        
        console.log('🔧 DEVELOPMENT MODE - Twilio not configured');
        console.log(`📱 Phone: ${phone}`);
        console.log(`🔑 OTP Code: ${otp}`);
        console.log('💡 Configure Twilio in .env file to send real SMS');
        console.log('---');
    }

    return otp;
};

exports.verifyOTP = (phone, otp) => {
    const storedData = otpStore[phone];
    if (storedData && storedData.otp === otp && Date.now() < storedData.expires) {
        delete otpStore[phone];
        return true;
    }
    return false;
};


exports.storePendingUser = (phone, userData) => {
    pendingUsersStore[phone] = {
        ...userData,
        timestamp: Date.now(),
        expires: Date.now() + (15 * 60 * 1000) 
    };
};

exports.getPendingUser = (phone) => {
    const userData = pendingUsersStore[phone];
    if (userData && Date.now() < userData.expires) {
        return userData;
    }
  
    if (userData) {
        delete pendingUsersStore[phone];
    }
    return null;
};

exports.deletePendingUser = (phone) => {
    delete pendingUsersStore[phone];
};