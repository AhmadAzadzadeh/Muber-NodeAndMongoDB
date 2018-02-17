const assert = require("assert");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const Driver = mongoose.model("driver");
describe("The express app", () => {
	it("should handle a GET request to /api", done => {
		request(app)
			.get("/api")
			.end((err, res) => {
				// console.log(res);
				assert(res.body.hi == "there");
				done();
			});
	});
});

describe("Drivers Controller", () => {
	it("should POST to /api/drivers creates a new driver", done => {
		Driver.count().then(count => {
			request(app)
				.post("/api/drivers")
				.send({ email: "test@test.com" })
				.end((err, res) => {
					Driver.count().then(newCount => {
						assert(count + 1 === newCount);
						done();
					});
				});
		});
	});
	it("should PUT to /api/drivers/id  update a driver", done => {
		const driver = new Driver({ email: "vahid@test.com", driving: true });
		driver.save().then(() => {
			request(app)
				.put(`/api/drivers/${driver._id}`)
				.send({ driving: false })
				.end((err, res) => {
					assert(res.body.driving === false);
					done();
				});
		});
	});
	it("should DELETE to /api/drivers/id delete a driver", done => {
		const driver = new Driver({ email: "ahmad@test.com", driving: true });
		driver.save().then(() => {
			Driver.count().then(count => {
				request(app)
					.delete(`/api/drivers/${driver._id}`)
					.end((err, res) => {
						Driver.count(newCount => {
							assert(newCount + 1 === count);
							done();
						});
					});
			});
		});
	});

	it("should GET to /api/drivers finds drivers in a location", done => {
		const tehranDriver = new Driver({
			email: "tehran@test.com",
			geometry: { type: "Point", coordinates: [-122, 47] }
		});

		const bojnourdDriver = new Driver({
			email: "bojnourd@test.com",
			geometry: { type: "Point", coordinates: [-80, 25] }
		});
		Promise.all([tehranDriver.save(), bojnourdDriver.save()]).then(() => {
			request(app)
				.get("/api/drivers?lng=-80&lat=25")
				.end((err, res) => {
					// console.log(res);
					assert(res.body.length === 1);
					assert(res.body[0].obj.email === "bojnourd@test.com");
					done();
				});
		});
	});
});
