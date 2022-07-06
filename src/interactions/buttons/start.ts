import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { ButtonInteraction, MessageAttachment } from 'tiscord';
import { LudoClient } from '../../classes/Client';

export async function run(client: LudoClient, interaction: ButtonInteraction) {
    const [, gameId] = interaction.customId.split('.');
    const game = client.games.get(parseInt(gameId));
    if (interaction.user.id !== game.creator)
        return interaction.reply({
            content: 'You are not the creator of this game.',
            ephemeral: true
        });
    const actionRow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
            .setEmoji({ name: '🟢' })
            .setCustomId(`join.h.1`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        new ButtonBuilder()
            .setEmoji({ name: '🟡' })
            .setCustomId(`join.h.2`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        new ButtonBuilder()
            .setEmoji({ name: '🔴' })
            .setCustomId(`join.h.3`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        new ButtonBuilder()
            .setEmoji({ name: '🔵' })
            .setCustomId(`join.h.4`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
    );
    const startRow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
            .setLabel('Resend control message')
            .setCustomId(`join.${gameId}`)
            .setStyle(ButtonStyle.Primary)
    );
    await interaction.editOriginalMessage({
        components: [actionRow, startRow],
        attachments: [new MessageAttachment(await client.board.generate(game), 'board.png')]
    });
}
