import Client from 'mattermost-redux/client/client4.js';

export const newClient = (token: string, url: string): Client => {
    const client = new Client();
    client.setUrl(url);
    client.setToken(token);
    return client;
};