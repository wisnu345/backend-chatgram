const response = {
  success: (res, data, message) => {
    const result = {
      message: message,
      success: true,
      code: 200,
      data: data,
    };
    res.json(result);
  },
  failed: (res, data, message) => {
    const result = {
      message: message,
      success: false,
      code: 500,
      data: data,
    };
    res.json(result);
  },
  successLogin: (res, name, token, refreshToken, message) => {
    const result = {
      token,
      message: message,
      success: true,
      code: 200,
      data: {
        username: name,
        token: token,
        refreshToken
      },
    };
    res.json(result);
  }
};

module.exports = response;
