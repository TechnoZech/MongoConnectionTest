// ! requiring packages
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

// ! initializing packages
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ! server configuration
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// ! database connection
mongoose
	// .connect(process.env.URL, { maxPoolSize: 1 })
	.connect(process.env.URL)
	.then(() => {
		console.log("db Connected!");
	})
	.catch((error) => {
		console.log(error);
	});

// Middleware to handle closing the MongoDB connection when the application exits
process.on("SIGINT", () => {
	mongoose.connection.close(() => {
		console.log("MongoDB connection closed through app termination");
		process.exit(0);
	});
});

app.get("/", function (req, res) {
	res.send("server is working");
});

// ! requiring routes
const route = require("./route");
app.use(route);

// ! listening to port
app.listen(8080, () => {
	console.log(`server started on port ${8080}`);
});
