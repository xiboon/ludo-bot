import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, MessageAttachment } from 'tiscord';
import { LudoClient } from '../../classes/Client';
import { ButtonStyle } from 'discord-api-types/v10';
import { Game } from '../../classes/Game';
import { joinRow } from '../rows/joinRow';
export async function run(client: LudoClient, interaction: ChatInputCommandInteraction) {
    const gameId = client.lastId + 1;
    client.lastId = gameId;
    const game = new Game(gameId, interaction.user.id);
    client.games.set(gameId, game);
    const actionRow = joinRow([], gameId.toString());
    const startRow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
            .setLabel('Start')
            .setCustomId(`start.${gameId}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
    );
    interaction.reply({
        components: [actionRow, startRow],
        attachments: [new MessageAttachment(await client.board.generate(game), 'board.png')]
    });
}

export const data = new SlashCommandBuilder()
    .setName('game')
    .setDescription('Start a game of ludo')
    .setDMPermission(false);
