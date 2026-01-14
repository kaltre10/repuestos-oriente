// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      errors: err.errors.map(e => ({
        field: e.path,
        message: `${e.path} already exists`,
      })),
    });
  }

  // Custom error
  if (err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Generic server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export default globalErrorHandler;
