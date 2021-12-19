module.exports = {
    OK: {code: 200},
    CREATED: {code: 201},
    ACCEPTED: {code: 202},
    BAD_REQUEST: {code: 400, msg: 'Bad Request'},
    UNAUTHORIZED: {code: 401, msg: 'Service Unavailable'},
    FORBIDDEN: {code: 403, msg: 'Service Unavailable'},
    NOT_FOUND: {code: 404, msg: 'Service Unavailable'},
    INTERNAL_SERVER_ERROR: {code: 500, msg: 'Service Unavailable'},
    NOT_IMPLEMENTED: {code: 501, msg: 'Service Not Implemented'},
    BAD_GATEWAY: {code: 502, msg: 'Service Unavailable'},
    SERVICE_UNAVAILABLE: {code: 503, msg: 'Service Unavailable'}
}