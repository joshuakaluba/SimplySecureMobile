import { StringDictionary } from '../constants';
import { StorageHelper } from '../utilities';

export default PanicRepository = {

    async triggerPanicAlarm() {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/api/Panic', {
            method: 'post',
            body: JSON.stringify({ id: "02332a2b-b8e9-49e4-a37d-6bdb924271a7" }), //TODO
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