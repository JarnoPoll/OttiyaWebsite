export class ActionController
{
    levelData;

    CallAction(name, data)
    {
        var sections = name.split('-');
        var finalName = "";
        for (let index = 0; index < sections.length; index++) {
            const element = sections[index];
            
            finalName += element.charAt(0).toUpperCase() + element.substring(1);
        }

        var classReference = this;

        data.itemData.then(function(result)
        {
            if(classReference.levelData == null)
            {
                for (let i = 0; i < result[0].length; i++) 
                {
                    for (let j = 0; j < result[0][i].length; j++) 
                    {
                        data.levelMap[i][j] = result[0][i][j];
                        if(result[0][i][j] == 1)
                        {
                            data.playerPosition.x = j;
                            data.playerPosition.y = i;
                            data.playerPosition.direction = data.playerStartingPosition.direction;
                            data.playerPosition.scale = data.playerStartingPosition.scale;
                            data.playerPosition.transparent = data.playerStartingPosition.transparent;
                        }
                    }
                }
                classReference.levelData = data;
            }
            classReference[finalName](result[0]);
        });
    }

    StopTaskbar()
    {
        clearInterval(this.levelData.actionIntervalID);
    }

    CheckShells(targetPos, playerScale)
    {
        var shells = $(this.levelData.items).filter(".shell");

        if(!window.playerScale)
        {
            playerScale = this.levelData.playerPosition.scale;
        }

        for (let i = 0; i < shells.length; i++) 
        {
            const shell = shells[i];
            var positionRaw = $(shell).attr("data-position");
            var position = positionRaw.split(',')

            if(position.length > 0)
            {
                for (let index = 0; index < (playerScale * 2); index++) 
                {
                    console.log(position[1] + "," + position[0] + " " +  this.Clamp((targetPos[1] - index), 0, 3) + "," + targetPos[0]);
                    if(position[1] == targetPos[0] && position[0] == this.Clamp((targetPos[1] - index), 0, 3))
                    {
                        console.log(this.levelData.playerPosition.transparent.toString());
                        if($(shell).attr("data-hidden") == this.levelData.playerPosition.transparent.toString())
                        {
                            $(shell).hide();
                            $(this.levelData.shells[this.levelData.shellCount]).attr("src", "assets/levels/Level_Shell_Color.png")
                            $(this.levelData.shells[this.levelData.shellCount]).attr("data-collected", "true")
                            this.levelData.shellCount++;
                        }
                        else
                        {
                            console.log("Can't pickup because transparent.");
                        }
                    }
                }
                
            }
        }
    }

    CheckObstacles(targetPos)
    {
        var playerScale = this.levelData.playerPosition.scale;
        for (let index = 0; index < (playerScale * 2); index++) 
        {
            if(this.levelData.levelMap[this.Clamp((targetPos[1] - index), 0, 3)][targetPos[0]] == 2)
            {
                return true;
            }
        }

        return false;
        
    }

    Wait(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));  
    }

    Clamp(num, min, max) 
    {
        return Math.min(Math.max(num, min), max);
    }

    SetPlayerPosition(playerPos, playerScale)
    {
        this.levelData.player.style.transform = `translate(${playerPos[0] * this.levelData.stepSizeHorizontal}px, ${((3 - playerPos[1]) * -this.levelData.stepSizeVertical) + (1-playerScale) * (this.levelData.playerHeight / 2)}px) scale(${playerScale})`;
        
        this.levelData.playerPosition.x = playerPos[0];
        this.levelData.playerPosition.y = playerPos[1];
        this.levelData.playerPosition.scale = playerScale;
    }

    MovementRight()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0] + 1), 0, 7), this.Clamp((playerPos[1]), 0, 3)]

        if(!this.levelData.playerPosition.transparent)
        {
            if(this.CheckObstacles(targetPos))
            {
                console.log("Found Obstacle");
                return;
            }
        }
        
        if(playerPos[1] < 3)
        {
            var value = this.levelData.levelMap[this.Clamp((playerPos[1] + 1), 0, 3)][targetPos[0]];
            if(value != 2 && value != 4)
            {
                console.log("FLOATING");
                this.StopTaskbar();
                return;
            }
        }

        if(this.levelData.playerPosition.direction != 1)
        {
            this.levelData.player.style.backgroundImage = "url('/assets/levels/Character_Image2.png')";
            this.levelData.playerPosition.direction = 1;
        }

        this.CheckShells(targetPos);
        this.SetPlayerPosition(targetPos, this.levelData.playerPosition.scale);
    }

    MovementLeft()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0] - 1), 0, 7), this.Clamp((playerPos[1]), 0, 3)]
        switch(this.levelData.levelMap[targetPos[1]][targetPos[0]])
        {
            case 2:
                if(!this.levelData.playerPosition.transparent)
                {
                    this.StopTaskbar();
                    return;
                }
                break;
        }

        if(playerPos[1] < 3)
        {
            if(this.levelData.levelMap[this.Clamp((playerPos[1] + 1), 0, 3)][targetPos[0]] != 2)
            {
                console.log("FLOATING");
                this.StopTaskbar();
                return;
            }
        }

        if(this.levelData.playerPosition.direction == 1)
        {
            this.levelData.player.style.backgroundImage = "url('/assets/levels/Character_Image2R.png')";
            this.levelData.playerPosition.direction = -1;
        }

        this.CheckShells(targetPos);
        this.SetPlayerPosition(targetPos, this.levelData.playerPosition.scale);
    }

    MovementUp()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0]), 0, 7), this.Clamp((playerPos[1] - 2), 0, 3)]
        
        //Check for ladder
        if(this.levelData.levelMap[targetPos[1] + 1][targetPos[0]] != 4)
        {
            console.log("Fail");
            this.StopTaskbar();
            return;
        }

    this.CheckShells(targetPos);
        this.SetPlayerPosition(targetPos, this.levelData.playerPosition.scale);
    }

    MovementDown()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0]), 0, 7), this.Clamp((playerPos[1] + 2), 0, 3)]

        //Check for ladder
        if(this.levelData.levelMap[targetPos[1] - 1][targetPos[0]] != 4)
        {
            console.log("Fail");
            this.StopTaskbar();
            return;
        }

        this.CheckShells(targetPos);
        this.SetPlayerPosition(targetPos, this.levelData.playerPosition.scale);
    }

    MovementJumpUp()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y];

        var targetPos = [this.Clamp((playerPos[0] + (1 * this.levelData.playerPosition.direction)), 0, 7), this.Clamp((playerPos[1] - 1), 0, 3)];

        switch(this.levelData.levelMap[targetPos[1]][targetPos[0]])
        {
            case 2:
                console.log("Fail");
                this.StopTaskbar();
                return;
        }

        this.CheckShells(targetPos);
        this.SetPlayerPosition(targetPos, this.levelData.playerPosition.scale);
    }

    MovementJumpDown()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y];

        if(playerPos[1] == 3)
        {
            return;
        }

        var targetPos = [this.Clamp((playerPos[0] + (1 * this.levelData.playerPosition.direction)), 0, 7), this.Clamp((playerPos[1] + 1), 0, 3)];

        switch(this.levelData.levelMap[targetPos[1]][targetPos[0]])
        {
            case 2:
                console.log("Fail");
                this.StopTaskbar();
                return;
        }

        this.CheckShells(targetPos);
        this.SetPlayerPosition(targetPos, this.levelData.playerPosition.scale);
    }

    AppearanceGrow()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var checkPos = [this.Clamp((playerPos[0]), 0, 7), this.Clamp((playerPos[1] - 1), 0, 3)]
        var playerScale =  this.Clamp((this.levelData.playerPosition.scale * 2), 0.5, 2);

        switch(this.levelData.levelMap[checkPos[1]][checkPos[0]])
        {
            case 2:
                if(!this.levelData.playerPosition.transparent)
                {
                    console.log("Fail");
                    this.StopTaskbar();
                }
                return;
        }

        this.SetPlayerPosition(playerPos, playerScale);
        this.CheckShells(playerPos);
    }

    AppearanceShrink()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var playerScale =  this.Clamp((this.levelData.playerPosition.scale / 2), 0.5, 2);

        this.SetPlayerPosition(playerPos, playerScale);
    }

    AppearanceReset()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var checkPos = [this.Clamp((playerPos[0]), 0, 7), this.Clamp((playerPos[1] - 1), 0, 3)]
        var playerScale =  this.Clamp((this.levelData.playerPosition.scale * 2), 0.5, 2);

        switch(this.levelData.levelMap[checkPos[1]][checkPos[0]])
        {
            case 2:
                console.log("Fail");
                this.StopTaskbar();
                return;
        }

        this.SetPlayerPosition(playerPos, playerScale);
        this.CheckShells(targetPos);
    }

    AppearanceDisappear()
    {
        $(this.levelData.player).attr("data-transparent", true);
        this.levelData.playerPosition.transparent = true;
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        this.CheckShells(playerPos);
    }

    AppearanceAppear()
    {
        $(this.levelData.player).attr("data-transparent", false);
        this.levelData.playerPosition.transparent = false;
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        this.CheckShells(playerPos);
    }
}