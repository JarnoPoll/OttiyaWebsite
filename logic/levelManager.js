import {ActionController} from './ActionController.js';

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
    stepSizeHorizontal = 120;
    stepSizeVertical = 68;
    actionsRemaining = 0;
    isPaused = false;
    actionIntervalID;
    levelMap = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    playerPosition = {x: 0, y: 0, scale: 0, direction: 0, transparent: false};
    playerStartingPosition = {x: 0, y: 0, scale: 0, direction: 0, transparent: false};
    playerHeight = 136;
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
        if(this.levelData.playerStartingPosition.direction == 1)
        {
            this.levelData.player.style.backgroundImage = "url('/assets/levels/Character_Image2.png')";
        }
        else
        {
            this.levelData.player.style.backgroundImage = "url('/assets/levels/Character_Image2R.png')";
        }
        this.levelData.player.style.transform = `translate(${this.levelData.playerStartingPosition.x * this.levelData.stepSizeHorizontal}px, ${((3 - this.levelData.playerStartingPosition.y) * -this.levelData.stepSizeVertical) + (1-this.levelData.playerStartingPosition.scale) * (this.levelData.playerHeight / 2)}px) scale(${this.levelData.playerStartingPosition.scale})`;
        $(this.levelData.player).attr("data-transparent", false);
        
        this.collectedShells = 0;

        clearInterval(this.levelData.actionIntervalID);


        for (let index = 0; index < this.levelData.shells.length; index++) {
            const element = this.levelData.shells[index];
            $(element).attr("src", "assets/levels/Level_Shell_Gray.png");
            $(element).attr("data-collected", false);
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
                this.levelData.actionIntervalID = setInterval(this.CheckAction.bind(this), 1200, actions)
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
        var currentTaskPosition = actions.length - this.levelData.actionsRemaining;
        var task = actions[currentTaskPosition];
        
        /*
        if(currentTaskPosition != 0)
        {
            actions[currentTaskPosition - 1].classList.add("green");
        }
        */

        var name = $(task).data("function");
        console.log("Calling function with name: " + name);
        actionController.CallAction(name, this.levelData, this.CheckCompletion);

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
        var goalCollected = $(this.levelData.items.filter(`.goal:visible`)[0]).attr("data-collected");
        console.log(goalCollected);
        var collectedShells = $(availableShells).filter(`[data-collected='${true}']`);
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

        if(availableShells.length == collectedShells.length && (goalCollected == true || !window.goalCollected))
        {
            //won
            resultText.text("Congratulations!");
            pauseButtons.hide();
            failedButtons.hide();
            completedButtons.show();
            /*
            $("#Taskbar il.CodeBlock:not('.green')").each(function(index)
            {
                console.log($(this));
                $(this)[0].classList.add("green");
            });
            */
            cookieData.starCompletion[this.levelData.chapterNumber][this.levelData.levelNumber] = collectedShells.length;
            cookieData.levelCompletion[this.levelData.chapterNumber][this.levelData.levelNumber] = true;
            if(cookieData.levelCompletion[this.levelData.chapterNumber].length == this.levelData.levelNumber + 1)
            {
                cookieData.chapterCompletion[this.levelData.chapterNumber] = true;
            }
        }
        else
        {
            //lost
            resultText.text("Oh no...");
            /*
            $("#Taskbar il.CodeBlock:not('.green')").each(function(index)
            {
                console.log($(this));
                $(this)[0].classList.add("red");
            });
            */
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

    ClearTaskbar()
    {
        var blocks = $('#Taskbar il.action-button');
        var taskbar = document.getElementById("Taskbar");
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
    }

    SetItems(itemData, chapter, level)
    {
        
        this.ClearTaskbar();
        this.levelData.itemData = itemData;
        this.levelData.chapterNumber = chapter - 1;
        this.levelData.levelNumber = level - 1;

        var localData = this.levelData;
        localData.shellCount = 0;

        for (let index = 0; index < localData.shells.length; index++) {
            const element = localData.shells[index];
            $(element).attr("src", "assets/levels/Level_Shell_Gray.png")
            $(element).hide();
            $($(localData.items).filter('.shell')[index]).attr("data-position", "");
            $($(localData.items).filter('.shell')[index]).attr("data-hidden", "false");
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
                            localData.playerStartingPosition.scale = result[2];
                            localData.playerStartingPosition.transparent = false;
                            console.log(localData.player.clientHeight / 2);
                            if(result[1] == 1)
                            {
                                localData.player.style.backgroundImage = "url('/assets/levels/Character_Image2.png')";
                            }
                            else
                            {
                                localData.player.style.backgroundImage = "url('/assets/levels/Character_Image2R.png')";
                            }
                            localData.player.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) * -localData.stepSizeVertical) + (1-localData.playerStartingPosition.scale) * (localData.playerHeight / 2)}px) scale(${localData.playerStartingPosition.scale})`;
                            $(localData.player).attr("data-transparent", false);
                            break;
                        case 2:
                            //obstacle
                            var template = $(localData.items).filter('.obstacle')[0];
                            var item = template.cloneNode();
                            template.after(item);
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();
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
                            var template = $(localData.items).filter('.ladder')[0];
                            var item = template.cloneNode();
                            template.after(item);
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();
                            break;
                        case 5:
                            //obstacle + shell
                            var template = $(localData.items).filter('.obstacle')[0];
                            var item = template.cloneNode();
                            template.after(item);
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();

                            var item = $(localData.items).filter('.shell')[localData.shellCount];
                            $(item).attr("data-position", `${vertical},${index}`);
                            $(item).attr("data-hidden", true);
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();
                            var shell = $(localData.shells)[localData.shellCount];
                            $(shell).attr("data-collected", false)
                            $(shell).show();
                            localData.shellCount++;
                            break;
                        case 6:
                            //Spawn End Goals
                            var item = $(localData.items).filter('.goal')[0];
                            $(item).attr("src", `/assets/levels/chapter_${localData.chapterNumber + 1}/chapter_goal.png`)
                            item.style.transform = `translate(${index * localData.stepSizeHorizontal}px, ${((3 - vertical) + 1) * -localData.stepSizeVertical}px) scale(1)`;
                            $(item).show();
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