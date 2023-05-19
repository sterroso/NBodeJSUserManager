import { UserService } from "../services/index.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAll();

    return res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    return res.status(500).json({ status: "Internal Server Error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json({ status: "Not Found", error: `No user with id "${userId}" was found.`});
    }

    return res.status(200).json({ status: "OK", payload: user });
  } catch (error) {
    return res.status(500).json({ status: "Internal Server Error", error: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = UserService.getByEmail(email);

    if (!user) {
      return res.status(404).json({ status: "Not Found", error: `No user with email "${email}" was found.` });
    }

    return res.status(200).json({ status: "OK", payload: user });
  } catch (error) {
    return res.status(500).json({ status: "Internal Server Error", error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { body } = req;

  try {
    const newUser = UserService.create(body);

    if (!newUser) {
      return res.status(400).json({ status: "Bad Request", error: "User could not be created with the provided parameters." });
    }

    return res.status(201).json({ status: "Created", payload: newUser });
  } catch (error) {
    return res.status(500).json({ status: "Internal Server Error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;

  const { body } = req;

  try {
    const updatedUser = await UserService.update(userId, body);

    if (!updatedUser) {
      return res.status(404).json({ status: "Not Found", error: `No user with id "${userId}" was found.`});
    }

    return res.status(200).json({ status: "OK", payload: updatedUser });
  } catch (error) {
    return res.status(500).json({ status: "Internal Server Error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const confirmation = await UserService.delete(userId);

    return res.status(200).json({ status: "OK", message: confirmation });
  } catch (error) {
    return res.status(500).json({ status: "Internal Server Error", error: error.message });
  }
};
