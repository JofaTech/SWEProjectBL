import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { Board } from '../core/models/board';
import { GameEngineService } from '../core/services/game-engine.service';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.css']
})
export class GameWindowComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(private gameEngine: GameEngineService) {
    this.config = {
      type: Phaser.AUTO,
      height: 600,
      width: 800,
      scene: [ MainScene ],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      }
    };
    this.phaserGame = new Phaser.Game(this.config);
  }

  ngOnInit(): void {

  }

}

class MainScene extends Phaser.Scene {
  board: Board;
  //TODO: delete after time/game service is implemented. this is just for testing
  frameCounter: number;
  constructor() {
    super({ key: 'main '});
  }

  create() {
    //this.add.image(400, 300, 'sky');
    this.frameCounter = 0;
    this.board = new Board(this, 400, 300);

    console.log('game calendar', this.board);
   
    // var particles = this.add.particles('red');

    // var emitter = particles.createEmitter({
    //     speed: 100,
    //     scale: { start: 1, end: 0 },
    //     blendMode: 'ADD'
    // });

    // var logo = this.physics.add.image(400, 100, 'logo');

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);

    // //TODO: this is just to demo movement on click, we want to remove it
    // this.input.on("pointerdown",(pointer: Phaser.Input.Pointer) => {
    //   console.log('x + ' + pointer.x + 'y' + pointer.y);
    //   this.board.updatePlayer(pointer.x, pointer.y);
    // });
  }

  preload() {
    this.loadLocalSprites();
    this.loadPhaserLabSprites();
  }

  loadLocalSprites() {
    this.load.image('player', location.href + 'assets/sprites/awesomeface.png');
  }

  loadPhaserLabSprites() {
    //TODO: these are just for demo purposes and can be removed
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  override update() {

    //TODO: this is just a test to prove out moving the character/updating in game date
    //It will be removed and replaced with a time or game engine service
    this.frameCounter++;
    if (this.frameCounter % 200 == 0) {
      let gameDate = this.board.getCurrentDate();
      console.log('current date', gameDate.getDate())
      let newDate = new Date(gameDate.setDate(gameDate.getDate() + 5));// gameDate.getDate() + 1;
      console.log('new date', newDate);
      this.board.setCurrentDate(new Date(newDate));
    }
    this.board.update()
  }
}