import {AppBinding, AppContext} from 'mattermost-redux/types/apps';
import {AppExpandLevels} from 'mattermost-redux/constants/apps';

import {Routes, Locations, ZendeskIcon} from 'utils/constants';
import {getStaticURL, newPostMenuBindings, isConfigured, isConnected, isUserSystemAdmin} from 'utils';
import {getManifest} from 'manifest';

// getPostMenuBindings returns the users post menu bindings
export const getPostMenuBindings = (context: AppContext): AppBinding => {
    const bindings: AppBinding[] = [];
    const isSysadmin = isUserSystemAdmin(context);

    // do not show any post menu options if the app is not configured
    if (!isConfigured(context)) {
        return newPostMenuBindings(bindings);
    }
    if (isConnected(context)) {
        bindings.push(openCreateTicketForm(context));
        if (isSysadmin) {
            bindings.push(openSubscriptionsForm(context));
        }
    }
    return newPostMenuBindings(bindings);
};

const openCreateTicketForm = (context: AppContext): AppBinding => {
    return {
        app_id: getManifest().app_id,
        label: 'Create Zendesk Ticket',
        description: 'Create ticket in Zendesk',
        icon: getStaticURL(context, ZendeskIcon),
        location: Locations.Ticket,
        call: {
            path: Routes.App.CallPathTicketOpenForm,
            expand: {
                post: AppExpandLevels.EXPAND_ALL,
                acting_user: AppExpandLevels.EXPAND_ALL,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    };
};

const openSubscriptionsForm = (context: AppContext): AppBinding => {
    return {
        label: 'Zendesk Subscriptions',
        description: 'Subscribe channel to Zendesk notifications',
        icon: getStaticURL(context, ZendeskIcon),
        location: Locations.Subscribe,
        call: {
            path: Routes.App.CallPathSubsOpenForm,
            expand: {
                admin_access_token: AppExpandLevels.EXPAND_ALL,
                acting_user: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    } as AppBinding;
};

