import { StringDictionary } from '../constants';
import { StorageHelper } from '../utilities';

export default LocationUsersRepository = {

    async getLocationUsers(location) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + `/LocationUsers/GetLocationUsers/${location.id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.locationUsersRetrievalError)
        };

        return json;
    },

    async createNewLocationUser(locationUser) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/LocationUsers/CreateNewLocationUser', {
            method: 'post',
            body: JSON.stringify(locationUser),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.locationSaveError)
        };

        return json;
    },

    async deleteLocationUser(locationUser) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + `/LocationUsers/DeleteLocationUser/${locationUser.id}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.locationDeleteError)
        };

        return json;
    }
};
