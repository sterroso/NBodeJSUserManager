import Repository from "./Repository.js";

export default class UserRepository extends Repository {
    constructor(dao) {
        super(dao);
    }

    getById = async (userId) => {
        try {
            const result = await this.dao.getBy({ _id: userId });

            if (!result) {
                throw new Error(`User with id "${userId}" not found.`);
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getByEmail = async (email) => {
        try {
            const result = await this.dao.getBy({ email: email });

            if (!result) {
                throw new Error(`User with email "${email}" not found.`);
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getRoles = async (userId) => {
        try {
            const user = await this.dao.getBy({ _id: userId });

            if (!user) {
                throw new Error(`User with id "${userId}" not found.`);
            }

            return user?.roles || [];
        } catch (error) {
            throw new Error(error.message);
        }
    }
}