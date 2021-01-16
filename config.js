/**
 * 小程序配置文件
 */

// 
var devName = 'https://api.321jianyi.cn'
var onlineName = 'https://api.yqktgh.com'

var host = onlineName

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

    getHomeHtml:`${host}/employee/getHtml`,

    // 保存职工讲堂
    saveHallStyle:`${host}/staffHall/saveStaffHall`,

    saveStaffStyle:`${host}/staffStyle/saveStaffStyle`,

    // 上传文件
    uploadfile:`${host}/file/uploadfile`,

    getStaffHall:`${host}/staffHall/getStaffHall`,
    
    getStaffStyle:`${host}/staffStyle/getStaffStyle`,

    staffHallLike: `${host}/staffHall/updateLikeNum`, 

    staffStyleLike:`${host}/staffStyle/updateLikeNum`,

    deleteHall:`${host}/staffHall/deleteStaffHall`,

    deleteStyle: `${host}/staffStyle/deleteStaffStyle`,


    staffstyleDetail: `${host}/staffStyle/getStaffStyleById`,


    // 保存身高 体重
    setBodyConfig: `${host}/employee/setBodyConfig`,

    // 获取健身视频
    getFitnessVideo: `${host}/fitnessTeching/getFitnessTeching`,

    // 打卡签到
    signIn:`${host}/fitnessHistory/signInFitness`,

    // 打卡签退
    signBack: `${host}/fitnessHistory/signOutFitness`,

    // 保存看视频
    saveFitnessVedio:`${host}/fitnessVedio/saveFitnessVedio`,

    // 我的运动
    getFitnessHistory: `${host}/fitnessHistory/getFitnessHistory`,

    // 获取健身排行
    getFitnessRecords:`${host}/fitnessHistory/getFitnessRecords`
};

module.exports = config
