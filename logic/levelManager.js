class LevelData
{
    player;
    hasPlayed = false;
    items;
    shells;
    currentCategory;
    itemData;
    obstacleCount = 0;
    shellCount = 0;
    ladderCount = 0;
    stepSizeHorizontal = 149;
    stepSizeVertical = 84;
    actionsRemaining = 0;
    isPaused = false;
    actionIntervalID;
    levelMap = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    playerPosition = {x: 0, y: 0, scale: 1, direction: 0};
    playerStartingPosition = {x: 0, y: 0, scale: 1, direction: 0};
    chapterNumber;
    levelNumber;
}

export class LevelManager
{
    levelData = new LevelData();

    constructor(player, items, categories, startingCategory, shells)
    {
        this.levelData.player = player;
        this.levelData.items = items;
        this.levelData.categories = categories;
        this.levelData.categories.not(`[data-category="${startingCategory}"]`).hide();
        this.levelData.currentCategory = startingCategory;
        this.levelData.shells = shells;
        this.levelData.shells.hide();
    }
    
    StartLevel(blocks)
    {
        if(this.levelData.played)
        {
            return;
        }
    }

    Reset(taskbar, blocks, character, shells)
    {
        this.levelData.player.style.transform = `translate(${this.levelData.playerStartingPosition.x * this.levelData.stepSizeHorizontal}px, ${(3 - this.levelData.playerStartingPosition.y) * -this.levelData.stepSizeVertical}px) scale(${this.levelData.playerStartingPosition.scale}) scaleX(${this.levelData.playerStartingPosition.direction})`;
        this.collectedShells = 0;

        clearInterval(this.levelData.actionIntervalID);

        for (let index = 0; index < blocks.length; index++) 
        {
            const element = blocks[index];
            taskbar.removeChild(element);
        }

        for (let index = 0; index < taskbar.children.length; index++) 
        {
            const element = taskbar.children[index];
            
            if(!$(element).is(':visible'))
            {
                $(element).show();
            }
        }

        for (let index = 0; index < this.levelData.shells.length; index++) {
            const element = this.levelData.shells[index];
            $(element).attr("src", "assets/levels/Level_Shell_Gray.png");
        }

        var pickups = $(this.levelData.items).filter(".shell");

        for (let index = 0; index < pickups.length; index++) {
            const element = pickups[index];
            var positionRaw = $(element).attr("data-position");
            if(positionRaw != "")
            {
                $(element).show();
            }
        }

        var resultWindow = document.getElementById("results-window");
        var resultShells = $(resultWindow).find(".results-shell");
        var resultText = $(resultWindow).find(".results-text").first();
        var pauseButtons = $(resultWindow).find("#pause-buttons");
        var completedButtons = $(resultWindow).find("#completed-buttons");
        var failedButtons = $(resultWindow).find("#failed-buttons");

        for (let index = 0; index < resultShells.length; index++) 
        {
            $(resultShells[index]).attr("src", "assets/levels/Level_Shell_Gray.png");
        }

        resultText.text("Pause");

        pauseButtons.show();
        completedButtons.hide();
        failedButtons.hide();
    }
    
    ChangeCategory(category)
    {
        if(this.levelData.currentCategory != category)
        {
            for (let index = 0; index < this.levelData.categories.length; index++) {
                const element = this.levelData.categories[index];
                console.log(element);
                if($(element).data("category") == this.levelData.currentCategory)
                {
                    console.log("Hiding Shown");
                    //resize button
                    $(element).hide();
                }
                else if($(element).data("category") == category)
                {
                    console.log("Showing New");
                    //resize button
                    $(element).show();
                }
            }
            
            this.levelData.currentCategory = category;

            return true;
        }

        return false;
    }

    PressedPlay()
    {
        var taskbarChildren = document.getElementById("Taskbar").children;
        var actions = $(taskbarChildren).filter(".CodeBlock");

        this.levelData.actionsRemaining = actions.length;
        this.levelData.shellCount = 0;
        var actionController = new ActionController();
        this.levelData.actionIntervalID = setInterval(this.CheckAction.bind(this), 1000, actions, actionController)
    }

