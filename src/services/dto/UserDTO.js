import DTF from "../../constants/dataTransformationFormats.constants.js";
import { DEFAULT_USER_GENDER, DEFAULT_USER_ROLE, USER_ROLES } from "../../constants/user.constants";

export default class UserDTO {
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
                        password: document.password,
                        gender: document?.gender || DEFAULT_USER_GENDER,
                        dateOfBirth: isNaN(parsedDateOfBirth) ? undefined : new Date(parsedDateOfBirth),
                        roles: filteredRoles,
                    }
                } catch (error) {
                    throw new Error(error.message);
                }

            // UPDATE format will check for, at least, one.
            case DTF.UPDATE:
            default:
                throw new Error("Unknown User data trnsformation format.");
        }
    }
}