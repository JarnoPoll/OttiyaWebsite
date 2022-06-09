class CookieData
{
    chapterCompletion = [];
    levelCompletion = [];
    starCompletion = [];
}
export class SceneManager
{
    activeScene = "";
    completionData;
    constructor(startingScene)
    {
        this.activeScene = startingScene;
        $('.scene:not(#' + startingScene + ', #main)').hide();
    }

    SwitchScene(scene)
    {
        if(scene == this.activeScene)
        { 
            return;
        }

        $('#' + this.activeScene).hide();
        this.activeScene = scene;
        switch(this.activeScene)
        {
            case "level":
                $('#loading-screen').show();
                this.WaitForLevel(0).then(() => //Should be 3000
                {
                    $('#' + this.activeScene).show();
                    $('#loading-screen').hide();
                });
                break;
            case "level-overview":
                //Update levels and chapters and show scene
                this.UpdateLevels();
                $('#' + this.activeScene).show();
                break;
            default:
                $('#' + this.activeScene).show();
                break;
        }
    }


    UpdateLevels()
    {
        this.completionData = JSON.parse(this.GetCookie("completionData"));
        console.log(this.completionData);

        /*
        for (let index = 0; index < completionData.chapterCompletion.length; index++) {
            const chapterCompletion = completionData.chapterCompletion[index];
            
            if(chapterCompletion)
            {
                $(".chapter-template")[index]
            }
        }
        */
       
        //Chapter Locking
        //clone.attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_locked.png`);
        //clone[0].classList.add('locked');


        var levelHolders = $(".levelHolder");
        console.log(levelHolders);
        for (let chapter = 0; chapter < levelHolders.length; chapter++) {
            const levelHolder = levelHolders[chapter];
            var levels = $(levelHolder).children();
            console.log(levels);
            for (let index = 0; index < levels.length; index++) {
                const level = levels[index];
                $(level)[0].classList.remove('locked');
                if(this.completionData.levelCompletion[chapter][index])
                {
                    $(level).find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_completed.png`);
                    $(level).find('.levelTemplate-shell').attr("src", `../assets/levels/Level_Shell_Color.png`);
                    //Set max amount of stars.
                }
                else if(index != 0 && !this.completionData.levelCompletion[chapter][index - 1])
                {
                    $(level).find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_locked.png`);
                    $(level).find('.levelTemplate-shell').attr("src", `../assets/levels/Level_Shell_Gray.png`);
                    $(level)[0].classList.add('locked');
                }
                else
                {
                    //Set amount of stars equal to completion.
                    $(level).find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_unlocked.png`);
                    var shells = $(level).find('.levelTemplate-shell');
                    for (let j = 0; j < shells.length; j++) {
                        const shell = shells[j];
                        
                        if((this.completionData.starCompletion[chapter][index] - 1) >= j)
                        {
                            $(shell).attr("src", `../assets/levels/Level_Shell_Color.png`);
                        }
                        else
                        {
                            
                            $(shell).attr("src", `../assets/levels/Level_Shell_Gray.png`);
                        }
                    }
                    
                }
            }
        }
        //Level Locking
        //clone.find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_locked.png`);
        //clone.find('.levelTemplate-shell').attr("src", `../assets/levels/Level_Shell_Gray.png`);
        //clone[0].classList.add('locked');
    }

    WaitForLevel(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));  
    }

    SetAvailableBlocksInCategory(category, blocks)
    {
        $(`${category}-blocks button`).each(function()
        {
            var element = $(this);
            if(blocks.includes(element.attr("data-function")))
                {
                    element.show();
                }
                else
                {
                    element.hide();
                }
        });
    }

    LoadChapters(chapterTemplate, levelTemplate)
    {   
        return fetch(`./assets/levels/chapterData.json`).then(response => { return response.json(); }).then( data =>
            {
                var categoriesRaw = "";
                var completionDataRaw = this.GetCookie("completionData");
                var completionData;
                if(completionDataRaw == "")
                {
                    console.log("Data is null");
                    completionData = new CookieData();
                    completionData.chapterCompletion = [];
                    for (let index = 0; index < data.chapters.length; index++) 
                    {
                        const chapter = data.chapters[index];
                        var levelArray = [];
                        var starArray = [];
                        for (let i = 0; i < chapter.levels.length; i++)
                        {
                            levelArray.push(false);
                            starArray.push(0);
                        }

                        completionData.chapterCompletion.push(false);
                        completionData.levelCompletion.push(levelArray);
                        completionData.starCompletion.push(starArray);
                    }

                    document.cookie = "completionData=" + JSON.stringify(completionData);
                }
                else
                {
                    completionData = JSON.parse(completionDataRaw);

                    document.cookie = "completionData=" + JSON.stringify(completionData);
                }

                for (let index = 0; index < data.chapters.length; index++) {
                    const chapter = data.chapters[index];

                    //Create instance for each chapter.
                    if(index != 0)
                    {
                        var clone = $(chapterTemplate).first().clone(true);
                        if(completionData.chapterCompletion[index])
                        {
                            clone.attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_completed.png`);
                        }
                        else if(completionData.chapterCompletion[index - 1])
                        {
                            clone.attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_unlocked.png`);
                        }
                        else
                        {
                            clone.attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_locked.png`);
                            clone[0].classList.add('locked');
                        }
                       
                        clone.attr("data-chapter", (index + 1));
                        $(chapterTemplate).last().after(clone);
                    }
                    else
                    {
                        $(chapterTemplate).attr("data-chapter", (index + 1));
                        if(completionData.chapterCompletion[index])
                        {
                            $(chapterTemplate).attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_completed.png`);
                        }
                        else
                        {
                            $(chapterTemplate).attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_unlocked.png`);
                        }
                        
                    }

                    //check completed status using cookies.
                    //Create instance for each level.
                    var levelHolder = $(".levelHolder").last();

                    if(index == 0)
                    {
                        levelHolder.attr("data-chapter", (index + 1));
                    }
                    else
                    {
                        var clone = levelHolder[0].cloneNode();
                        $(clone).attr("data-chapter", (index + 1));
                        $(levelHolder).last().after(clone);
                        levelHolder = $(".levelHolder").last();
                    }

                    for (let i = 0; i < chapter.levels.length; i++) 
                    {
                        
                        const level = chapter.levels[i];
                        var clone = $(levelTemplate).first().clone(true);
                        var shells = clone.find('.levelTemplate-shell');
                        for (let j = 0; j < shells.length; j++) 
                        {
                            const shell = shells[j];
                            if((level.starAmount) > j)
                            {
                                $(shell).show();

                                if((completionData.starCompletion[index][i] - 1) >= j)
                                {
                                    $(shell).attr("src", `../assets/levels/Level_Shell_Color.png`);
                                }
                                else
                                {
                                    
                                    $(shell).attr("src", `../assets/levels/Level_Shell_Gray.png`);
                                }
                            }
                            else
                            {
                                console.log("Hiding stars");
                                $(shell).hide();
                            }
                        }

                        if(completionData.levelCompletion[index][i])
                        {
                            clone.find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_completed.png`);
                            clone.find('.levelTemplate-shell').attr("src", `../assets/levels/Level_Shell_Color.png`);
                            //Set max amount of stars.
                        }
                        else if(i != 0 && !completionData.levelCompletion[index][i - 1])
                        {
                            clone.find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_locked.png`);
                            clone.find('.levelTemplate-shell').attr("src", `../assets/levels/Level_Shell_Gray.png`);
                            clone[0].classList.add('locked');
                        }
                        else
                        {
                            //Set amount of stars equal to completion.
                            clone.find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_unlocked.png`);
                            var shells = clone.find('.levelTemplate-shell');
                            for (let j = 0; j < shells.length; j++) {
                                const shell = shells[j];
                                
                                if((completionData.starCompletion[index][i] - 1) >= j)
                                {
                                    $(shell).attr("src", `../assets/levels/Level_Shell_Color.png`);
                                }
                                else
                                {
                                    
                                    $(shell).attr("src", `../assets/levels/Level_Shell_Gray.png`);
                                }
                            }
                            
                        }
                        //clone.find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_unlocked.png`);
                        clone.find('p:last').text(i + 1);
                        clone.attr("data-level", i + 1);
                        levelHolder.append(clone);
                    }

                    $(levelHolder).hide();
                }

                $(levelTemplate).first().remove();
            });
    }

    LoadLevel(chapter, level)
    {
        return fetch(`./assets/levels/chapter_${chapter}/level_${level}/dataFile.json`).then(response => { return response.json(); }).then( data =>
        {
            var itemLocations = [];
            var categoriesRaw = "";

            for (let index = 0; index < data.allowedblocks.length; index++) {
                const element = data.allowedblocks[index];
                categoriesRaw += (element.name + ",");
            }

            for (let y = 0; y < data.itemsVertical.length; y++) {
                const vertical = data.itemsVertical[y];

                var tempArray = [];
                for (let x = 0; x < vertical.itemsHorizontal.length; x++) {
                    const horizontal = vertical.itemsHorizontal[x]
                    
                    tempArray.push(horizontal);
                }
                itemLocations.push(tempArray)
            }
            
            var categories = categoriesRaw.split(',');

            $(".Category").each(function()
            {
                var category = $(this);
                var tempCatagoryString = category.attr("data-category");
                if(categories.includes(tempCatagoryString))
                {
                    //Enable Category
                    $(category).attr("src", `../assets/blocks/${tempCatagoryString}/block_${tempCatagoryString}_category_unlocked.png`);
                    category.attr("data-enabled", "true");
                    //Enable block for Z Category
                    var blocksRaw = "";

                    data.allowedblocks[categories.indexOf(tempCatagoryString)].blocks.forEach(category => {
                        blocksRaw += (category.function + ',');
                    });

                    var blocks = blocksRaw.split(',');
                    console.log();
                    $(`.category-blocks[data-category='${tempCatagoryString}'] il`).each(function()
                    {
                        var block = $(this);
                        if(blocks.includes(block.attr("data-function")))
                        {
                            block.show();
                        }
                        else
                        {
                            block.hide();
                        }
                    });
                }
                else
                {
                    //disable category
                    $(category).attr("src", `../assets/blocks/${tempCatagoryString}/block_${tempCatagoryString}_category_locked.png`);
                }
            });

            if(data.characterFacing == "right")
            {
                return  [itemLocations, 1];
            }
            else
            {
                return  [itemLocations, -1];
            }
        });
    }

    GetCookie(cname) {
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
