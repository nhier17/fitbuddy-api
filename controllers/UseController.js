const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createUser = async (req, res) => {
    const { 
        name, 
        email, 
        age, 
        weight,
        fitnessLevel, 
        workoutFrequency, 
        fitnessGoals, 
        dietaryPreferences 
    } = req.body;

    try {
        // Input validation
        if (!name || !email || !age || !weight || !fitnessLevel || !workoutFrequency || !fitnessGoals) {
            throw new CustomError.BadRequestError('Please provide all required fields');
        }

        let user = await User.findOne({ email });
        if (user) {
            // Update existing user
            user.name = name;
            user.age = parseInt(age); 
            user.weight = parseFloat(weight); 
            user.activityLevel = fitnessLevel; 
            user.goal = fitnessGoals; 
            user.dietaryPreferences = dietaryPreferences 

            await user.save();
            return res.status(StatusCodes.OK).json({ 
                message: 'User profile updated successfully',
                user 
            });
        }

        // Create new user
        user = new User({
            name,
            email,
            age: parseInt(age),
            weight: parseFloat(weight),
            activityLevel: fitnessLevel,
            goal: fitnessGoals,
            dietaryPreferences: dietaryPreferences
        });

        await user.save();
        res.status(StatusCodes.CREATED).json({
            message: 'User profile created successfully',
            user
        });
    } catch (error) {
        console.error('User creation/update error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: 'Error processing user data'
        });
    }
};

module.exports =  createUser ;
