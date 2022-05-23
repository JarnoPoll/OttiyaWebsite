export class LevelManager
{
    player;
    hasPlayed = false;

    constructor(player)
    {
        this.player = player;
    }
    
    StartLevel(blocks)
    {
        if(this.played)
        {
            return;
        }
    }

    Reset(taskbar, character)
    {
        while (taskbar.firstChild) 
        {
            taskbar.removeChild(taskbar.firstChild);
        }

        character.style.transform = "translate(0px, 0px) scale(1)";
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

        var varDelay = false;

        (function k()
        {
            if(!varDelay)
            {
                setTimeout(k,1000);
                varDelay = true;
            }
            else if(index--)
            {
                const element = taskbar.children[taskbar.children.length - index - 1];
                console.log("DOING STUFF!");
                element.classList.forEach(className => {
                        switch(className)
                        {
                            case "CodeBlock_One":
                                var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                var position = positionRaw.split(',');
                                character.style.setProperty("transform", "translate(" + (+position[0] + 151) + "px, " + +position[1] + "px) scale(" + +position[2] + ")");
                                break;
                            case "CodeBlock_Two":
                                var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                var position = positionRaw.split(',');
                                character.style.setProperty("transform", "translate(" + (+position[0]) + "px, " + (+position[1] - 110) + "px) scale(" + +position[2] + ")");
                                break;
                            case "CodeBlock_Three":
                                var positionRaw = character.style.getPropertyValue("transform").match(/(-?[0-9\.]+)/g).toString();
                                var position = positionRaw.split(',');
                                character.style.setProperty("transform", "translate(" + (+position[0]) + "px, " + (+position[1] + 110) + "px) scale(" + +position[2] + ")");
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
                    });;

                setTimeout(k,1000);
            }
        })();
    }

    TransferCodeBlockToTaskbar(element)
    { 
        //element.setAttribute("onclick", "Test(this);");
        var tempElement = element.outerHTML.replace("button", "il");
    
        return tempElement
    }

    
}

class Taskbar
{
    	update()
        {
            $('#placeholder-codeblock').insertAfter($('#Taskbar').last());
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