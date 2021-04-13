import {UserProfile} from 'mattermost-redux/types/users';
import {Post} from 'mattermost-redux/types/posts';
import {AppContext} from 'mattermost-redux/types/apps';

export type AppContextWithBot = AppContext & {
    bot_access_token: string,

    // acting_user_id: string,
    // acting_user_access_token: string
}

export type AppContextWithActingUserExpanded = AppContext & {
    acting_user_id: string,
    acting_user_access_token: string
    acting_user: UserProfile
}

export type CallWithContext<ctx=unknown> = AppContext & {
    context: AppContext & ctx
}

export type CallWithBotExpanded = CallWithContext & {
    bot_access_token: string,
    bot_user_id: string
}

export type CtxWithBotExpanded = CallWithContext & {
    bot_user_id: string,
    bot_access_token: string,
}

export type CtxWithBotAdminActingUserExpanded = CallWithContext & {
    acting_user: UserProfile,
    acting_user_id: string,
    acting_user_access_token: string
    admin_access_token: string
    bot_user_id: string,
    bot_access_token: string,
}

export type CtxWithPostExpanded = CallWithContext & {
    post: Post
}

export type CtxWithActingUserExpanded = CallWithContext & {
    acting_user: UserProfile,
    acting_user_id: string,
    acting_user_access_token: string
}

export type CallWithAdminToken = CallWithContext<{
    admin_access_token: string
}>