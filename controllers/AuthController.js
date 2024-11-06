const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

//register new user
const register = async(req, res) => {
    const { name, email, password } = req.body;
    try {
        //check if email already exists
        const emailAlreadyExists = await User.findOne({ email: email });
        if (emailAlreadyExists) {
            throw new CustomError.BadRequestError('Email already exists');
        }

        //first account admin
        const isFirstAccount = (await User.countDocuments({})) === 0;
        const role = isFirstAccount ? 'admin' : 'user';
        
        //create new user
        const user = await User.create({ name, email, password, role });
        
        res.status(StatusCodes.CREATED).json({ user });
    
    } catch (error) {
  console.error(error); 
    }
};

const login = async (req, res) => {
    const { email, password, isOAuth } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) {
            // If no user is found and this is an OAuth login, create a new OAuth user
            if (isOAuth) {
                user = await User.create({
                    email,
                    password: 'oauth_placeholder_password', // Placeholder password
                    role: 'user',
                    isOAuth: true
                });
                return res.status(StatusCodes.CREATED).json({ user });
            } else {
                throw new CustomError.UnauthorizedError('Invalid credentials');
            }
        }

        if (!isOAuth) {
            // Re-fetch the user with the password field selected
            user = await User.findOne({ email }).select('+password');
            const isPasswordCorrect = await user.comparePassword(password);
            if (!isPasswordCorrect) {
                throw new CustomError.UnauthenticatedError('Invalid credentials');
            }
        }

        res.status(StatusCodes.OK).json({ user });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    }
};


//logout
    const logout = async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token!== req.token);
        await req.user.save();

        res.send();
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    register,
    login,
    logout
};