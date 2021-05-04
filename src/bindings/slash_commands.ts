import {AppBinding} from 'mattermost-redux/types/apps';
import {AppExpandLevels} from 'mattermost-redux/constants/apps';

import {Routes, Locations, ZendeskIcon} from '../utils/constants';
import {getStaticURL, newCommandBindings} from '../utils';
import {isZdAdmin} from '../utils/utils';
import {BindingOptions} from 'bindings';
import {getManifest} from '../manifest';

// getCommandBindings returns the users slash command bindings
export const getCommandBindings = (options: BindingOptions): AppBinding => {
    const bindings: AppBinding[] = [];
    const mmSiteURL = options.mattermostSiteUrl;

    // only show configuration option if admin has not configured the plugin
    if (!options.isConfigured) {
        if (options.isSystemAdmin) {
            bindings.push(cmdConfigure(mmSiteURL));
            bindings.push(cmdHelp(mmSiteURL));
            return newCommandBindings(mmSiteURL, bindings);
        }
    }
    if (options.isConnected) {
        // only admins can create triggers and targets in zendesk
        if (isZdAdmin(options.zdUserRole)) {
            bindings.push(cmdSubscribe(mmSiteURL));
            if (options.isSystemAdmin) {
                bindings.push(cmdTarget(mmSiteURL));
            }
        }
        bindings.push(cmdDisconnect(mmSiteURL));

        // bindings.push(cmdMe(mmSiteURL));
    } else {
        bindings.push(cmdConnect(mmSiteURL));
    }

    if (options.isSystemAdmin) {
        bindings.push(cmdConfigure(mmSiteURL));
    }
    bindings.push(cmdHelp(mmSiteURL));
    return newCommandBindings(mmSiteURL, bindings);
};

// CommandBindings class for creating slash command location bindings
const cmdConnect = (mmSiteUrl: string): AppBinding => {
    return {
        app_id: getManifest().app_id,
        location: Locations.Connect,
        label: 'connect',
        description: 'Connect your Zendesk account',
        icon: getStaticURL(mmSiteUrl, ZendeskIcon),
        form: {fields: []},
        call: {
            expand: {
                oauth2_app: AppExpandLevels.EXPAND_ALL,
            },
            path: Routes.App.BindingPathConnect,
        },
    };
};

const cmdDisconnect = (mmSiteUrl: string): AppBinding => {
    return {
        app_id: getManifest().app_id,
        location: Locations.Disconnect,
        label: 'disconnect',
        description: 'Disconnect your Zendesk account',
        icon: getStaticURL(mmSiteUrl, ZendeskIcon),
        form: {fields: []},
        call: {
            expand: {
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
            path: Routes.App.BindingPathDisconnect,
        },
    };
};

const cmdSubscribe = (mmSiteUrl: string): AppBinding => {
    return {
        app_id: getManifest().app_id,
        location: Locations.Subscribe,
        label: 'subscribe',
        description: 'Subscribe notifications to a channel',
        icon: getStaticURL(mmSiteUrl, ZendeskIcon),
        form: {fields: []},
        call: {
            path: Routes.App.CallPathSubsOpenForm,
            expand: {
                acting_user: AppExpandLevels.EXPAND_ALL,
                admin_access_token: AppExpandLevels.EXPAND_ALL,
                channel: AppExpandLevels.EXPAND_SUMMARY,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    };
};

const cmdConfigure = (mmSiteUrl: string): AppBinding => {
    return {
        app_id: getManifest().app_id,
        location: Locations.Configure,
        label: 'configure',
        description: 'Configure the installed Zendesk account',
        icon: getStaticURL(mmSiteUrl, ZendeskIcon),
        form: {fields: []},
        call: {
            path: Routes.App.CallPathConfigOpenForm,
            expand: {
                acting_user: AppExpandLevels.EXPAND_ALL,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_app: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    };
};

const cmdMe = (mmSiteUrl: string): AppBinding => {
    return {
        app_id: getManifest().app_id,
        location: Locations.Me,
        label: 'me',
        description: 'Show Your Zendesk User Info',
        icon: getStaticURL(mmSiteUrl, ZendeskIcon),
        form: {fields: []},
        call: {
            path: Routes.App.BindingPathMe,
            expand: {
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    };
};

const cmdTarget = (mmSiteUrl: string): AppBinding => {
    return {
        app_id: getManifest().app_id,
        location: Locations.Target,
        label: 'setup-target',
        description: 'Setup Zendesk Target',
        icon: getStaticURL(mmSiteUrl, ZendeskIcon),
        form: {fields: []},
        call: {
            path: Routes.App.BindingPathTargetCreate,
            expand: {
                app: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    };
};

const cmdHelp = (mmSiteUrl: string): AppBinding => {
    return {
        app_id: getManifest().app_id,
        location: Locations.Help,
        label: 'help',
        description: 'Show Zendesk Help',
        icon: getStaticURL(mmSiteUrl, ZendeskIcon),
        form: {fields: []},
        call: {
            path: Routes.App.BindingPathHelp,
            expand: {
                acting_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    };
};

