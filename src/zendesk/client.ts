import zendesk from 'node-zendesk';
import {Client, ClientOptions} from 'node-zendesk';

export function newClient(username: string, token: string, remoteUri: string): Client {
    const options: ClientOptions = {
        username,
        token,
        remoteUri,
    };

    return zendesk.createClient(options);
}
