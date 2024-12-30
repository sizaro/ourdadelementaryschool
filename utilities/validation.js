const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

    /*  **********************************
    *  Registration Data Validation Rules
    * ********************************* */

    validate.registrationRules = () => {
        return [
            body("first_name")
                .trim()
                .isAlpha()
                .withMessage("First name must contain only alphabetic characters.")
                .toLowerCase(),
    
            body("middle_name")
                .optional({ nullable: true, checkFalsy: true })
                .trim()
                .isAlpha("en-US", { ignore: " " })
                .withMessage("Middle name must contain only alphabetic characters if provided.")
                .toLowerCase(),
    
            body("last_name")
                .trim()
                .isAlpha()
                .withMessage("Last name must contain only alphabetic characters.")
                .toLowerCase(),
    
            body("email")
                .trim()
                .isEmail()
                .normalizeEmail()
                .withMessage("A valid email is required.")
                .custom(async (email) => {
                    const emailExists = await accountModel.checkExistingEmail(email);
                    if (emailExists > 0) {
                        throw new Error("Email exists. Please log in or use a different email.");
                    }
                }),
    
            body("password")
                .trim()
                .notEmpty()
                .isStrongPassword({
                    minLength: 12,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
                .withMessage("Password does not meet the requirements."),
    
            body("role")
                .trim()
                .escape()
                .notEmpty()
                .withMessage("Please select your role."),
    
            // Custom validator for uploaded image
            body("image_url")
                .custom((value, { req }) => {
                    if (!req.file) {
                        throw new Error("Please attach an image to the form.");
                    }
                    return true;
                }),
        ];
    };
    
    

    /* ******************************
    * Check data and return errors or continue to registration
    * ***************************** */
    validate.checkRegData = async (req, res, next) => {
        console.log(req.file); // Logs the uploaded file info
        console.log(req.body); // Logs other form fields
    
        const { first_name, last_name, email, password, role } = req.body;
        const image_url = req.file ? req.file.path : null; // Use the file path for image_url
    
        console.log(
            "this is the role inside the validation",
            first_name,
            last_name,
            email,
            password,
            image_url,
            role
        );
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("signup", {
                errors: errors.array(),
                title: "Directors Form",
                message: "Please fix those errors",
            });
        }
    
        req.body.image_url = image_url; // Attach the file path to req.body for further use
        next();
    };
    

module.exports = validate