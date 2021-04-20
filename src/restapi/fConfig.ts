import {Request, Response} from 'express';

import {AppCallResponse, AppCallRequest} from 'mattermost-redux/types/apps';

import {CtxWithActingUserExpanded} from 'types/apps';

import {newConfigStore, AppConfigStore} from 'store/config';
import {newAppsClient} from 'clients';
import {newZendeskConfigForm} from 'forms';
import {newOKCallResponseWithMarkdown, newFormCallResponse, newErrorCallResponseWithMessage} from 'utils/call_responses';
import {baseUrlFromContext} from 'utils/utils';

// fOpenZendeskConfigForm opens a new configuration form
export async function fOpenZendeskConfigForm(req: Request, res: Response): Promise<void> {
    const form = await newZendeskConfigForm(req.body);
    const callResponse = newFormCallResponse(form);
    res.json(callResponse);
}

export async function fSubmitOrUpdateZendeskConfigForm(req: Request, res: Response): Promise<void> {
    const form = await newZendeskConfigForm(req.body);
    const callResponse = newFormCallResponse(form);
    res.json(callResponse);
}

export async function fSubmitOrUpdateZendeskConfigSubmit(req: Request, res: Response): Promise<void> {
    const call: AppCallRequest = req.body;
    const context = call.context as CtxWithActingUserExpanded;
    const url = baseUrlFromContext(call.context);

    const id = call.values.zd_client_id || '';
    const secret = call.values.zd_client_secret || '';

    const ppClient = newAppsClient(call.context.acting_user_access_token, url);
    ppClient.storeOauth2App(id, secret);

    let callResponse: AppCallResponse = newOKCallResponseWithMarkdown('Successfully updated Zendesk configuration');
    try {
        const configStore = newConfigStore(context);
        const cValues = await configStore.getValues();
        const targetID = cValues.zd_target_id;
        const storeValues = call.values as AppConfigStore;
        storeValues.zd_target_id = targetID;
        configStore.storeConfigInfo(storeValues);
    } catch (err) {
        callResponse = newErrorCallResponseWithMessage(err.message);
    }
    res.json(callResponse);
}
