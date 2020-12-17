import {AppsCallResponseTypes} from 'mattermost-redux/constants/apps';

import {AppCallResponse} from 'mattermost-redux/types/apps';

import app from '../app/app';

import {newCreateTicketForm} from './create_ticket';

// BaseForm routes the call type to its corresponding method
export class BaseForm {
    constructor(call: AppCall) {
        this.call = call;
    }

    handle(): AppCallResponse {
        switch (this.call.type) {
        case 'form':
            return this.handleForm();
        case 'lookup':
            return this.handleLookup();
        default:
            return this.handleSubmit();
        }
    }
}

// CreateTicketForm handles creation and submission for creating a ticket from a post
export class CreateTicketForm extends BaseForm {
    handleForm(): AppCallResponse {
        return newCreateTicketForm(this.call);
    }

    async handleSubmit(): Promise<AppCallResponse> {
        let jsonRes = {
            type: AppsCallResponseTypes.OK,
        };
        try {
            await app.createTicketFromPost(this.call);
        } catch (err) {
            jsonRes = {
                type: AppsCallResponseTypes.ERROR,
                error: err.message,
            };
        }
        return jsonRes;
    }
}