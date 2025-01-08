const User = require('../models/user.models'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingUsers = await User.find();

        let assignedRole = role;

        if (existingUsers.length === 0) {
            assignedRole = 'Admin';
            console.log('First user detected. Assigning Admin role.');
        } else {
            if (!['Editor', 'Viewer'].includes(role)) {
                return res.status(400).json({ message: 'Invalid role. Only "Editor" or "Viewer" allowed.' });
            }
            if (role === 'Admin') {
                return res.status(403).json({
                     message: 'An Admin already exists in the system.' });
            }
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                 "status": 409,
                "data": null,
                "message": "Email already exists.",
                "error": null
             });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: assignedRole,
        });
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(201).json({
            "status": 201,
            "data": null,
            "message": "User created successfully.",
            "error": null
           
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request, Reason: Missing email or password.',
                error: null,
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request, Reason: Invalid password.',
                error: null,
            });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.status(200).json({
            status: 200,
            data: { token },
            message: 'Login successful.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};


module.exports.getAllUsers = async (req, res) => {
    try {

        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(401).json({ status: 401, message: 'Unauthorized Access' });
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({
                "status": 401,
                "data": null,
                "message": "Unauthorized Access",
                "error": null 
                });
            req.user = decoded; 
        });
        const { limit = 5, offset = 0, role } = req.query;
        const adminRole = req.user?.role;
    
        if (adminRole !== 'Admin') {
            return res.status(401).json({ 
                "status": 401,
                "data": null,
                "message": "Unauthorized Access",
                "error": null 
             });
        }
    
         const usersData = await User.find();
        let filteredUsers = usersData;

        if (role) {
            filteredUsers = filteredUsers.filter(user => user.role.toLowerCase() === role.toLowerCase());
        }
        const paginatedUsers = filteredUsers.slice(Number(offset), Number(offset) + Number(limit));
    
        res.status(200).json({
            status: 200,
            data: paginatedUsers,
            message: 'Users retrieved successfully.',
            error: null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};

module.exports.addUser = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            req.user = decoded;
        });

        const adminRole = req.user?.role;

        if (adminRole !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access/Operation not allowed.",
                error: null
            });
        }

        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request",
                error: null
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Email already exists.",
                error: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            status: 201,
            data: null,
            message: "User created successfully.",
            error: null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal server error.",
            error: error.message
        });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            req.user = decoded;
        });

        const adminRole = req.user?.role;
        if (adminRole !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access/Operation not allowed.",
                error: null
            });
        }
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request",
                error: "User ID is required."
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not found.",
                error: null
            });
        }
        return res.status(200).json({
            status: 200,
            data: null,
            message: "User deleted successfully.",
            error: null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal server error.",
            error: error.message
        });
    }
};

module.exports.updatePassword = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }
        let userId;
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    data: null,
                    message: "Unauthorized Access",
                    error: null
                });
            }
            userId = decoded.id;
        });
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not found.",
                error: null
            });
        }
        const { old_password, new_password } = req.body;
        if (!old_password || !new_password) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request",
                error: "Old password and new password are required."
            });
        }
        const isMatch = await bcrypt.compare(old_password, findUser.password);
        if (!isMatch) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access/Old password is incorrect.",
                error: null
            });
        }
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal server error.",
            error: error.message
        });
    }
};
