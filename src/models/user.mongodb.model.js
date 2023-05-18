import { Schema, model } from "mongoose";
import MongooseDelete from "mongoose-delete";
import MongoosePaginate from "mongoose-paginate-v2";
import { 
    USER_GENDERS, 
    DEFAULT_USER_GENDER,
    USER_ROLES,
    DEFAULT_USER_ROLE
} from "../constants/user.constants.js";

export const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        minLength: 3,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        minLength: 1,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        default: DEFAULT_USER_GENDER,
        validate: {
            validator: (v) => Object.values(USER_GENDERS).includes(v),
            message: (props) => `"${props.value}" is not a valid user gender value.`,
        },
    },
    roles: {
        type: [String],
        required: true,
        enum: Object.values(USER_ROLES),
        default: [DEFAULT_USER_ROLE],
    },
}, { timestamps: true });

UserSchema.plugin(MongooseDelete, { indexFields: ["deleted", "deletedAt"], overrideMethods: "all" });

UserSchema.plugin(MongoosePaginate);

const Users = model("users", UserSchema);

export default Users;