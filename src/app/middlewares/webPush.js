// models/subscriptionModel.js
const webPush = require('web-push');

class SubscriptionModel {
    constructor() {
        // Khai báo cơ sở dữ liệu hoặc lưu trữ người dùng đã đăng ký (nếu cần)
    }
    async subscribeUser(subscription, message) {
        const vapidKeys = {
            publicKey: 'BMbPBGi-4vO4WgZBbFzvSxLGf5tCJKRifhpFGVvYAxR2Z6a7Q-VrSCYVqeae7djAI4aNf0g038eXtz1btPnPL5g',
            privateKey: 'YaKkhKyH_tT1iD5--pjYjFHTUiDDN64wvdF-7uqWZlU',
        };

        webPush.setVapidDetails(
            'mailto:vudinhdai03092001@gmail.com',
            vapidKeys.publicKey,
            vapidKeys.privateKey
        );
        try {
            await webPush.sendNotification(subscription, JSON.stringify({ title: message }));
            return { success: true, message: 'Subscription successful' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Subscription failed' };
        }
    }
}

module.exports = new SubscriptionModel;
