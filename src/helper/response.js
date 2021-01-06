const response = {
    success: (res, data, message) => {
        const result = {
            message,
            success: true,
            code: 200,
            data
        };

        res.json(result);
    },
    failed: (res, data, message) => {
        const result = {
            message,
            success: false,
            code: 500,
            data
        };

        res.json(result);
    },
    successWithMeta: (res, data, meta, message) => {
        const result = {
            message,
            success: true,
            code: 200,
            meta,
            data
        };

        res.json(result);
    },
    successToken: (res, data, message) => {
        const result = {
            message,
            success: true,
            code: 200,
            data
        };

        res.json(result);
    },
    errToken: (res, data, message) => {
        const result = {
            message,
            success: false,
            code: 500,
            data
        };

        res.json(result);
    },
    errTokenExpired: (res, data, message) => {
        const result = {
            message,
            success: false,
            code: 500,
            data
        };

        res.status(500).json(result);
    }

};

module.exports = response;