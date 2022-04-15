import { Board } from "../models/board";
import { Player } from "../models/player";

export class MainScene extends Phaser.Scene {
    board: Board;
    //TODO: delete after time/game service is implemented. this is just for testing
    frameCounter: number = 0;
    constructor() {
      super({ key: 'main'});

    }
  
    create() {
      this.frameCounter = 0;
      this.board = new Board(this, 400, 300);
      //this.scene.start('ui-scene');
    }
  
    preload() {
      this.load.image('player', location.href + 'assets/sprites/awesomeface.png');
    }

    init(player: Player) {
      console.log('player passed into scene', player);
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