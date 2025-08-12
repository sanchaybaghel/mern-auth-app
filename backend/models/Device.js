const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    platform: { type: String, enum: ['web'], required: true },
    fcmToken: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastSeenAt: { type: Date, default: Date.now }
}, { timestamps: true });

deviceSchema.index({ user: 1, deviceId: 1 }, { unique: true });
const Device=mongoose.model('Device', deviceSchema);
module.exports = Device
