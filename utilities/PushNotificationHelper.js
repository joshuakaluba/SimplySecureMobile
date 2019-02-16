import { Permissions, Notifications } from 'expo';
import { UserAccountRepository } from '../dataaccesslayer';
import StorageHelper from './StorageHelper';

export default PushNotificationHelper = {

    async registerForPushNotificationsAsync() {
        try {
            const { status: existingStatus } = await Permissions.getAsync(
                Permissions.NOTIFICATIONS
            );

            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return;
            }

            let token = await Notifications.getExpoPushTokenAsync();

            await UserAccountRepository.registerPushNotifications(token);

            await StorageHelper.savePushNotificationToken(token);

        } catch (error) {
            console.log(error);
        }
    }
}

