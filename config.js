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
    getEverDay: `${host}/exam/getDailyExam`,

    // 保存考试结果
    saveExamResult: `${host}/exam/saveQuestions`,

    // 保存考试结果
    getExamRecords: `${host}/exam/getExamRecords`,

    getRanking: `${host}/exam/getRanking`,
    // 获取统计
    getAchievement: `${host}/exam/getAchievement`,

    getWrongRecords: `${host}/exam/getWrongRecords`,

    getExercise: `${host}/exam/getExercise`,

    // 删除错题
    deleteWrong: `${host}/exam/deleteWrongRecords`,

    // 考试列表
    getExamList: `${host}/exam/getExamList`,

    // 获取试卷详情 getExamDetail
    getExamDetail: `${host}/exam/getExamDetial`,// getExamDetial

    // 获取考试回顾
    getRecordDetail: `${host}/exam/getRecordDetial`,
    
    //aid/getAidList
    getAidList: `${host}/aid/getAidList`,

    // 提交
    submitAid: `${host}/aid/submitAid`,

    getAidDetial: `${host}/aid/getAidDetial`,

    revokeAid: `${host}/aid/revokeAid`,

    // 获取个人信息
    getPersonalInfo:`${host}/employee/getPersonalInfo`,

    // 保存 微信头像
    saveWxInfo:`${host}/employee/saveWxInfo`,

    //
    getMessages:`${host}/employee/getMessages`,

    setMessageStatus: `${host}/employee/setMessageStatus`,


};

module.exports = config
