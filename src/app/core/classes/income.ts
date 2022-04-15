import { Text } from './text';
export enum IncomeOperations {
    INCREASE,
    DECREASE,
    SET_VALUE,
}
export class Income extends Text {
    private income: number;

    constructor(scene: Phaser.Scene, x: number, y: number, initialIncome = 1000) {
        super(scene, x, y, 'Income: ${initialIncome}');
        scene.add.existing(this);
        this.income = initialIncome;
    }

    public incomeChange(operation: IncomeOperations, value: number): void {
        switch (operation) {
            case IncomeOperations.INCREASE:
                this.income += value;
                break;
            case IncomeOperations.DECREASE:
                this.income -= value;
                break;
            case IncomeOperations.SET_VALUE:
                this.income = value;
                break;
            default:
                break;
        }
        this.setText('Income: ${this.income}');
    }

    public getIncome(): number {
        return this.income;
    }
}