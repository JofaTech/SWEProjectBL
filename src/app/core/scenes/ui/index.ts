import { Scene } from 'phaser';
import { Income, IncomeOperations } from '../../classes/income';

export class UIScene extends Scene {
    private income!: Income;
    constructor() {
        super('ui-scene');
    }

    create(): void { 
        this.income = new Income(this, 20, 20, 0);
    }
}