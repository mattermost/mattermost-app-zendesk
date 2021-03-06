import {AppBinding} from 'mattermost-redux/types/apps';
import {AppExpandLevels} from 'mattermost-redux/constants/apps';

import {AppID, ZDIcon, Routes} from '../utils/constants';
import {Bindings, newPostMenuBindings} from '../utils';

// getPostMenuBindings returns the users post menu bindings
export const getPostMenuBindings = (userID: string): AppBinding => {
    return new PostMenuBindings(userID).getBindings();
};

// PostMenuBindings class for creating post_menu location bindings
class PostMenuBindings extends Bindings {
    getBindings = (): AppBinding[] => {
        const bindings: AppBinding[] = [];
        if (this.isConnected()) {
            bindings.push(this.openCreateTicketForm());
            bindings.push(this.openSubscriptionsForm());
        }
        return newPostMenuBindings(bindings);
    }

    openCreateTicketForm = (): AppBinding => {
        return {
            app_id: AppID,
            label: 'Create Zendesk Ticket',
            description: 'Create ticket in Zendesk',
            icon: ZDIcon,
            location: 'open_ticket',
            call: {
                path: Routes.App.BindingPathOpenCreateTicketForm,
                expand: {
                    post: AppExpandLevels.EXPAND_ALL,
                },
            },
        } as AppBinding;
    }

    openSubscriptionsForm = (): AppBinding => {
        return {
            app_id: AppID,
            label: 'Zendesk Subscriptions',
            description: 'Create ticket in Zendesk',
            icon: ZDIcon,
            location: 'open_subscription',
            call: {
                path: Routes.App.BindingPathOpenSubscriptionsForm,
            },
        } as AppBinding;
    }
}

