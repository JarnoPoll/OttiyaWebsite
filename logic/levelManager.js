export class LevelManager
{
    player;
    hasPlayed = false;
    shells;
    currentCategory;

    constructor(player, shells, categories, startingCategory)
    {
        this.player = player;
        this.shells = shells;
        this.categories = categories;
        this.categories.not(`[data-category="${startingCategory}"]`).hide();
        this.currentCategory = startingCategory;
        console.log(categories);
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

        $("#shell1").show(); //Return collected shells back to original spots

        //Return shells in tab back to gray
        $("#grayshell1").attr("src","assets/levels/Level_Shell_Gray.png");
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
        if(this.hasPlayed)
        {
            var character = document.getElementById(characterID);

            character.style.transform = "translate(0px, 0px) scale(1)";
        }

        this.hasPlayed = true;
        
        var location = 0;
        
        //Read TaskBar
        var taskbar = document.getElementById(taskbarID);
        var grid = document.getElementById(gridID);
        var character = document.getElementById(characterID);
        var index = taskbar.children.length;
        character.style.transform = "translate(0px, 0px) scale(1)";
        var shell1 = $("#shell1");
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
                            const element = shell1[index];
                            var elementRect = element.getBoundingClientRect();
                            if((elementRect.left - 20) < playerRect.left)
                            {
                                //Console message that the shell is collected
                                console.log("Shell collected!");
                                //Delete shell and add to collected shells
                                shell1.hide(); //Hide the shell, now to test!

                                $("#grayshell1").attr("src","assets/levels/Level_Shell_Color.png");
                            }
                        }
                    });

                setTimeout (k,1000);
            }
        })();
    }

    TransferCodeBlockToTaskbar(element)
    { 
        var tempElement = element.outerHTML.replace("button", "il");
    
        return tempElement
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


