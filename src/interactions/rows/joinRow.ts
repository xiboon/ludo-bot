import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
export async function joinRow(takenColors: number[], gameId: string) {
    return new ActionRowBuilder<ButtonBuilder>().setComponents(
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
            .setDisabled(takenColors.includes(3))
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setEmoji({ name: '🔵' })
            .setCustomId(`join.${gameId}.4`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(takenColors.includes(4))
    );
}
