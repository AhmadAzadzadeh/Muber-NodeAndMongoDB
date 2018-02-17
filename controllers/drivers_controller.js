const Driver = require("../models/driver");
module.exports = {
	greeting(req, res) {
		res.send({ hi: "there" });
	},
	create(req, res, next) {
		// console.log(req.body);
		const driverProps = req.body;
		// First Way To Write
		const driver = new Driver(driverProps);
		driver
			.save()
			.then(() => {
				res.send(driver);
			})
			.catch(next);
		// Second Way To Write
		// Driver.create(driverProps)
		//     .then((driver) => {
		//         res.send(driver);
		//     });
	},
	edit(req, res, next) {
		const driverId = req.params.id;
		const driverProps = req.body;
		Driver.findByIdAndUpdate(driverId, driverProps).then(() => {
			Driver.findById(driverId)
				.then(driver => {
					res.send(driver);
				})
				.catch(next);
		});
	},
	delete(req, res, next) {
		const driverId = req.params.id;
		Driver.findByIdAndRemove(driverId)
			.then(driver => {
				res.status(204).send(driver);
			})
			.catch(next);
	},
	index(req, res, next) {
		// Note than , in get request we don't have a body for our request, and now we are
		// going to use query string
		// http://google.com?lng=18&lat=20
		const { lng, lat } = req.query;
		Driver.geoNear(
			{ type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
			{ spherical: true, maxDistance: 200000 }
		)
			.then(drivers => res.send(drivers))
			.catch(next);
	}
};
