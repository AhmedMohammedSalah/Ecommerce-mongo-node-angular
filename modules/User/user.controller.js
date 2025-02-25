import { userModel } from "../../database/Models/user.model.js";

/**
 * @param res 
 * @author  Ahmed M.Salah
 * @edit add param   @editedBy Fatma Mustafa
 * @returns {Promise<void>} all users
 */
export async function getUsers(res) {
  try {
    const users = await userModel.find();
    if (users.length === 0) {
      return res.status(404).send("No users found");
    }
    res.json(users);
  } catch (err) {
    console.log("Error getting users", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @param {string} userId
 * @description get user by id
 * @author  Ahmed M.Salah
 * @edit not until now  
 * @editedBy editor
 * @returns {Promise<void>} user
 */
export async function getUser(userId, res) {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send("No user found");
    }
    res.json(user);
  } catch (err) {
    console.log("Error getting user", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @param {object} user
 * @description add user to database
 * @author  Ahmed M.Salah
 * @edit not until now  @editedBy editor
 * @returns {Promise<void>} added user
 */
export async function addUser(user, res) {
  try {
    const newUser = new userModel(user);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.log("Error adding user", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @param {string} userId
 * @param {object} user
 * @description update user by id with new user data
 * @author  Ahmed M.Salah
 * @edit not until now  @editedBy editor
 * @returns {Promise<void>} updated user
 */
export async function updateUser(userId, user, res) {

  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, user, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send("No user found");
    }
    res.json(updatedUser);
  } catch (err) {
    console.log("Error updating user", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @param {string} userId
 * @description delete user by id
 * @author  Ahmed M.Salah
 * @edit not until now  @editedBy editor
 * @returns {Promise<void>} deleted user
 */
export async function deleteUser(userId, res) {
  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("No user found");
    }
    res.json(deletedUser);
  } catch (err) {
    console.log("Error deleting user", err);
    res.status(500).send("Internal Server Error");
  }
}
