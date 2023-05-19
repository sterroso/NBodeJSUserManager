import { hashSync } from "bcrypt";
import { DEFAULT_SALT_ROUNDS } from "../../constants/app.constants.js";
import DTF from "../../constants/dataTransformationFormats.constants.js";
import { DEFAULT_USER_GENDER, DEFAULT_USER_ROLE, USER_GENDERS, USER_ROLES } from "../../constants/user.constants.js";

/**
 * An User Data Transformation Object is a middleware utility that
 * transforms MongoDB documents to JSON objects or cleans plain JSON
 * objects to include only the properties needed to CREATE a new
 * MongoDB User document or UPDATE an existing one.
 */
export default class UserDTO {
    /**
     * Transforms a User's MongoDB to a small document containing
     * only the User's id and full name.
     * 
     * @param {{_id: import("mongoose").ObjectId, email: string, password: string, firstName: string, lastName: string, dateOfBirth: import("mongoose").Date, gender: string, roles: [string]}} document A MongoDB document
     * containing a User's record.
     * @returns {{id: string, fullName: string}} A plain JSON object
     * containing the User's id and full name.
     */
    static getListItem = (document) => UserDTO.get(document, { format: DTF.LIST_ITEM });

    /**
     * Transforms a User's MongoDB to a small document containing
     * only the User's id, full name and roles. Intended to return
     * the minimum information required to store in a JWT access
     * and/or refresh token.
     * 
     * @param {{_id: import("mongoose").ObjectId, email: string, password: string, firstName: string, lastName: string, dateOfBirth: import("mongoose").Date, gender: string, roles: [string]}} document A MongoDB document
     * containing a User's record.
     * @returns {{id: string, fullName: string, roles: [string]}} A plain JSON object
     * containing the User's id, full name and roles.
     */
    static getCookie = (document) => UserDTO.get(document, { format: DTF.BRIEF });

    /**
     * Transforms a User's MongoDB to a lean JSON document containing
     * only the User's non-sensitive information.
     * 
     * @param {{_id: import("mongoose").ObjectId, email: string, password: string, firstName: string, lastName: string, dateOfBirth: import("mongoose").Date, gender: string, roles: [string]}} document A MongoDB document
     * containing a User's record.
     * @returns {{id: string, firstName: string, lastName: string, dateOfBirth: Date, age: number, gender: string, roles: [string]}} A plain JSON object
     * containing the User's non-sensitive information.
     */
    static getLean = (document) => UserDTO.get(document, { format: DTF.LEAN });

    /**
     * Cleans and formats a plan JSON object to include only those
     * properties required to create a new User record.
     * 
     * The password field is hashed using the app's default constants.
     * 
     * @param {{email: string, password: string, firstName: string, lastName: string, dateOfBirth?: Date, gender?: string, roles?: [string]}} document A JSON object.
     * @returns {{email: string, password: string, firstName: string, lastName: string, dateOfBirth?: Date, gender: string, roles: [string]}} A plain JSON object
     * containing the property-value pairs required to create a new User.
     */
    static getCreateDocument = (document) => UserDTO.get(document, { format: DTF.CREATE });

    /**
     * Cleans and formats a plan JSON object to include only those
     * properties required to update an existing User record.
     * 
     * The password field is hashed using the app's default constants.
     * 
     * @param {{email?: string, password?: string, firstName?: string, lastName?: string, dateOfBirth?: Date, gender?: string, roles?: [string]}} document A JSON object.
     * @returns {{email?: string, password?: string, firstName?: string, lastName?: string, dateOfBirth?: Date, gender?: string, roles?: [string]}} A plain JSON object
     * containing the property-value pairs required to update an
     * existing User.
     */
    static getUpdateDocument = (document) => UserDTO.get(document, { format: DTF.UPDATE });

