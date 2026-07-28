export class ApiError extends Error {
    statusCode;
    errors;
    constructor(statusCode, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
