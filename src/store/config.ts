import {AppCallValues, AppContext} from 'mattermost-redux/types/apps';

import {StoreKeys} from '../utils/constants';
import {newProxyClient, ProxyClient} from '../clients';
import {baseUrlFromContext} from '../utils';

export type AppConfigStore = {
    zd_url: string;
    zd_client_id: string;
    zd_client_secret: string;
    zd_node_host: string;
    zd_target_id: string;
    zd_connected_mm_user_id: string;
}

export interface ConfigStore {
    getValues(): Promise<AppConfigStore>;
    isConfigured(): Promise<boolean>;
    storeConfigInfo(values: AppCallValues): void;
}

class ConfigStoreImpl implements ConfigStore {
    storeData: AppConfigStore;
    ppClient: ProxyClient;

    constructor(botToken: string, url: string) {
        this.ppClient = newProxyClient(botToken, url);
        this.storeData = {} as AppConfigStore;
    }

    storeConfigInfo(store: AppConfigStore): void {
        this.ppClient.kvSet(StoreKeys.config, store);
    }

    async getValues(): Promise<AppConfigStore> {
        const config = await this.ppClient.kvGet(StoreKeys.config);
        if (config) {
            this.storeData.zd_url = config.zd_url || '';
            this.storeData.zd_client_id = config.zd_client_id || '';
            this.storeData.zd_client_secret = config.zd_client_secret || '';
            this.storeData.zd_node_host = config.zd_node_host || '';
            this.storeData.zd_target_id = config.zd_target_id || '';
            this.storeData.zd_connected_mm_user_id = config.zd_connected_mm_user_id || '';
        }
        return this.storeData;
    }

    // isConfigured returns true if zendesk configuration has been completed by a sysadmin
    // TODO Validation logic needs to be improved
    async isConfigured(): Promise<boolean> {
        const config = await this.getValues();
        return Boolean(config.zd_url && config.zd_client_id && config.zd_client_secret && config.zd_target_id);
    }
}

export const newConfigStore = (context: AppContext): ConfigStore => {
    const botAccessToken = context.bot_access_token;
    const baseURL = baseUrlFromContext(context);
    return new ConfigStoreImpl(botAccessToken, baseURL);
};
