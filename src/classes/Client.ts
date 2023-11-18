import { Client, GatewayIntentBits, IntentsBitField } from 'discord.js';
import { InteractionLoader } from './InteractionLoader';
import { ActivityType, PresenceUpdateStatus } from 'discord-api-types/v10';
import { interactionCreate } from '../interactions/interactionCreate';
import { BoardManager } from './BoardManager';
import { Game } from './Game';
export class LudoClient extends Client {
    interactions: InteractionLoader = new InteractionLoader(this, '../interactions');
    lastId = 0;
    board = new BoardManager();
    games: Map<number, Game> = new Map();
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds],
            presence: {
                status: PresenceUpdateStatus.Online,
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
        this.login(process.env.TOKEN);
    }
    async init() {
        console.log("i'm so ready to do fucking gaming");
        this.interactions.deployCommands();
    }
}
