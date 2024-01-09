import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            `Something went Wrong while generating tokens ${error}`
        );
    }
};

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

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError("Email or username field is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(401, "User Not found ");
    }

    const checkPasswordCorrect = await user.isPasswordCorrect(password);
    if (!checkPasswordCorrect) {
        throw new ApiError(401, "Incorrect Password");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "user Logged In Successfully."
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req?.user._id,
        {
            $unset: { refreshToken: 1 },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User Logged out Successfully"));
});

export { registerUser, loginUser, logoutUser };
