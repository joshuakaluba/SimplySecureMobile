import { StringDictionary } from '../constants';
import { StorageHelper } from '../utilities';

export default UserAccountRepository = {

    async logIn(credentials) {

        const serverAddress = await StorageHelper.getServerAddress();

        const response = await fetch(serverAddress + '/Authentication/Login', {
            method: 'post',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.logInError)
        };

        return json;
    },

    async register(credentials) {

        const serverAddress = await StorageHelper.getServerAddress();

        const response = await fetch(serverAddress + '/Authentication/Register', {
            method: 'post',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.registerError)
        };

        return json;
    },

    async registerPushNotifications(pushNotificationToken) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/Authentication/RegisterPushNotifications', {
            method: 'post',
            body: JSON.stringify({ "token": pushNotificationToken }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.pushNotificationActivationError)
        };

        return json;
    },

    async unRegisterPushNotifications() {

        try {
            const pushNotificationToken = await StorageHelper.getPushNotificationToken();

            const serverAddress = await StorageHelper.getServerAddress();

            const response = await fetch(serverAddress + '/Authentication/UnRegisterPushNotifications', {
                method: 'post',
                body: JSON.stringify({ "token": pushNotificationToken }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const json = await response.json();

            if (response.status != 200) {
                throw new Error(json.message ? json.message : StringDictionary.pushNotificationActivationError)
            };

            return json;
        } catch (error) {
            console.log(error);
            //eat the error.
        }
    }
};
