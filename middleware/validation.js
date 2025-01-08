const { body, validationResult } = require('express-validator');
const validateAuth = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character (!@#$%^&*)'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(
                  {
                "status": 400,
                "data": null,
                "message": "Bad Request, Reason:${Missing Field}",
                 "error": null
                } );
        }
        next();
    }
];

module.exports = {validateAuth};
