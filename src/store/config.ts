import fs from 'fs';

import {AppContextProps} from 'mattermost-redux/types/apps';

import {jsonConfigFileStore} from '../utils';

type AppConfigStore = {
    bot_access_token: string;
    oauth2_client_secret: string;
    mm_site_url: string;
}

interface Store {
    getBotAccessToken(): string;
    getSiteURL(): string;
}

class ConfigFileStore implements Store {
    storeData: AppConfigStore;

    constructor() {
        this.storeData = {
            bot_access_token: '',
            oauth2_client_secret: '',
            mm_site_url: '',
        };

        if (fs.existsSync(jsonConfigFileStore)) {
            fs.readFile(jsonConfigFileStore, (err, data) => {
                if (err) {
                    throw err;
                }
                this.storeData = JSON.parse(data.toString());
            });
        }
    }

    storeInstallInfo(req: any): void {
        const values = req.body.values;
        const context: AppContextProps = req.body.context;

        values.mm_site_url = context.config.site_url;

        fs.writeFileSync(jsonConfigFileStore, JSON.stringify(values), (err) => {
            if (err) {
                throw err;
            }
        });
    }

    getBotAccessToken(): string {
        return this.storeData.bot_access_token;
    }

    getSiteURL(): string {
        return this.storeData.mm_site_url;
    }
}

export default new ConfigFileStore();
