var utils = require('./utils');
var UserData = require('./userData');
const configUrl = require('../config')
const common = require('../util/common.js')

const app = getApp()
/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
    function LoginError(type, message) {
        Error.call(this, message);
        this.type = type;
        this.errMessage = message;
    }

    LoginError.prototype = new Error();
    LoginError.prototype.constructor = LoginError;

    return LoginError;
})();

/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(callback) {
    wx.login({
        success: function (loginResult) {
            callback(null, {
                code: loginResult.code
            });
        },
        fail: function (loginError) {
            var error = new LoginError('', '微信登录失败，请检查网络状态');
            error.detail = loginError;
            callback(error, null);
        },
    });
};

var noop = function noop() {};
var defaultOptions = {
    method: 'GET',
    success: noop,
    fail: noop,
    loginUrl: configUrl.loginByCode,
};

/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
    options = utils.extend({}, defaultOptions, options);

    if (!defaultOptions.loginUrl) {
        options.fail(new LoginError('', '登录错误：缺少登录地址'));
        return;
    }

    var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
        if (wxLoginError) {
            options.fail(wxLoginError);
            return;
        }
        // 构造请求头
        var code = wxLoginResult.code;
        var header = {};
        header['Content-Type'] = 'application/x-www-form-urlencoded'
        common.showLoading()
        // 请求服务器登录地址，获得会话信息
        wx.request({
            url: options.loginUrl,
            header: header,
            method: options.method,
            data: {code: code},

            success: function (res) {
                common.hideLoading()
                var resData = res.data
                // 成功地响应会话信息
                if (resData.data && resData.code === 200) {
                    UserData.set(resData.data)
                    if(resData.data.token){
                      getMenu(resData.data)
                    } else {
                      options.success(res.data)
                    }                    
                } else {
                    var errorMessage = '登录异常,请联系全栖智校客服';
                    var noSessionError = new LoginError('', errorMessage);
                    options.fail(noSessionError);
                }
            },
            // 响应错误
            fail: function (loginResponseError) {
                common.hideLoading()
                var error = new LoginError('', '登录失败，网络错误或者服务器发生异常');
                options.fail(error);
            },
        });
    });

    var userData = UserData.get()
    if (userData && app.globalData.menuList) {
        options.success(userData)
    } else {
        doLogin()
    }

};



module.exports = {
    LoginError: LoginError,
    login: login,
};