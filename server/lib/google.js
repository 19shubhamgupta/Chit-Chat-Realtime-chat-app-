const { Google } = require("arctic");

exports.google = new Google(
   process.env.Client_ID,
   process.env.Client_secret,
   "http://localhost:5001/api/auth/google/callback"
)