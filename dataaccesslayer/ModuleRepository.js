import { StringDictionary } from '../constants';
import { StorageHelper } from '../utilities';

export default ModuleRepository = {

    async getModulesByLocation(location) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + `/Modules/GetModulesByLocation/${location.id}`, {
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


    async createNewModule(module) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + '/Modules/CreateNewModule', {
            method: 'post',
            body: JSON.stringify(module),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.moduleSaveError);
        };

        return json;
    },

    async deleteModule(module) {

        const restHelper = await StorageHelper.getAuthenticatedRestData();

        const response = await fetch(restHelper.serverAddress + `/Modules/DeleteModule/${module.id}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${restHelper.token}`
            },
        });

        const json = await response.json();

        if (response.status != 200) {
            throw new Error(json.message ? json.message : StringDictionary.moduleDeleteError);
        };

        return json;
    }

};
