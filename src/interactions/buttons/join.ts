import { ButtonStyle } from 'discord-api-types/v10';
import { ButtonInteraction, AttachmentBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { LudoClient } from '../../classes/Client';
import { joinRow } from '../rows/joinRow';

export async function run(client: LudoClient, interaction: ButtonInteraction) {
    const [, gameId, color] = interaction.customId.split('.');
    const game = client.games.get(parseInt(gameId));

    if (!game) return interaction.reply({ content: 'Game not found.', ephemeral: true });
    if (!color) {
        if (!game.players.some(p => p.id === interaction.user.id))
            return interaction.reply({ content: 'You are not in this game.', ephemeral: true });
        await interaction.reply({
            content: "This is your control message. Don't delete it, and wait for your turn.",
            // components: [actionRow],
            ephemeral: true
        });
    }
    if (game.players.some(p => p.id === interaction.user.id))
        return interaction.reply({
            content: "This is your control meessage. Don't delete it, and wait for your turn.",
            ephemeral: true
        });
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
    await interaction.reply({
        content: "This is your control message. Don't delete it, and wait for your turn.",
        ephemeral: true
    });

    const actionRow = await joinRow(takenColors, gameId);
    const startRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
            .setLabel('Start')
            .setCustomId(`start.${gameId}`)
            .setStyle(ButtonStyle.Success)
    );

    await interaction.message.edit({
        files: [new AttachmentBuilder(await client.board.generate(game), { name: 'board.png' })],
        components: [actionRow, startRow]
    });
}