    TogglePause()
    {
        console.log("ActionsRemaining on Pause: " + this.levelData.actionsRemaining);
        if(this.levelData.isPaused)
        {
            if(this.levelData.actionsRemaining > 0)
            {
                var taskbarChildren = document.getElementById("Taskbar").children;
                var actions = $(taskbarChildren).filter(".CodeBlock");
                this.levelData.actionIntervalID = setInterval(this.CheckAction.bind(this), 1000, actions)
                this.levelData.isPaused = false;
            }
            else
            {
                this.levelData.isPaused = false;
            }
        }
        else
        {
            console.log("IsPausing");
            this.levelData.isPaused = true;
            clearInterval(this.levelData.actionIntervalID);
        }
    }

    CheckAction(actions, actionController)
    {
        console.log("Actions Length: " + actions.length + " Actions Remaining: " + this.levelData.actionsRemaining);
        var task = actions[actions.length - this.levelData.actionsRemaining];

        //this.runAction($(task).data("function"));
        
        actionController.CallAction($(task).data("function"), this.levelData);

        /*
        var result = this.MovePlayer();

        var intervalID = this.levelData.actionIntervalID;
        result.then(function(result)
        {
            if(result == false)
            {
                clearInterval(intervalID);
            }
        });
        */

        this.levelData.actionsRemaining--;
        if(this.levelData.actionsRemaining <= 0)
        {
            clearInterval(this.levelData.actionIntervalID);
            this.Wait(1000).then(()=> this.CheckCompletion());
        }
    }

