import zendesk, {ClientOptions} from 'node-zendesk';

import {CtxWithActingUserExpanded} from 'types/apps';

import {Routes} from 'utils';
import {newTokenStore, newConfigStore} from 'store';

interface Tickets {
    create(ticket: any): any;
    exportAudit(id: number): any;
}

interface Targets {
    create(target: any): any;
    update(id: string, target: any): any;
}

interface TicketForms {
    list(): any;
}

interface TicketFields {
    list(): any;
}

interface Triggers {
    update(id: number): any;
    delete(id: number): any;
    create(trigger: any): any;
    search(query: string): any;
}

interface OauthTokens {
    current(): any;
    revoke(id: number): any;
}

interface Users {
    show(id: number): any;
}

// expose on the methods that will be used by the app
export interface ZDClient {
    tickets: Tickets;
    ticketforms: TicketForms;
    ticketfields: TicketFields;
    targets: Targets;
    triggers: Triggers;
    oauthtokens: OauthTokens;
    users: Users;
}

export const newZDClient = async (context: CtxWithActingUserExpanded): Promise<ZDClient> => {
    const mmUserID = context.acting_user_id;
    if (mmUserID === '') {
        throw new Error('Failed to get user acting_user_id');
    }
    const token = context.oauth2.user.access_token;
    if (!token) {
        throw new Error('Failed to get user access_token');
    }
    const config = await newConfigStore(context).getValues();
    const remoteUri = config.zd_url + Routes.ZD.APIVersion;
    const options: ClientOptions = {
        username: '',
        token,
        remoteUri,
        oauth: true,
    };

    return zendesk.createClient(options) as ZDClient;
};
