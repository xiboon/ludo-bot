import { readFile } from 'fs/promises';
import { Game } from './Game';
import { Canvas, createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { join } from 'path';
import { Positions } from '../types/Util';
export class BoardManager {
    positions = {
        1: [50, 85],
        2: [610, 85],
        3: [50, 1160],
        4: [610, 1160]
    };
    colors = ['58f287', 'f7de52', 'ed4245', '4187ed'];
    constructor() {
        GlobalFonts.registerFromPath(
            join(__dirname, '../../assets/ABCGintoNormal-Black-Trial.woff2'),
            'Ginto'
        );
    }
    async generate(game: Game) {
        const img = await readFile(`${__dirname}/../../assets/board.png`);
        const canvasImg = await loadImage(img);
        const canvas = createCanvas(1024, 1221);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(canvasImg, 0, 0, 1024, 1221);
        game.players.forEach(player => {
            const size = this.applyText(canvas, player.name);
            ctx.font = size;
            ctx.fillStyle = `#${this.colors[player.color - 1]}`;
            ctx.fillText(
                player.name,
                this.positions[player.color][0],
                this.positions[player.color][1]
            );
        });
        Object.values(game.coins).forEach(coins =>
            coins.forEach(coin => {
                this.drawCoin(
                    canvas,
                    this.colors[coin.color - 1],
                    Positions[coin.color - 1][0 - coin.position],
                    coin.id
                );
            })
        );
        return canvas.toBuffer('image/png');
    }
    // thanks d.js guide
    applyText(canvas: Canvas, text: string) {
        const context = canvas.getContext('2d');
        let fontSize = 50;

        do {
            context.font = `${(fontSize -= 3)}px Ginto`;
        } while (context.measureText(text).width > canvas.width - 650);

        return context.font;
    }

    drawCoin(canvas: Canvas, color: string, position: number[], id: number) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = `#${color}`;
        ctx.beginPath();
        ctx.arc(position[0], position[1], 25, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#18191c';
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.font = '40px Ginto';
        ctx.fillText(id.toString(), position[0] - 25 / 2, position[1] + 25 / 2);
    }
}
