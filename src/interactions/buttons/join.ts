import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { ButtonInteraction, MessageAttachment } from 'tiscord';
import { LudoClient } from '../../classes/Client';

export async function run(client: LudoClient, interaction: ButtonInteraction) {
    const [, gameId, color] = interaction.customId.split('.');
    const game = client.games.get(parseInt(gameId));

    if (!game) return interaction.reply({ content: 'Game not found.', ephemeral: true });
    if (!color) {
        if (!game.players.some(p => p.id === interaction.user.id))
            return interaction.reply({ content: 'You are not in this game.', ephemeral: true });
        await interaction.reply({
            content: 'you have joined the game.',
            // components: [actionRow],
            ephemeral: true
        });
    }
    if (game.players.some(p => p.id === interaction.user.id))
        return interaction.reply({ content: 'You are already in this game.', ephemeral: true });
    const takenColors = game.players.map(p => p.color);
    if (takenColors.includes(parseInt(color) as 1 | 2 | 3 | 4))
        return interaction.reply({
            content: 'This color was already taken, please choose another one.',
            ephemeral: true
        });
    // @ts-expect-error
    takenColors.push(parseInt(color));
    game.addPlayer({
        // @ts-expect-error
        color: parseInt(color),
        id: interaction.user.id,
        name: interaction.user.tag
    });

    client.games.set(parseInt(gameId), game);
    const actionRow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
            .setEmoji({ name: '🟢' })
            .setCustomId(`join.${gameId}.1`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(takenColors.includes(1)),
        new ButtonBuilder()
            .setEmoji({ name: '🟡' })
            .setCustomId(`join.${gameId}.2`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(takenColors.includes(2)),
        new ButtonBuilder()
            .setEmoji({ name: '🔴' })
            .setCustomId(`join.${gameId}.3`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(takenColors.includes(3)),
        new ButtonBuilder()
            .setEmoji({ name: '🔵' })
            .setCustomId(`join.${gameId}.4`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(takenColors.includes(4))
    );
    const startRow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
            .setLabel('Start')
            .setCustomId(`start.${gameId}`)
            .setStyle(ButtonStyle.Success)
    );
    await interaction.reply({
        content: 'you have joined the game.',
        // components: [actionRow],
        ephemeral: true
    });
    await interaction.message.edit({
        attachments: [new MessageAttachment(await client.board.generate(game), 'board.png')],
        components: [actionRow, startRow]
    });
}
