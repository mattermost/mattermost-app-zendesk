import {AppCall, AppField, AppForm} from 'mattermost-redux/types/apps';
import {AppFieldTypes} from 'mattermost-redux/constants/apps';
import Client4 from 'mattermost-redux/client/client4.js';

import {newMMClient, ZDClient} from '../clients';
import {getStaticURL, Routes, Oauth2App} from '../utils';
import {BaseFormFields} from '../utils/base_form_fields';
import {ZendeskIcon} from '../utils/constants';
import {newConfigStore, ConfigStore, AppConfigStore} from '../store/config';

// newZendeskConfigForm returns a form response to configure the zendesk client
export async function newZendeskConfigForm(call: AppCall): Promise<AppForm> {
    const mmClient = newMMClient(call.context).asAdmin();
    const configStore = newConfigStore(call.context);
    const formFields = new FormFields(call, configStore, '', mmClient);
    const fields = await formFields.getConfigFields();

    const form: AppForm = {
        title: 'Configure Zendesk',
        header: 'Configure the Zendesk app with the following information.',
        icon: getStaticURL(call.context, ZendeskIcon),
        fields,
        call: {
            path: Routes.App.CallPathConfigSubmitOrUpdateForm,
        },
    };
    return form;
}

// FormFields retrieves viewable modal app fields
class FormFields extends BaseFormFields {
    configStore: ConfigStore
    storeValues: AppConfigStore
    OauthValues: Oauth2App

    constructor(call: AppCall, configStore: ConfigStore, zdClient: ZDClient, mmClient: Client4) {
        super(call, zdClient, mmClient);
        this.configStore = configStore;
        this.OauthValues = {
            client_id: call.context.oauth2.client_id,
            client_secret: call.context.oauth2.client_secret,
        };
        this.storeValues = {
            zd_url: '',
            zd_node_host: '',
            zd_connected_mm_user_id: '',
            zd_target_id: '',
        };
    }

    // getFields returns a list of viewable app fields mapped from Zendesk form fields
    async getConfigFields(): Promise<AppField[]> {
        await this.buildFields();
        return this.builder.getFields();
    }

    // buildFields adds fields to list of viewable proxy app fields
    async buildFields(): Promise<void> {
        this.storeValues = await this.configStore.getValues();
        this.addZDUrlField();
        this.addZDClientIDField();
        this.addZDClientSecretField();
        this.addZDTargetIDField();
        this.addZDConnectedUserIDField();
        this.addZDNodeHost();
    }

    addZDUrlField(): void {
        const f: AppField = {
            type: AppFieldTypes.TEXT,
            name: 'zd_url',
            label: 'URL',
            value: this.storeValues.zd_url,
            hint: 'Ex. https://yourhost.zendesk.com',
            description: 'Base URL of the zendesk account',
            is_required: true,
        };
        this.builder.addField(f);
    }

    addZDClientIDField(): void {
        const f: AppField = {
            type: AppFieldTypes.TEXT,
            name: 'zd_client_id',
            label: 'Client ID',
            value: this.OauthValues.client_id,
            description: 'Client ID obtained when setting up Oauth client in zendesk',
            is_required: true,
        };
        this.builder.addField(f);
    }
    addZDClientSecretField(): void {
        const f: AppField = {
            type: AppFieldTypes.TEXT,
            name: 'zd_client_secret',
            label: 'Client Secret',
            value: this.OauthValues.client_secret,
            description: 'Client Secret obtained when setting up Oauth client in zendesk',
            is_required: true,
        };
        this.builder.addField(f);
    }
    addZDTargetIDField(): void {
        const f: AppField = {
            type: AppFieldTypes.TEXT,
            name: 'zd_target_id',
            label: 'Target ID',
            value: this.storeValues.zd_target_id,
            description: 'Target ID needed for setting up subscriptions',
            is_required: true,
        };
        this.builder.addField(f);
    }

    addZDConnectedUserIDField(): void {
        const f: AppField = {
            type: AppFieldTypes.TEXT,
            name: 'zd_connected_mm_user_id',
            label: 'Zendesk connected Mattermost User ID',
            value: this.storeValues.zd_connected_mm_user_id,
            description: 'Mattermost UserID of an account with agent Zendesk access ',
        };
        this.builder.addField(f);
    }

    addZDNodeHost(): void {
        const f: AppField = {
            type: AppFieldTypes.TEXT,
            name: 'zd_node_host',
            hint: 'Ex. https://yourhost.ngrok.io',
            label: 'Node Host',
            value: this.storeValues.zd_node_host,
            description: 'Only needed for development',
        };
        this.builder.addField(f);
    }
}