    Wait(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));  
    }

    CheckCompletion()
    {
        var availableShells = this.levelData.shells.filter(":visible");
        
        var collectedShells = $(availableShells).filter(`[data-collected='${true}']`);
        console.log(collectedShells);
        var resultWindow = document.getElementById("results-window");
        var resultShells = $(resultWindow).find(".results-shell");
        var resultText = $(resultWindow).find(".results-text").first();
        var pauseButtons = $(resultWindow).find("#pause-buttons");
        var completedButtons = $(resultWindow).find("#completed-buttons");
        var failedButtons = $(resultWindow).find("#failed-buttons");

        var count = collectedShells.length;

        for (let index = 0; index < resultShells.length; index++) 
        {
            if($(resultShells[index]).css('display') != 'none' && count > 0)
            {
                console.log("FOUND COLLECTED SHELL");
                $(resultShells[index]).attr("src", "assets/levels/Level_Shell_Color.png");
                count--;
            }
            else
            {
                $(resultShells[index]).attr("src", "assets/levels/Level_Shell_Gray.png");
            }
        }

        var cookieData = JSON.parse(this.GetCookie("completionData"));

        if(availableShells.length == collectedShells.length)
        {
            //won
            resultText.text("Congratulations!");
            pauseButtons.hide();
            failedButtons.hide();
            completedButtons.show();

            cookieData.starCompletion[this.levelData.chapterNumber][this.levelData.levelNumber] = collectedShells.length;
            cookieData.levelCompletion[this.levelData.chapterNumber][this.levelData.levelNumber] = true;
            if(cookieData.levelCompletion[this.levelData.chapterNumber].length == this.levelData.levelNumber)
            {
                cookieData.chapterCompletion[this.levelData.chapterNumber] = true;
            }
        }
        else
        {
            //lost
            resultText.text("Oh no...");
            pauseButtons.hide();
            completedButtons.hide();
            failedButtons.show();
            cookieData.starCompletion[this.levelData.chapterNumber][this.levelData.levelNumber] = collectedShells.length;
        }
        
        $(resultWindow).show();
        document.cookie = "completionData=" + JSON.stringify(cookieData);
        console.log(cookieData);
    }

    ResetItems(items)
    {
        items.each(function(index, img)
        {
            var item = $(img);
            item.hide();
        });
    }

    SetItems(itemData, chapter, level)
    {
        this.levelData.itemData = itemData;
        this.levelData.chapterNumber = chapter - 1;
        this.levelData.levelNumber = level - 1;

        var localData = this.levelData;
        localData.shellCount = 0;
        localData.obstacleCount = 0;
        localData.ladderCount = 0;

        for (let index = 0; index < localData.shells.length; index++) {
            const element = localData.shells[index];
            $(element).attr("src", "assets/levels/Level_Shell_Gray.png")
            $(element).hide();
        }

        itemData.then(function(result)
        {
            for (let vertical = 0; vertical < result[0].length; vertical++) 
            {
                const tempArray = result[0][vertical];
                
                tempArray.forEach(function(value, index)
                {
                    switch(value)
                    {
                        case 1:
                            //player
                            localData.playerStartingPosition.x = index;
                            localData.playerStartingPosition.y = vertical;
                            localData.playerStartingPosition.direction = result[1];
                            localData.playerStartingPosition.scale = 1;
                            localData.player.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${(3 - vertical) * -localData.stepSizeVertical}px) scale(${localData.playerStartingPosition.scale}) scaleX(${localData.playerStartingPosition.direction})`;
                            break;
                        case 2:
                            //obstacle
                            var item = $(localData.items).filter('.obstacle')[localData.obstacleCount];
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();
                            localData.obstacleCount++;
                            break;
                        case 3:
                            //shell
                            var item = $(localData.items).filter('.shell')[localData.shellCount];
                            console.log(item);
                            $(item).attr("data-position", `${vertical},${index}`);
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();
                            var shell = $(localData.shells)[localData.shellCount];
                            $(shell).attr("data-collected", false)
                            $(shell).show();
                            localData.shellCount++;
                            break;
                        case 4:
                            //ladder
                            var item = $(localData.items).filter('.ladder')[localData.ladderCount];
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();
                            localData.ladderCount++;
                            break;
                        default:
                            break;
                    }
                });
            }

            var resultShells = $(".results-shell");
            $(resultShells).show()
            console.log(resultShells);
            switch(localData.shellCount)
            {
                case 1:
                    $(resultShells[0]).hide();
                    $(resultShells[2]).hide();
                    break;
                case 2:
                    $(resultShells[1]).hide();
                    break;
            }
        });

        this.levelData.playerStartingPosition = localData.playerStartingPosition;
    }

    GetCookie(cname) 
    {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }

        return "";
    }

    
}

class ActionController
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
                        }
                    }
                }
                classReference.levelData = data;
            }
            classReference[finalName](result[0]);
        });
    }

    //1 player
    //2 obstacle
    //3 shell
    //4 ladder

    CollectShell(targetPos)
    {
        var shells = $(this.levelData.items).filter(".shell");
            
        for (let i = 0; i < shells.length; i++) 
        {
            const shell = shells[i];
            var positionRaw = $(shell).attr("data-position");
            var position = positionRaw.split(',')
            if(position.length > 0)
            {
                if(position[1] == targetPos[0] && position[0] == targetPos[1])
                {
                    $(shell).hide();
                    $(this.levelData.shells[this.levelData.shellCount]).attr("src", "assets/levels/Level_Shell_Color.png")
                    $(this.levelData.shells[this.levelData.shellCount]).attr("data-collected", "true")
                    this.levelData.shellCount++;
                }
            }
        }
    }

    Clamp(num, min, max) 
    {
        return Math.min(Math.max(num, min), max);
    } 

    MovementRight(test)
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0] + 1), 0, 7), this.Clamp((playerPos[1]), 0, 3)]

        switch(this.levelData.levelMap[targetPos[1]][targetPos[0]])
        {
            case 2:
                console.log("Fail");
                return;
            case 3:
                this.CollectShell(targetPos);
                break;
        }
        
        this.levelData.player.style.transform = `translate(${targetPos[0] * this.levelData.stepSizeHorizontal}px, ${(3 - targetPos[1]) * -this.levelData.stepSizeVertical}px) scale(${this.levelData.playerPosition.scale}) scaleX(${this.levelData.playerPosition.direction}`;
        
        this.levelData.playerPosition.x = targetPos[0];
        this.levelData.playerPosition.y = targetPos[1];
    }

    MovementLeft()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0] - 1), 0, 7), this.Clamp((playerPos[1]), 0, 3)]
        switch(this.levelData.levelMap[targetPos[1]][targetPos[0]])
        {
            case 2:
                console.log("Fail");
                return;
            case 3:
                this.CollectShell(targetPos);
                break;
        }

        if(playerPos[1] < 3)
        {
            if(this.levelData.levelMap[this.Clamp((playerPos[1] + 1), 0, 3)][targetPos[0]] != 2)
            {
                console.log("FLOATING");
                return;
            }
        }

        this.levelData.player.style.transform = `translate(${targetPos[0] * this.levelData.stepSizeHorizontal}px, ${(3 - targetPos[1]) * -this.levelData.stepSizeVertical}px) scale(${this.levelData.playerPosition.scale}) scaleX(${this.levelData.playerPosition.direction}`;
        
        this.levelData.playerPosition.x = targetPos[0];
        this.levelData.playerPosition.y = targetPos[1];
    }

    MovementUp()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0]), 0, 7), this.Clamp((playerPos[1] - 2), 0, 3)]

        if(this.levelData.levelMap[targetPos[1]][targetPos[0]] != 4)
        {
            console.log("Fail");
            return;
        }

        this.levelData.player.style.transform = `translate(${targetPos[0] * this.levelData.stepSizeHorizontal}px, ${(3 - targetPos[1]) * -this.levelData.stepSizeVertical}px) scale(${this.levelData.playerPosition.scale}) scaleX(${this.levelData.playerPosition.direction}`;
        
        this.levelData.playerPosition.x = targetPos[0];
        this.levelData.playerPosition.y = targetPos[1];
    }

    MovementDown()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y]
        var targetPos = [this.Clamp((playerPos[0]), 0, 7), this.Clamp((playerPos[1] + 2), 0, 3)]

        if(this.levelData.levelMap[targetPos[1]][targetPos[0]] != 4)
        {
            console.log("Fail");
            return;
        }

        this.levelData.player.style.transform = `translate(${targetPos[0] * this.levelData.stepSizeHorizontal}px, ${(3 - targetPos[1]) * -this.levelData.stepSizeVertical}px) scale(${this.levelData.playerPosition.scale}) scaleX(${this.levelData.playerPosition.direction}`;
        
        this.levelData.playerPosition.x = targetPos[0];
        this.levelData.playerPosition.y = targetPos[1];
    }

    MovementJump()
    {
        var playerPos = [this.levelData.playerPosition.x, this.levelData.playerPosition.y];
        var direction = (this.levelData.levelMap[playerPos[1]][playerPos[0] + (1 * this.levelData.playerPosition.direction)] == 2 ? -1 : 1);

        var targetPos = [this.Clamp((playerPos[0] + (1 * this.levelData.playerPosition.direction)), 0, 7), this.Clamp((playerPos[1] + (1 * direction)), 0, 3)];
        //console.log("X: " + targetPos[0] + " Y: " + targetPos[1]);
        switch(this.levelData.levelMap[targetPos[1]][targetPos[0]])
        {
            case 2:
                console.log("Fail");
                return;
            case 3:
                this.CollectShell(targetPos);
                break;
        }

        this.levelData.player.style.transform = `translate(${targetPos[0] * this.levelData.stepSizeHorizontal}px, ${(3 - targetPos[1]) * -this.levelData.stepSizeVertical}px) scale(${this.levelData.playerPosition.scale}) scaleX(${this.levelData.playerPosition.direction}`;
        
        this.levelData.playerPosition.x = targetPos[0];
        this.levelData.playerPosition.y = targetPos[1];
    }
}



var basePath = "./assets/levels/";

/*
function LoadLevel()
{
    fetch(CreatePath(1,1)).then(response => { return response.json(); })
    .then(jsondata => 
        console.log(jsondata.Time)
        //Use gathered data.
        );
}

function CreatePath(difficulty, level)
{
    return basePath + `difficulty_${difficulty}/level_${level}/dataFile.json`;
}
*/


