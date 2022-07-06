import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'tiscord';
import { LudoClient } from '../classes/Client';

export interface Command {
    run: (client: LudoClient, interaction: ChatInputCommandInteraction) => Promise<void>;
    data: SlashCommandBuilder;
}
