const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email address"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters long"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ],
        select: false 
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isOAuth: {
        type: Boolean,
        default: false // Assume false for regular email/password signups
    },
    image: {
        type: String,
    },
    age: {
        type: Number,
        min: [13, "Age must be at least 13"]
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    goal: {
        type: String,
        enum: ['lose weight', 'muscle gain', 'maintain weight'],
        default: 'muscle gain'
    },
    activityLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
