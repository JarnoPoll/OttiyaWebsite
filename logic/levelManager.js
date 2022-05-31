export class LevelManager
{
    player;
    hasPlayed = false;
    items;
    currentCategory;
    itemData;

    constructor(player, items, categories, startingCategory)
    {
        this.player = player;
        this.items = items;
        this.categories = categories;
        this.categories.not(`[data-category="${startingCategory}"]`).hide();
        this.currentCategory = startingCategory;
    }
    
    StartLevel(blocks)
    {
        if(this.played)
        {
            return;
        }
    }

    Reset(taskbar, blocks, character, shells)
    {
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

        character.style.transform = "translate(0px, 0px) scale(1)";

        //Return collected shells back to original spots
        $("#shell1").show();
        $("#shell2").show();
        $("#shell3").show();

        //Return shells in tab back to gray
        $("#grayshell1").attr("src","assets/levels/Level_Shell_Gray.png");
        $("#grayshell2").attr("src","assets/levels/Level_Shell_Gray.png");
        $("#grayshell3").attr("src","assets/levels/Level_Shell_Gray.png");
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

    PressedPlay(taskbarID, gridID, characterID)
    {
        var character = document.getElementById(characterID);

            

        var location = 0;
        
        //Read TaskBar
        var taskbar = document.getElementById(taskbarID);
        var grid = document.getElementById(gridID);
        var character = document.getElementById(characterID);
        var index = taskbar.children.length;
        character.style.transform = "translate(0px, 0px) scale(1)";
        var shell1 = $("#shell1");
        var shell2 = $("#shell2");
        var shell3 = $("#shell3");
        var varDelay = false;

       

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
        this.itemData = itemData;

        itemData.then(function(result, player)
        {
            for (let vertical = 0; vertical < result.length; vertical++) 
        {
            const tempArray = result[vertical];
            var stepSizeHorizontal = 150;
            var stepSizeVertical = 84;
            var obstacleCount = 0;
            var shellCount = 0;
            var ladderCount = 0;

            tempArray.forEach(function(value, index)
            {
                switch(value)
                {
                    case 1:
                        //player
                        var character = document.getElementById("character");
                        console.log(vertical);
                        character.style.transform = `translate(${index * stepSizeHorizontal}px, ${(3 - vertical) * -stepSizeVertical}px) scale(1)`;
                        break;
                    case 2:
                        //obstacle
                        break;
                    case 3:
                        //shell
                        break;
                    case 3:
                        //ladder
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


