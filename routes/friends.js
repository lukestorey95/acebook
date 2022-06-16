const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.get("/friends", UsersController.Index);
router.post("/friends", UsersController.AddFriend);

module.exports = router;