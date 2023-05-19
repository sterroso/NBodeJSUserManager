import UserRepository from "./repositories/UserRepository.js";

import UserDAO from "./dao/UserDAO.js";

export const UserService = new UserRepository(UserDAO);
