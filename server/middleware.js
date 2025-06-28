const { todogroupSchema } = require("./schemas");
const AppError = require("./utils/AppError");

module.exports.validateTodoGroup = (req, res, next) => {
	const { error } = todogroupSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new AppError(msg, 400);
	}
	next();
};
