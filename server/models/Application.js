import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur est requis']
    },
    title: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'interview', 'rejected', 'applied'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true
    },
    dateApplied: {
        type: Date
    },
    reminderDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;

