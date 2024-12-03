

const successResponse = (res, title, data = {}) => {
    return res.status(200).json({
        message: title,
        ...data,
    });
};

module.exports = successResponse;
