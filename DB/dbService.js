const connectToLocalDb = require("./mongodb/connectToMongodbLocally");
const connectToAtlasDb = require("./mongodb/connectToAtlas");
const config = require("config");
const enviorment = config.get("ENVIRONMENT");

const connectToDb = async () => {
    if (enviorment === "development") {
        await connectToLocalDb();
    }
    if (enviorment === "production") {
        await connectToAtlasDb();
    }
};

module.exports = connectToDb;