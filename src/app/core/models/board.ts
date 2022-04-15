import { GlobalConstants } from "../global-constants";

export class DateCell {
    public x: number;
    public y: number;
    public day: number;
    public width: number;

    public textObj: Phaser.GameObjects.Text;

    constructor(x: number, y: number, width: number, day: number,  text: Phaser.GameObjects.Text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.day = day;
        this.textObj = text;
    }

    public  getCenterPosition(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.x + (this.width / 2), this.y + (this.width / 2));
    }
}

//TODO: need to play more with colors, text styles, fonts, etc
export class Board extends Phaser.GameObjects.Grid {
    
    private currentDate: Date;
    private dateDisplay: Phaser.GameObjects.Text;
    private dateCells!: DateCell[][];
    private inGameDateCell!: DateCell;

    private static readonly calendarRows: number = 6;
    private static readonly calendarColumns: number = 7;
    private static readonly dateDisplayPixelOffset: number = 5;

    private playerToken!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

     
    constructor(scene: Phaser.Scene, x: number, y: number, cellWidth: number = 72, cellColor: number = 0xFFFFFF, currentDate: Date = new Date()) {
        super(scene, x, y, cellWidth * Board.calendarColumns, cellWidth * Board.calendarRows, cellWidth, cellWidth, cellColor);
        scene.add.existing(this);

        this.currentDate = currentDate;
        let bounds = this.getBounds();
        this.dateDisplay = scene.add.text(bounds.x, bounds.y - 75, "")
            .setFontFamily(GlobalConstants.TextFont);

        this.playerToken = this.scene.physics.add.sprite(bounds.x, bounds.y, "player");
        this.playerToken.setDisplaySize(cellWidth - 10, cellWidth - 10);
       
        this.initGrid();
        this.setCurrentDate(currentDate);
    }

    updateDateDisplay() {
        this.dateDisplay.text = "Current Date: " + this.currentDate.toLocaleDateString("en-US");
        
    }

    plotHeader() {
       let days: string[] = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat" ];
       let bounds = this.getBounds();
       for (let index in days) {
            this.scene.add.text(bounds.x, bounds.y - 20, days[index])
                .setFontFamily(GlobalConstants.TextFont);
            bounds.x += this.cellWidth;
       }
    }

    plotDays() {
        let bounds = this.getBounds();

        let year = this.currentDate.getFullYear();
        let month = this.currentDate.getMonth();
        let currentDay = this.currentDate.getDate();

        // This...just works. Javscript months are 0 indexed so we need 
        // to add 1 here, otherwise we get number of days in last month
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Days of week also 0 based... Sunday - Saturday 0 - 6
        var firstDayOfThisMonth = new Date(year, month, 1);
        var monthWeekDayStart = firstDayOfThisMonth.getDay();
        var cellCounter = 0;
        while (cellCounter < daysInMonth) {
            for (let row = 0; row < Board.calendarRows; row++) {
                let col = row == 0 ? monthWeekDayStart : 0;
                while (col < Board.calendarColumns && cellCounter < daysInMonth) {
                    let dayDisplay = cellCounter + 1;
                    let xLoc = bounds.x + (col * this.cellWidth);
                    let yLoc = bounds.y + (row * this.cellWidth);
                    let isInGameDate = (dayDisplay == currentDay);
                    let textColor = isInGameDate ? "#FF0000" : "#000000";
                    let style = { color: textColor, fontFamily: GlobalConstants.TextFont };
                    let sceneText = this.scene.add.text(xLoc + Board.dateDisplayPixelOffset, yLoc + Board.dateDisplayPixelOffset, dayDisplay.toString(), style);
                    this.dateCells[row][col] = new DateCell(xLoc, yLoc, this.cellWidth, currentDay, sceneText);
                    if (isInGameDate)
                        this.inGameDateCell = this.dateCells[row][col];
                
                    cellCounter++;
                    col++;
                }
            }
        }
    }

    initGrid() {
        this.dateCells = [];
        for (let i = 0; i < Board.calendarRows; i++) {
            this.dateCells[i] = [];
        }
    }

    clearCells() {
        for (let i = 0; i < Board.calendarRows; i++) {
            for (let j = 0; j < Board.calendarColumns; j++) {
                if (this.dateCells[i][j] && this.dateCells[i][j].textObj)
                    this.dateCells[i][j].textObj.destroy();
            }
        }
    }

    override update() {
        let location = this.inGameDateCell.getCenterPosition();
        var distance = Phaser.Math.Distance.Between(this.playerToken.x, this.playerToken.y, location.x, location.y);

        if (this.playerToken.body.speed > 0)
        {
            //  4 is our distance tolerance, i.e. how close the source can get to the target
            //  before it is considered as being there. The faster it moves, the more tolerance is required.
            if (distance < 4)
            {
                this.playerToken.body.reset(location.x, location.y);
            }
        }
    }

    public getCurrentDate() {
        return this.currentDate;
    }

    public setCurrentDate(newDate: Date) {
        this.clearCells();
        this.currentDate = newDate;
        this.updateDateDisplay();
        this.plotHeader();
        this.plotDays()
        let newPlayerPos = this.inGameDateCell.getCenterPosition();
        this.scene.physics.moveToObject(this.playerToken, newPlayerPos, 500);
    }
}