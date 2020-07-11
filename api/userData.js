

var UserData = {
    get: function () {
        return wx.getStorageSync('userData') || null;
    },

    set: function (userData) {
        wx.setStorageSync('userData', userData);
    },

    clear: function () {
        wx.removeStorageSync('userData');
    },
};

module.exports = UserData;