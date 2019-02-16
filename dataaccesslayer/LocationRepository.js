import { StringDictionary } from '../constants';
import { StorageHelper } from '../utilities';

export default LocationRepository = {

    async getLocations() {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/Locations/GetLocations', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.locationRetrievalError);
        };

        return json;
    },

    async createNewLocation(location) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/Locations/CreateLocation', {
            method: 'post',
            body: JSON.stringify(location),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.locationSaveError);
        };

        return json;
    },

    async deleteLocation(location) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + `/Locations/DeleteLocation/${location.id}`, {
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
    },

    async updateLocationArmedState(location) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/Locations/ArmLocation', {
            method: 'post',
            body: JSON.stringify(location),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.armingLocationError)
        };

        return json;
    }
};
