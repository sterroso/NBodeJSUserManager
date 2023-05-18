export default class Repository {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getAll = async (query, options) => {
        try {
            const results = await this.dao.getAll(query, options);
    
            if (results.count > 0) {
                return results;
            }
    
            throw new Error("Not found.");
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getBy = async (query) => {
        try {
            const result = await this.dao.getBy(query);
    
            if (!result) {
                throw new Error("Not found.");
            }
    
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    create = async (document) => {
        try {
            const result = await this.dao.create(document);

            if (!result) {
                throw new Error("Not created.");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    update = async (query, document) => {
        try {
            const result = await this.dao.update(query, document);

            if (!result) {
                throw new Error("Not updated.");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    delete = async (query) => {
        try {
            const result = await this.dao.delete(query);

            if (!result) {
                throw new Error("Not deleted.");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}