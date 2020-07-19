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
    // 登录
    login: `${host}/employee/login`,
    // 注册
    register: `${host}/employee/register`,
    // 忘记密码
    setPassword:`${host}/employee/setPassword`,
    // 重置密码
    resetPassword: `${host}/employee/resetPassword`,
    // 获取专业类型列表
    getSelectMajor: `${host}/itemsDetial/getSelectJson`,
    // 设置专业类型
    setProfession: `${host}/employee/setProfession`,
    
    // 获取每日十题完成
    getEverDayResult: `${host}/exam/checkDailyExam`,

    // 获取每日十题
    getEverDay: `${host}/exam/getDailyExam `,

    // 保存考试结果
    saveExamResult: `${host}/exam/saveQuestions `,

    // 保存考试结果
    getExamRecords: `${host}/exam/getExamRecords `,

    getRanking: `${host}/exam/getRanking`,
    // 获取统计
    getAchievement: `${host}/exam/getAchievement`,

    getWrongRecords: `${host}/exam/getWrongRecords`,

};

module.exports = config
