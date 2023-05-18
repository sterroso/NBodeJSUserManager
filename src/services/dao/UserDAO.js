import UserModel from "../../models/user.mongodb.model.js";
import UserDTO from "../dto/UserDTO.js";

export default class UserDAO {
    static getAll = async (query, options) => {
        try {
            const users = await UserModel.paginate(query, options);

            if (users.count === 0) {
                throw new Error("No users were found.");
            }

            users.payload = users.payload.map((user) => UserDTO.getLean(user));

            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static getBy = async (query) => {
        try {
            return UserDTO.getLean(await UserModel.findOne(query));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static create = async (document) => {
        try {
            return UserDTO.getLean(await UserModel.create(UserDTO.getCreateDocument(document)));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static update = async (query, document) => {
        try {
            return UserDTO.getLean(await UserModel.findOneAndUpdate(query, UserDTO.getUpdateDocument(document), { new: true }));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static delete = async (query) => {
        try {
            return await UserModel.findOneAndDelete(query);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}