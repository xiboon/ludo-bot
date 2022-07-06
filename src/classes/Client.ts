import * as Sentry from '@sentry/node';

import { Client } from 'tiscord';
import { InteractionLoader } from './InteractionLoader';
import { ActivityType, PresenceUpdateStatus } from 'discord-api-types/v10';
import { interactionCreate } from '../interactions/interactionCreate';
import { BoardManager } from './BoardManager';
import { Game } from './Game';
export class LudoClient extends Client {
    interactions: InteractionLoader = new InteractionLoader(this, '../interactions');
    sentry: void;
    lastId = 0;
    board = new BoardManager();
    games: Map<number, Game> = new Map();
    constructor() {
        super({
            token: process.env.TOKEN,
            intents: 0,
            debug: true,
            presence: {
                status: PresenceUpdateStatus.Online,
                since: null,
                activities: [
                    {
                        name: 'ludo',
                        type: ActivityType.Playing
                    }
                ],
                afk: false
            }
        });
        this.on('ready', this.init);
        this.on('interactionCreate', args => interactionCreate(this, args));
        this.login();
    }
    async init() {
        await this.interactions.deployCommands();
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            tracesSampleRate: 1.0
        });
    }
}
