const express = require("express");
const router = express.Router();
const User = require("./Users");
const { MongoClient } = require("mongodb");

function generateRandomString(maxLen) {
	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	const minLength = 3;
	const maxLength = maxLen;

	const stringLength =
		Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

	let randomString = "";
	for (let i = 0; i < stringLength; i++) {
		const randomIndex = Math.floor(Math.random() * alphabet.length);
		randomString += alphabet[randomIndex];
	}

	return randomString;
}

//! MongoDB API

router.get("/MongoDBsave50NewUsers", async (req, res) => {
	// MongoDB connection URI
	const client = new MongoClient(process.env.URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	// for (let i = 0; i < 1; i++) {
	try {
		// console.log(i);
		// Connect to MongoDB
		await client.connect();

		const database = client.db("mongooseTest");
		const collection = database.collection("users");

		const name = generateRandomString(10);
		const email = generateRandomString(10);
		console.log(name, email);

		// Create a new document
		const newUser = { name, email };

		// Insert the document into the collection
		await collection.insertOne(newUser);

		console.log("New User");
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "An error occurred while saving/updating user information",
		});
		
	} finally {
		// Close the MongoDB connection
		await client.close();
		return res.send("Task completed");
	}
	// }
});

router.get("/MongoDBfindUserDetails50TimesAndUpdate", async (req, res) => {
	// MongoDB connection URI
	const client = new MongoClient(process.env.URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	// for (let i = 0; i < 1; i++) {
	try {
		// Connect to MongoDB
		await client.connect();
		// console.log(i)

		const database = client.db("mongooseTest");
		const collection = database.collection("users");

		const substring = generateRandomString(3);

		// Find a document matching the substring
		const existingUser = await collection.findOne({
			name: { $regex: substring, $options: "i" },
		});

		if (existingUser) {
			// Update the existing user with a new random name
			existingUser.name = generateRandomString(5); // Change the length as needed

			// Update the document in the collection
			await collection.updateOne(
				{ _id: existingUser._id },
				{ $set: { name: existingUser.name } }
			);

			console.log("User details updated:", existingUser);
		} else {
			// If no match found, create a new user with the random name
			const newUser = {
				name: generateRandomString(5),
				email: generateRandomString(10),
			};

			// Insert the new document into the collection
			await collection.insertOne(newUser);

			console.log("New user created:", newUser);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "An error occurred while saving/updating user information",
		});
	} finally {
		// Close the MongoDB connection
		await client.close();
	}
	// }
	return res.send("Task completed");
});

//! Mongoose API

router.get("/save50NewUsers", async (req, res) => {
	try {
		for (let i = 0; i < 250; i++) {
			const name = generateRandomString(10);
			const email = generateRandomString(10);
			console.log(name, email);
			const newUser = new User({ name, email });
			await newUser.save();
			console.log("New User");
		}
		return res.send("task completed");
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "An error occurred while saving/updating user information",
		});
	}
});

router.get("/findUserDetails50Times", async (req, res) => {
	try {
		for (let i = 0; i < 5; i++) {
			const substring = generateRandomString(3);
			const users = await User.find({
				name: { $regex: substring, $options: "i" },
			});
			console.log("Users with name containing", substring, ":", users);
		}
		res.send("task completed");
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "An error occurred while saving/updating user information",
		});
	}
});

router.get("/findUserDetails50TimesAndUpdate", async (req, res) => {
	try {
		for (let i = 0; i < 5; i++) {
			const substring = generateRandomString(3);
			const existingUser = await User.findOne({
				name: { $regex: substring, $options: "i" },
			});
			if (existingUser) {
				// Update the existing user with a new random name
				existingUser.name = generateRandomString(5); // Change the length as needed
				await existingUser.save();
				console.log("User details updated:", existingUser);
			} else {
				// If no match found, create a new user with the random name
				const newUser = new User({
					name: generateRandomString(5),
					email: generateRandomString(10),
				});
				await newUser.save();
				console.log("New user created:", newUser);
			}
		}
		res.send("task completed");
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "An error occurred while saving/updating user information",
		});
	}
});

module.exports = router;
