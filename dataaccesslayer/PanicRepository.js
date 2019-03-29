import { StringDictionary } from '../constants';
import { StorageHelper, Lib } from '../utilities';

export default PanicRepository = {

    async triggerPanicAlarm() {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/api/Panic', {
            method: 'post',
            body: JSON.stringify({ id: Lib.generateGuid() }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.panicErrorMessage);
        };

        return json;
    },
}