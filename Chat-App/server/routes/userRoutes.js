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
router.post("/addfriend",addFriend)
router.get("/userwithfriends/:id",getUserWithFriends)
router.post("/removefriend", removeFriend);


module.exports = router;