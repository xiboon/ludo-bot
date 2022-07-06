import { Interaction } from 'tiscord';
import { LudoClient } from '../classes/Client';

export async function interactionCreate(client: LudoClient, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
        const command = client.interactions.commands.get(interaction.name);
        if (command) {
            await command.run(client, interaction);
        }
    } else if (interaction.isButton()) {
        const button = client.interactions.buttons.get(interaction.customId.split('.')[0]);
        if (button) {
            await button.run(client, interaction);
        }
    }
}
