const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
}

module.exports.getUserWithFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("friends").exec();
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
}

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id).populate("friends");

    const friendIds = currentUser.friends.map((friend) => friend._id);

    const users = await User.find({
      _id: {
        $nin: [...friendIds, req.params.id],
      },
    }).select(["email", "username", "avatarImage", "_id"]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
}


module.exports.addFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    console.log("Finding user");
    const user = await User.findById(userId).populate("friends");
    console.log("User found:", user);

    const isFriendAlreadyAdded = user.friends.some(
      (friend) => friend._id.toString() === friendId
    );

    if (isFriendAlreadyAdded) {
      return res.status(400).json({ message: "Friend already added" });
    }
    const friend = await User.findById(friendId);
    console.log("friend found", friend);
    console.log("Adding friend");
    await User.findByIdAndUpdate(userId, {
      $push: { friends: friend },
    });
    console.log("Friend added");
    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error in addFriend:", error);
    res.status(500).json({ message: "Error adding friend", error });
  }
}

module.exports.removeFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    // Check if the friend exists in the user's friends list
    const user = await User.findById(userId).populate("friends");
    const friendToRemove = user.friends.some(
      (friend) => friend._id.toString() === friendId
    );

    if (!friendToRemove) {
      return res.status(400).json({ message: "Friend not found" });
    }

    // Remove friend from user's friends array
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing friend", error });
  }
};



