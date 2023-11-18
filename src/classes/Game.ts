export interface Coin {
    id: 1 | 2 | 3 | 4;
    color: 1 | 2 | 3 | 4;
    position: number;
    end: boolean;
}
export interface Player {
    color: 1 | 2 | 3 | 4;
    id: string;
    name: string;
}
export class Game {
    coins: Record<string, Coin[]>;
    id: number;
    players: Player[];
    creator: string;
    constructor(id: number, creator: string) {
        this.id = id;
        this.creator = creator;
        this.players = [];
        this.coins = {};
    }
    addPlayer(player: Player) {
        this.players.push(player);
        this.coins[player.id] = [];
        for (let i = 0; i < 4; i++) {
            this.coins[player.id].push(
                // @ts-expect-error
                { color: player.color, position: 0 - i, end: false, id: i + 1 }
            );
        }
    }
}
