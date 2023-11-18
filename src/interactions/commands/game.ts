import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { LudoClient } from '../../classes/Client';
import { ButtonStyle } from 'discord-api-types/v10';
import { Game } from '../../classes/Game';
import { joinRow } from '../rows/joinRow';
export async function run(client: LudoClient, interaction: ChatInputCommandInteraction) {
    const gameId = client.lastId + 1;
    client.lastId = gameId;
    const game = new Game(gameId, interaction.user.id);
    client.games.set(gameId, game);
    const actionRow = await joinRow([], gameId.toString());
    const startRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
            .setLabel('Start')
            .setCustomId(`start.${gameId}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
    );
    interaction.reply({
        components: [actionRow, startRow],
        files: [new AttachmentBuilder(await client.board.generate(game), { name: 'board.png' })]
    });
}

export const data = new SlashCommandBuilder()
    .setName('game')
    .setDescription('Start a game of ludo')
    .setDMPermission(false);
