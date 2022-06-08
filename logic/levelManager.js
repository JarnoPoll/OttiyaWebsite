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
        if(this.currentCategory != category)
        {
            for (let index = 0; index < this.categories.length; index++) {
                const element = this.categories[index];
    
                if($(element).data("category") == this.currentCategory)
                {
                    console.log("Hiding Shown");
                    $(element).hide();
                }
                else if($(element).data("category") == category)
                {
                    console.log("Showing New");
                    $(element).show();
                }
            }
            
            this.currentCategory = category;
        }
    }

    PressedPlay()
    {
        var taskbarChildren = document.getElementById("Taskbar").children;
        var actions = $(taskbarChildren).filter(".CodeBlock");

        this.levelData.actionsRemaining = actions.length;
        this.levelData.shellCount = 0;
        this.levelData.actionIntervalID = setInterval(this.CheckAction.bind(this), 1000, actions)
        //Read TaskBar
        /*
        (function k()
        {
            var characterRect = character.getBoundingClientRect();
            console.log("CharacterLeft: " + characterRect.left + " CharacterBottom: " + characterRect.bottom);
            if(!varDelay)
            {
                setTimeout(k,1000);
                varDelay = true;
            }
            else if(index--)
            {
                const element = taskbar.children[taskbar.children.length - index - 1];
                element.classList.forEach(className => {
                        switch(className)
                        {
                            case "CodeBlock_One":
                                //Check for obstable.
                                var obstacle = document.getElementsByClassName('obstacle')[0];
                                var obstacleRect = obstacle.getBoundingClientRect();
                                var characterRect = character.getBoundingClientRect();
                                var distance = obstacleRect.left - Math.abs(characterRect.left);
                                console.log("Obstacle Check: ObstacleLeft-" + obstacleRect.left + "CharacterLeft-" + characterRect.left);
                                if(distance > 0 && distance < 150)
                                {
                                    console.log("Obstacle Height Check");
                                    console.log("Obstacle Height Check: ObstacleTop-" + obstacleRect.top + "CharacterBottom-" + Math.abs(characterRect.bottom) + 20);
                                    //Check height
                                    if(obstacleRect.top > Math.abs(characterRect.top) + (character.clientHeight / 2))
                                    {
                                        //Move
                                        var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                        var position = positionRaw.split(',');
                                        character.style.setProperty("transform", "translate(" + (+position[0] + 150) + "px, " + +position[1] + "px) scale(" + +position[2] + ")");
                                        
                                    }
                                }
                                else
                                {
                                    var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                    var position = positionRaw.split(',');
                                    character.style.setProperty("transform", "translate(" + (+position[0] + 150) + "px, " + +position[1] + "px) scale(" + +position[2] + ")");
                                }
                               break;
                            case "CodeBlock_Two":
                                var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                var position = positionRaw.split(',');
                                character.style.setProperty("transform", "translate(" + (+position[0]) + "px, " + (+position[1] - 84) + "px) scale(" + +position[2] + ")");
                                break;
                            case "CodeBlock_Three":
                                var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                var position = positionRaw.split(',');
                                character.style.setProperty("transform", "translate(" + (+position[0]) + "px, " + (+position[1] + 84) + "px) scale(" + +position[2] + ")");
                                break;
                            case "CodeBlock_Four":
                                var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                var position = positionRaw.split(',');
                                character.style.setProperty("transform", "translate(" + (+position[0]) + "px, " + (+position[1] + (character.clientHeight / 4) * position[2]) + "px) scale(" + +position[2] * 0.5 + ")");
                                break;
                            case "CodeBlock_Five":
                                var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                var position = positionRaw.split(',');
                                character.style.setProperty("transform", "translate(" + (+position[0]) + "px, " + (+position[1] - (character.clientHeight / 2) * position[2]) + "px) scale(" + +position[2] * 2 + ")");
                                break;
                        }

                        var playerRect = character.getBoundingClientRect();
                        
                        for (let index = 0; index < shell1.length; index++) 
                        {
                            const element1 = shell1[index];
                            var element1Rect = element1.getBoundingClientRect();
                            if((element1Rect.left - 20) < playerRect.left)
                            {
                                //Console message that the shell is collected
                                console.log("Shell collected!");
                                
                                //Hide the shell, now to test!
                                $("#shell1").hide();

                                $("#grayshell1").attr("src","assets/levels/Level_Shell_Color.png");
                            }
                        }

                        for (let index = 0; index < shell2.length; index++) 
                        {
                            const element2 = shell2[index];
                            var element2Rect = element2.getBoundingClientRect();
                            if((element2Rect.left - 20) < playerRect.left)
                            {
                                //Console message that the shell is collected
                                console.log("Shell collected!");
                                
                                //Hide the shell, now to test!
                                $("#shell2").hide();

                                $("#grayshell2").attr("src","assets/levels/Level_Shell_Color.png");
                            }
                        }
                    });

                setTimeout (k,1000);
            }
        })();
        */
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
                            case 0:
                                console.log("Nothing");
                                break;
                            case 1: 
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
                                                console.log(localData.shellCount);
                                                $(localData.shells[localData.shellCount]).attr("src", "assets/levels/Level_Shell_Color.png")
                                                localData.shellCount++;
                                            }
                                        }
                                        console.log(vertical + " " + index);
                                        console.log(position);
                                    }
                                    
                                }
                                break;
                            case 2: 
                                console.log("left");
                                if(index > 0 && tempArray[index - 1] == 1)
                                {
                                    succes = false;
                                }
                                break;
                            case 3:
                                console.log("up");
                                //if(result[vertical - 1][index + localData.playerPosition.x] != 4)
                                //{
                                //    console.log("Vertical: " + (vertical - 1) + " Horizontal: " + index + " Value: " + result[vertical - 1][index]);
                                //    succes = false;
                                //}
                                //else
                                //{
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
                                //}
                                break;
                            case 4:
                                console.log("down");
                                if(result[vertical + 1][index] != 4)
                                {
                                    succes = false;
                                }
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

    CheckAction(actions)
    {
        console.log("Actions Length: " + actions.length + " Actions Remaining: " + this.levelData.actionsRemaining);
        var task = actions[actions.length - this.levelData.actionsRemaining];

        task.classList.forEach(className => {
            switch(className)
            {
                case "CodeBlock_One":
                    this.levelData.playerPosition.x++;
                    this.levelData.playerPosition.currentAction = 1;
                    console.log("Set to [1]");
                    break;
                case "CodeBlock_Two":
                    this.levelData.playerPosition.y += 1;
                    this.levelData.playerPosition.x++;
                    this.levelData.playerPosition.currentAction = 3;
                    console.log("Set to [3]");
                    break;
                case "CodeBlock_Three":
                    this.levelData.playerPosition.y -= 2;
                    this.levelData.playerPosition.currentAction = 4;
                    console.log("Set to [4]");
                    break;
                case "CodeBlock_Four":
                    this.levelData.playerPosition.size *= 2;
                    this.levelData.playerPosition.currentAction = 0;
                    break;
                case "CodeBlock_Five":
                    this.levelData.playerPosition.size /= 2;
                    this.levelData.playerPosition.currentAction = 0;
                    break;
            }
        });
        
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
        }
    }

    ResetItems(items)
    {
        items.each(function(index, img)
        {
            var item = $(img);
            item.hide();
        });
    }

    SetItems(itemData)
    {
        this.levelData.itemData = itemData;
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
                            console.log(shell);
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
        });
    }

    TransferCodeBlockToTaskbar(element)
    { 
        var tempElement = element.outerHTML.replace("button", "il");
    
        return tempElement;
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


