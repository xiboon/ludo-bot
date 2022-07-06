import { join } from 'path';
import { readdir } from 'fs/promises';
import { Routes } from 'discord-api-types/v10';
import { LudoClient } from './Client';
import { Command } from '../types/Command';
export class InteractionLoader {
    path: string;
    commands: Map<string, Command> = new Map();
    buttons = new Map();
    client: LudoClient;
    constructor(client: LudoClient, path: string) {
        this.path = path;
        this.client = client;
        this.load();
    }
    async load() {
        ['commands', 'buttons'].forEach(async type => {
            const files = await readdir(join(__dirname, this.path, type));

            files.forEach(async file => {
                if (!file.endsWith('.js')) return;
                const code = await import(join(__dirname, this.path, type, file));
                const name = file.replace('.js', '');
                this[type].set(name, code);
            });
        });
    }
    deployCommands() {
        const commands = [];
        this.commands.forEach(async code => {
            commands.push(code.data.toJSON());
        });
        if (process.env.NODE_ENV === 'production') {
            this.client.rest.put(Routes.applicationCommands(this.client.user.id), {
                body: commands
            });
        } else {
            process.env.DEV_GUILDS.split(' ').forEach(async guild => {
                await this.client.rest.put(
                    Routes.applicationGuildCommands(this.client.user.id, guild),
                    {
                        body: commands
                    }
                );
            });
        }
    }
}
