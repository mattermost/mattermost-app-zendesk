import {AppContext, AppCallValues, AppCallRequest} from 'mattermost-redux/types/apps';

import {ZDTrigger, ZDTriggerConditions, ZDTriggerCondition, ZDTriggerPayload} from '../utils/ZDTypes';

import {SubscriptionFields, TriggerFields} from '../utils/constants';

interface TriggerFromFrom {
    getTrigger(): ZDTriggerPayload;
}

export class TriggerFromFormImpl implements TriggerFromFrom {
    values: AppCallValues;
    context: AppContext;
    targetID: string;
    trigger: ZDTrigger

    constructor(call: AppCallRequest, targetID: string) {
        this.values = call.values as AppCallValues;
        this.context = call.context;
        this.targetID = targetID;
        this.trigger = {} as ZDTrigger;
        this.buildTrigger();
    }

    getTrigger(): ZDTriggerPayload {
        return {trigger: this.trigger};
    }

    buildTrigger(): void {
        // If not a new trigger, add the trigger ID to the payload
        // This is a signal to update the trigger, not create a new one
        if (!this.isNewTrigger()) {
            const subID = this.values[SubscriptionFields.SubSelectName].value;
            this.addField('id', subID);
        }
        this.addTitle();
        this.addDescription();
        this.addActions();
        this.addConditions();
    }

    addActions(): void {
        const actions = [
            {
                field: TriggerFields.ActionField,
                value: [
                    this.targetID,
                    this.getJSONDataFields(),
                ],
            },
        ];
        this.addField('actions', actions);
    }

    // getJSONDataFields constructs the object text string for a trigger
    getJSONDataFields(): string {
        // default to the viewing channel_id
        let channelID = this.context.channel_id;

        // if channel picker exists, use its channel ID value
        if (this.values[SubscriptionFields.ChannelPickerSelectName] && this.values[SubscriptionFields.ChannelPickerSelectName].value) {
            channelID = this.values[SubscriptionFields.ChannelPickerSelectName].value;
        }
        const pairs = TriggerFields.ActionValuePairs;
        pairs[TriggerFields.ChannelIDKey] = channelID;
        return JSON.stringify(pairs);
    }

    addTitle(): void {
        let title = SubscriptionFields.PrefixTriggersTitle;
        title += SubscriptionFields.RegexTriggerInstance + this.context.mattermost_site_url;
        title += SubscriptionFields.RegexTriggerTeamID + this.context.team_id;
        title += SubscriptionFields.RegexTriggerChannelID + this.context.channel_id;
        title += ' ' + this.values[SubscriptionFields.SubTextName];
        this.addField('title', title);
    }

    addDescription(): void {
        const description = String(this.values[SubscriptionFields.SubTextName]);
        this.addField('description', description);
    }

    addField(key: string, value: unknown): void {
        this.trigger[key] = value;
    }

    isNewTrigger(): boolean {
        const subID = this.values[SubscriptionFields.SubSelectName].value;
        return subID === SubscriptionFields.NewSub_OptionValue;
    }

    addConditions(): void {
        const conditions: ZDTriggerConditions = {
            any: [],
        };
        for (const checkbox of SubscriptionFields.ConditionsCheckBoxFields) {
            if (this.values[checkbox]) {
                const entry: ZDTriggerCondition = {
                    field: checkbox,
                    operator: 'changed',
                };
                conditions.any.push(entry);
            }
        }

        // do not let subscriptions without a condition be created...
        if (conditions.any.length === 0) {
            throw new Error('Must select at least one condition');
        }

        this.addField('conditions', conditions);
    }
}

export function newTriggerFromForm(call: AppCallRequest, targetID: string): ZDTriggerPayload {
    const trigger = new TriggerFromFormImpl(call, targetID).getTrigger();
    return trigger;
}

