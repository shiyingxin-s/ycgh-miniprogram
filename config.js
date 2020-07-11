/**
 * 小程序配置文件
 */

// 

var host = "https://www.chuanguhai.com"

var config = {

    //  Server 
    host,
    // 通过code 获取 openId
    getOpenIdByCode:  `${host}/employee/getOpenId`,

    login: `${host}/employee/login`,

    register: `${host}/employee/register`,


};

module.exports = config
