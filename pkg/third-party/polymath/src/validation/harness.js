class ValidationLogger {
    results = [];
    exception(exception) {
        const success = false;
        const description = exception.name;
        this.results.push({ description, success, exception });
    }
    log(success, description) {
        this.results.push({ description, success });
    }
}
class ValidationCheck {
    description;
    handler;
    constructor(description, handler) {
        this.description = description;
        this.handler = handler;
    }
    run(logger, c) {
        logger.log(this.handler(c), this.description);
    }
}
// A simple test-like validation harness.
export class Harness {
    endpoint;
    fatal = false;
    log = new ValidationLogger();
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    async validate(args, ...checks) {
        if (this.fatal)
            return;
        let response;
        try {
            response = await this.endpoint(args);
        }
        catch (e) {
            this.log.exception(e);
            this.fatal = true;
            return;
        }
        try {
            checks.forEach((check) => check.run(this.log, { response, args }));
        }
        catch (e) {
            this.log.exception(e);
        }
    }
}
export const check = (description, checker) => {
    return new ValidationCheck(description, checker);
};
