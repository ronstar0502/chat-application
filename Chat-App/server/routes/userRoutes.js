const {
    login,
    register,
    setAvatar,
    getAllUsers,
    addFriend,
    getUserWithFriends,
    removeFriend,
  } = require("../controllers/userController");

const router = require("express").Router()

router.post("/login", login);
router.post("/register", register);
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id",getAllUsers)
//router.post("/addfriend",addFriend)
router.get("/userwithfriends/:id",getUserWithFriends)
//router.post("/removefriend", removeFriend);

router.post("/addfriend", async (req, res) => {
  const result = await addFriend(req, res);
  if (result) {
    req.app.get("socketio").emit("friendUpdate");
  }
});

router.post("/removefriend", async (req, res) => {
  const result = await removeFriend(req, res);
  if (result) {
    req.app.get("socketio").emit("friendUpdate");
  }
});


module.exports = router;