var constants = require('./constants');
var utils = require('./utils');
var loginLib = require('./login');
var UserData = require('./userData')


var noop = function noop() {};

var buildAuthHeader = function buildAuthHeader(userData) {
    var header = {};
    header['Content-Type'] = 'application/x-www-form-urlencoded'
    if (userData && userData.token) {
        header['token'] = userData.token
    }
    return header;
};

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
    function RequestError(type, message) {
        Error.call(this, message);
        this.type = type;
        this.errMessage = message;
    }

    RequestError.prototype = new Error();
    RequestError.prototype.constructor = RequestError;

    return RequestError;
})();

function request(options) {
    if (typeof options !== 'object') {
        var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
        throw new RequestError(constants.ERR_INVALID_PARAMS, message);
    }

    var requireLogin = options.login;
    var success = options.success || noop;
    var fail = options.fail || noop;
    var complete = options.complete || noop;
    var originHeader = options.header || {};

    // 成功回调
    var callSuccess = function () {
        success.apply(null, arguments);
        complete.apply(null, arguments);
    };

    // 失败回调
    var callFail = function (error) {
        fail.call(null, error);
        complete.call(null, error);
    };

    // 是否已经进行过重试
    var hasRetried = false;

    if (requireLogin) {
        doRequestWithLogin();
    } else {
        doRequest();
    }

    // 登录后再请求
    function doRequestWithLogin() {
        loginLib.login({ success: doRequest, fail: callFail });
    }

    // 实际进行请求的方法
    function doRequest() {
        var authHeader = buildAuthHeader(UserData.get())
        wx.request(utils.extend({}, options, {
            header: utils.extend({}, originHeader, authHeader),

            success: function (response) {
                var data = response.data;

                // 如果响应的数据里面包含 -- token 过期/失效/禁用/无效
                if (data && (data.errCode === 'uc.token.not.exists' 
                    || data.errCode === 'uc.token.not.opt.expire' 
                    || data.errCode === 'uc.token.verify.error'
                    || data.errCode === 'uc.user.status.invalid')) {
                    // 清除登录态
                    UserData.clear()

                    var error, message;
                    if (data.errCode === 'uc.token.not.exists' 
                        || data.errCode === 'uc.token.not.opt.expire' 
                        || data.errCode === 'uc.token.verify.error') {
                        // 如果是登录态无效，并且还没重试过，会尝试登录后刷新凭据重新请求
                        if (!hasRetried) {
                            hasRetried = true
                            doRequestWithLogin()
                            return;
                        }
                        message = '登录信息异常，请联系全栖智校客服';
                        error = new RequestError('', message);

                    } else {
                        message = '鉴权服务器检查登录态发生错误(' + (data.errCode || 'OTHER') + ')：' + (data.errMessage || '未知错误');
                        error = new RequestError('', message);
                    }

                    callFail(error);
                    return;
                }

                callSuccess.apply(null, arguments);
            },

            fail: callFail,
            complete: noop,
        }));
    };

};

module.exports = {
    RequestError: RequestError,
    request: request,
};