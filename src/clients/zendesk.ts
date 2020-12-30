import zendesk, {Client, ClientOptions} from 'node-zendesk';

export const newClient = (username: string, token: string, remoteUri: string): Client => {
    const options: ClientOptions = {
        username,
        token,
        remoteUri,
    };

    return zendesk.createClient(options);
};