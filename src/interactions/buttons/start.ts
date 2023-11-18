import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { ButtonInteraction, AttachmentBuilder } from 'discord.js';
import { LudoClient } from '../../classes/Client';
import { joinRow } from '../rows/joinRow';

export async function run(client: LudoClient, interaction: ButtonInteraction) {
    const [, gameId] = interaction.customId.split('.');
    const game = client.games.get(parseInt(gameId));
    if (interaction.user.id !== game.creator)
        return interaction.reply({
            content: 'You are not the creator of this game.',
            ephemeral: true
        });
    const actionRow = await joinRow([1, 2, 3, 4], gameId);
    const startRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
            .setLabel('Resend control message')
            .setCustomId(`join.${gameId}`)
            .setStyle(ButtonStyle.Primary)
    );
    await interaction.message.edit({
        components: [actionRow, startRow],
        attachments: [
            // @ts-expect-error
            new AttachmentBuilder(await client.board.generate(game), { name: 'board.png' }).toJSON()
        ]
    });
}
