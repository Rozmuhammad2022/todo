async function notEmp(req, inputName) {
    inputName.forEach(item => 
        req.check(item)
           .notEmpty()
           .withMessage(item[0].toUpperCase() + item.slice(1) + " must not be empty")
    );
}

async function isNum(req, inputName) {
    inputName.forEach(item => 
        req.check(item)
           .isInt()
           .withMessage(item[0].toUpperCase() + item.slice(1) + " must be a number")
    );
}

async function checkLengthPassword(req, inputName) {
    inputName.forEach(item => 
        req.check(item)
           .isLength({min:8})
           .withMessage(item[0]
           .toUpperCase() + item.slice(1) + " must be min:8 character")
    );
}

async function errorStr(link, req, res, next) {
    const errors = await req.getValidationResult();

    if (!errors.isEmpty()) {
        const strErrors = errors.array().map(item => item.msg);
        req.flash("errors", strErrors);
        res.redirect(link);
    } else {
        next();
    }
}

class InputValidation {
    async signup(req, res, next) {
        await notEmp(req, ['name', 'password']);
        await checkLengthPassword(req, ['password'])
        await errorStr("/signup", req, res, next);
    }

    async signin(req, res, next) {
        await notEmp(req, ['name', 'password']);
        await errorStr("/", req, res, next);
    }

    async add(req, res, next) {
        await notEmp(req, ['name', 'count']);
        await isNum(req, ['count']);
        await errorStr("/add", req, res, next);
    }
}

export default new InputValidation();