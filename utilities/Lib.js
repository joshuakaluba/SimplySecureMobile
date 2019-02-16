import Validator from 'validator';
import moment from 'moment';
import StorageHelper from './StorageHelper';

export default Lib = {

    showError(error) {
        console.log(error);
        setTimeout(() => { alert(error); }, 500);
    },

    sanitizeServerAddress(serverAddress) {
        serverAddress = serverAddress.endsWith('/') ? serverAddress.slice(0, -1) : serverAddress;
        serverAddress = serverAddress.startsWith('https://') == false ? `https://${serverAddress}` : serverAddress;
        return serverAddress;
    },

    validateServerAddress(serverAddress) {
        let serverValidationOptions = {
            protocols: ['https'],
            require_tld: true,
            require_protocol: true,
            require_host: true,
            require_valid_protocol: true
        };
        return Validator.isURL(serverAddress, serverValidationOptions);
    },

    getFormattedDate(dateToFormat) {
        return moment.utc(dateToFormat).local().format("hh:mm:ss A - ddd, MMM Do, YYYY");
    },

    getFormattedShortDate(dateToFormat) {
        return moment.utc(dateToFormat).local().format("kk:mm MM/DD/YY");
    },

    getFormattedDateNoTime(dateToFormat) {
        return moment.utc(dateToFormat).local().format("MMM Do, YYYY");
    },

    async getServerStatus() {
        const serverAddress = await StorageHelper.getServerAddress();
        const response = await fetch(serverAddress + `/Home/Ping/`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return response.status == 200 ? "Online" : `Unavailable. Status Code: ${response.status}`;
    }
}