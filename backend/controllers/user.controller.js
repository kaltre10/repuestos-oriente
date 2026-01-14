import userService from '../services/user.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Google authentication
const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return responser.error({
      res,
      message: 'Token is required',
      status: 400,
    });
  }

  const user = await userService.authenticateWithGoogle(token);

  responser.success({
    res,
    message: 'Authentication successful',
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  responser.success({
    res,
    body: { users },
  });
});

// Get user by ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  responser.success({
    res,
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// Update user profile
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const user = await userService.updateUser(id, updateData);

  responser.success({
    res,
    message: 'User updated successfully',
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteUser(id);

  responser.success({
    res,
    message: result.message,
  });
});

export {
  googleAuth,
  getUser,
  updateUser,
  deleteUser,
  getUsers
};
