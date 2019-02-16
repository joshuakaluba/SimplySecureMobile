import { StringDictionary } from '../constants';
import { StorageHelper } from '../utilities';

export default LocationActionEventsRepository = {

    async getLocationEventHistory(location) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + `/LocationActionEvents/GetLocationHistory/${location.id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.locationUsersRetrievalError);
        };

        return json;
    }
};
