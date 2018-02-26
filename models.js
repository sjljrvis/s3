module.exports.models = (app, mongoose) => {
	let UserSchema = function (app, mongoose) {
		var UserSchema = new mongoose.Schema({
			userName: String,
			email: { type: String, unique: true },
			password: { type: String },
			confirmPassword: { type: String },
			phoneNumber: String,
			firstName: String,
			lastName: String,
			date: {
				type: Date,
				default: Date.now()
			},
		});

		UserSchema.index({
			username: 1
		});
		UserSchema.set('autoIndex', (app.get('env') === 'development'));
		app.db.model('User', UserSchema);

	};
	UserSchema(app, mongoose);
}