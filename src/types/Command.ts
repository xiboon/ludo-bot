import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { LudoClient } from '../classes/Client';

export interface Command {
    run: (client: LudoClient, interaction: ChatInputCommandInteraction) => Promise<void>;
    data: SlashCommandBuilder;
}
