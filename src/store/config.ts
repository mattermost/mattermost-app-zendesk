import {AppCallValues} from 'types/apps';

import {StoreKeys} from '../constants/zendesk';
import {AppsClient, newAppsClient} from '../clients';
import {baseUrlFromContext} from '../utils';

export type AppConfigStore = {
    zd_url: string;
    zd_webhook_id: string;
    zd_oauth_access_token: string;
}

export interface ConfigStore {
    getValues(): Promise<AppConfigStore>;
    storeConfigInfo(values: AppCallValues): Promise<void>;
}

class ConfigStoreImpl implements ConfigStore {
    storeData: AppConfigStore;
    ppClient: AppsClient;

    constructor(botToken: string, url: string) {
        this.ppClient = newAppsClient(botToken, url);
        this.storeData = {} as AppConfigStore;
    }

    async storeConfigInfo(store: AppConfigStore): Promise<void> {
        await this.ppClient.kvSet(StoreKeys.config, store);
    }

    async getValues(): Promise<AppConfigStore> {
        const config = await this.ppClient.kvGet(StoreKeys.config);
        if (config) {
            this.storeData.zd_url = config.zd_url || '';
            this.storeData.zd_webhook_id = config.zd_webhook_id || '';
            this.storeData.zd_oauth_access_token = config.zd_oauth_access_token || '';
        }
        return this.storeData;
    }
}

export const newConfigStore = (botAccessToken: string, mattermostSiteUrl: string): ConfigStore => {
    const baseURL = baseUrlFromContext(mattermostSiteUrl);
    return new ConfigStoreImpl(botAccessToken, baseURL);
};
