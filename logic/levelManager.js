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
    playerPosition = {x: 0, y: 0, size: 1, currentAction: 0};
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
        this.levelData.playerPosition = {x: 0, y: 0, size: 1};
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

        this.MovePlayer();
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
        this.levelData.actionIntervalID = setInterval(this.CheckAction.bind(this), 1000, actions)
    }

    MovePlayer()
    {
        var localData = this.levelData;
        var succes = true;

        return localData.itemData.then(function(result)
        {
            for (let vertical = 0; vertical < result.length; vertical++) 
            {
                const tempArray = result[vertical];
                
                tempArray.forEach(function(value, index)
                {
                    if(value == 1)
                    {
                        switch(localData.playerPosition.currentAction)
                        {
                            case "MovementRight": 
                                if((index + localData.playerPosition.x) < tempArray.length && result[vertical - localData.playerPosition.y][index + localData.playerPosition.x] == 2)
                                {
                                    
                                    succes = false;
                                }
                                else((index + localData.playerPosition.x) < tempArray.length && result[vertical - localData.playerPosition.y][index + localData.playerPosition.x] == 3)
                                {

                                    console.log("Collect Shell");
                                    
                                    var shells = $(localData.items).filter(".shell");
                                    
                                    for (let i = 0; i < shells.length; i++) {
                                        const shell = shells[i];
                                        var positionRaw = $(shell).attr("data-position");
                                        var position = positionRaw.split(',')
                                        if(position.length > 0)
                                        {
                                            if(vertical == position[0] && index + localData.playerPosition.x == (position[1]))
                                            {
                                                $(shell).hide();
                                                $(localData.shells[localData.shellCount]).attr("src", "assets/levels/Level_Shell_Color.png")
                                                $(localData.shells[localData.shellCount]).attr("data-collected", "true")
                                                localData.shellCount++;
                                            }
                                        }
                                        console.log(vertical + " " + index);
                                        console.log(position);
                                    }
                                    
                                }
                                break;
                            case "MovementLeft": 
                                console.log("left");
                                if(index > 0 && tempArray[index - 1] == 1)
                                {
                                    succes = false;
                                }
                                break;
                            case "MovementUp":
                                /*
                                var gravity = -15;

                                localData.player.style.transform = `translate(${(index + (localData.playerPosition.x - 1)) * localData.stepSizeHorizontal}px, ${(3 - (vertical - localData.playerPosition.y)) * -localData.stepSizeVertical}px) scale(1)`;

                                function k()
                                {
                                    var x = ((index + (localData.playerPosition.x)) * localData.stepSizeHorizontal) - ((localData.stepSizeHorizontal / 30) * (gravity - 15));
                                    var y;
                                    if(gravity < 0)
                                    {
                                        y = ((3 - (vertical - localData.playerPosition.y)) * - localData.stepSizeVertical) + (10 * gravity);
                                    }
                                    else
                                    {
                                        y = ((3 - (vertical - localData.playerPosition.y)) * - localData.stepSizeVertical) - (10 * (-15 + gravity));;
                                    }
                                    console.log(y);
                                    localData.player.style.transform = `translate(${x}px, ${y}px) scale(1)`;
                                    gravity++;
                                    if(gravity < 15)
                                    {
                                        setTimeout(k, 100);
                                    }
                                }
                                
                                setTimeout(k, 1000);
                                */
                                break;
                            case "MovementDown":
                                break;
                            case "MovementJump":
                                break;
                            default:
                                break;
                        }
                        if(succes)
                        {
                            localData.player.style.transform = `translate(${(index + localData.playerPosition.x) * localData.stepSizeHorizontal}px, ${(3 - (vertical - localData.playerPosition.y)) * -localData.stepSizeVertical}px) scale(1)`;

                        }
                        return true;
                    }
                });
            }

            return succes;
        });
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

    runAction(name)
    {
        var sections = name.split('-');
        var finalName = "";
        for (let index = 0; index < sections.length; index++) {
            const element = sections[index];
            
            finalName += element.charAt(0).toUpperCase() + element.substring(1);
        }

        this.levelData.playerPosition.currentAction = finalName;

        this[finalName]();
    }

    CheckAction(actions)
    {
        console.log("Actions Length: " + actions.length + " Actions Remaining: " + this.levelData.actionsRemaining);
        var task = actions[actions.length - this.levelData.actionsRemaining];

        this.runAction($(task).data("function"));
        
        var result = this.MovePlayer();

        var intervalID = this.levelData.actionIntervalID;
        result.then(function(result)
        {
            if(result == false)
            {
                clearInterval(intervalID);
            }
        });

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

        var count = collectedShells.length;

        for (let index = 0; index < resultShells.length; index++) 
        {
            if($(resultShells[index]).css('display') != 'none' && count > 0)
            {
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
            cookieData.starCompletion[this.levelData.chapterNumber][this.levelData.levelNumber] = collectedShells.length;
        }
        
        $(resultWindow).show();

        document.cookie = "completionData=" + JSON.stringify(cookieData);
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
        this.levelData.levelNumber= level - 1;
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
            for (let vertical = 0; vertical < result.length; vertical++) 
            {
                const tempArray = result[vertical];
                
                tempArray.forEach(function(value, index)
                {
                    switch(value)
                    {
                        case 1:
                            //player
                            localData.player.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${(3 - vertical) * -localData.stepSizeVertical}px) scale(1)`;
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

    MovementRight()
    {
        this.levelData.playerPosition.x++;
    }

    MovementLeft()
    {
        this.levelData.playerPosition.x--;
    }

    MovementUp()
    {
        this.levelData.playerPosition.y += 2;
    }

    MovementDown()
    {
        this.levelData.playerPosition.y -= 2;
    }

    MovementJump()
    {
        this.levelData.playerPosition.y += 1;
        this.levelData.playerPosition.x++;
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


