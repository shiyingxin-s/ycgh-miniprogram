var constants = require('./constants');
var utils = require('./utils');
var UserData = require('./userData')


var noop = function noop() {};

var buildAuthHeader = function buildAuthHeader(userData) {
    var header = {};
    header['Content-Type'] = 'application/json'
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

   

    // // 登录后再请求
    // function doRequestWithLogin() {
    //     loginLib.login({ success: doRequest, fail: callFail });
    // }

    // 实际进行请求的方法
    // function doRequest() {
    var authHeader = buildAuthHeader(UserData.get())
    wx.request(utils.extend({}, options, {
        header: utils.extend({}, originHeader, authHeader),
        success: function (response) {
            var data = response.data;
            var error, message;
            if(data && data.code === 1) {
                message = '';
                error = new RequestError('', data.msg);
            } else {
                message = '鉴权服务器检查登录态发生错误(' + (data.code || 'OTHER') + ')：' + (data.msg || '未知错误');
                error = new RequestError('', data.msg);
            }
            if(data.code !== 0){
                if(data.code === 12 )
                {  
                    message = '';
                    error = new RequestError('', '登录异常，请重新登录');
                    wx.redirectTo({
                        url: '/page/login/index',
                    })
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

module.exports = {
    RequestError: RequestError,
    request: request,
};