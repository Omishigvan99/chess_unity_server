import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, username, email, password } = req.body;
    console.log(name, username, email, password);
    if (
        [name, username, password, email].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const exsitedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (exsitedUser) {
        throw new ApiError(400, "username or email is already exists ");
    }

    const user = await User.create({
        name,
        username: username.toLowerCase(),
        email,
        password,
    });

    const checkUserCreate = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!checkUserCreate) {
        throw new ApiError(500, "Something Went wrong while creating a user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                checkUserCreate,
                "User has beens successfuly Created"
            )
        );
});

export { registerUser };