    static get = (document, options = { format: DTF.LEAN }) => {
        if (!document) {
            throw new Error("Document to be trasnformed is missing.");
        }

        switch (options?.format || DTF.LEAN) {
            // ITEM_LIST format receives a MongoDB User document
            // and returns a JSON object containing only id and
            // fullName properties.
            case DTF.LIST_ITEM:
                if (
                    !(document?._id || false) ||
                    !(document?.firstName || false) ||
                    !(document?.lastName || false)
                    ) {
                    throw new Error("Missing data on input document.");
                }

                try {
                    return {
                        id: document._id,
                        fullName: `${document?.firstName} ${document?.lastName}`,
                    }
                } catch (error) {
                    throw new Error(error.message);
                }
            
            // BRIEF format will return a User's cookie information
            // JSON object.
            case DTF.BRIEF:
                if (
                    !(document?._id || false) ||
                    !(document?.firstName || false) ||
                    !(document?.lastName || false)
                ) {
                    throw new Error("Missing data on input document.");
                }

                try {
                    return {
                        id: document._id,
                        name: `${document.firstName} ${document.lastName}`,
                        roles: document.roles,
                    }
                } catch (error) {
                    throw new Error(error.message);
                }
            
            // LEAN and FULL formats will return the same JSON document:
            // a User's complete record, except his/her sensitive infor-
            // mation (password, e-mail)
            case DTF.LEAN:
            case DTF.FULL:
                if (
                    !(document?._id || false) ||
                    !(document?.firstName || false) ||
                    !(document?.lastName || false)
                ) {
                    throw new Error("Missing data on input document.");
                }

                try {
                    return {
                        id: document._id,
                        firstName: document.firstName,
                        lastName: document.lastName,
                        dateOfBirth: document?.dateOfBirth || undefined,
                        age: document?.age || undefined,
                        gender: document?.gender || undefined,
                        roles: document?.roles || undefined,
                    }
                } catch (error) {
                    throw new Error(error.message);
                }

            // CREATE format will receive a plain JSON object and will
            // check if it contains the minimum properties to create a
            // new MongoDB User document. Also will filter valid User
            // roles, assign a default value for gender and parse date 
            // of birth.
            case DTF.CREATE:
                if (
                    !(document?.firstName || false) ||
                    !(document?.lastName || false) ||
                    !(document?.email || false) ||
                    !(document?.password || false)
                ) {
                    throw new Error("Missing data on input document.");
                }

                try {
                    const parsedDateOfBirth = Date.parse(document?.dateOfBirth || "none");

                    const filteredRoles = (document?.roles || [DEFAULT_USER_ROLE]).map((role) => {
                        if (Object.values(USER_ROLES).includes(role))
                            return role;
                    });

                    return {
                        firstName: document.firstName,
                        lastName: document.lastName,
                        email: document.email,
                        password: hashSync(document.password, DEFAULT_SALT_ROUNDS),
                        gender: document?.gender || DEFAULT_USER_GENDER,
                        dateOfBirth: isNaN(parsedDateOfBirth) ? undefined : new Date(parsedDateOfBirth),
                        roles: filteredRoles,
                    }
                } catch (error) {
                    throw new Error(error.message);
                }

            // UPDATE format will check for, at least, one valid property
            // to be updated.
            case DTF.UPDATE:
                if (
                    !(document?.email || false) ||
                    !(document?.password || false) ||
                    !(document?.firstName || false) ||
                    !(document?.lastName || false) ||
                    !(document?.dateOfBirth || false) ||
                    !(document?.gender || false) ||
                    !(document?.roles || false)
                ) {
                    throw new Error("Must provide, at least, one user property to update.");
                }

                try {
                    const updateDocument = {};

                    updateDocument.email = document?.email || undefined;

                    if (document?.password || false) {
                        updateDocument.password = hashSync(document.password, DEFAULT_SALT_ROUNDS);
                    }

                    updateDocument.firstName = document?.firstName || undefined;

                    updateDocument.lastName = document?.lastName || undefined;

                    if (document?.dateOfBirth || false) {
                        const parsedDate = Date.parse(document.dateOfBirth);

                        updateDocument.dateOfBirth = isNaN(parsedDate) ? undefined : new Date(parsedDate);
                    }

                    if (document?.gender || false) {
                        updateDocument.gender = 
                            Object.values(USER_GENDERS).includes(document.gender) ? 
                            document.gender : 
                            undefined;
                    }

                    if (document?.roles || false) {
                        updateDocument.roles = document.roles
                    }

                    return updateDocument;
                } catch (error) {
                    throw new Error(error.message);
                }
            default:
                throw new Error("Unknown User data trnsformation format.");
        }
    }
}
