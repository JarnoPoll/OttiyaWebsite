class CookieData
{
    chapterCompletion = [];
    levelCompletion = [];
    starCompletion = [];
}
export class SceneManager
{
    activeScene = "";
    cookieData = new CookieData();
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
        $('#' + this.activeScene).show();
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
                    console.log(completionData);
                }
                else
                {
                    completionData = JSON.parse(completionDataRaw);


                    //THIS IS TESTING
                    console.log(completionData);
                    completionData.starCompletion[0][0] = 3;
                    completionData.starCompletion[0][1] = 1;
                    completionData.levelCompletion[0][0] = true;
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

                    for (let i = 0; i < chapter.levels.length; i++) {
                        const level = chapter.levels[i];
                        
                        console.log("Calling");
                        var clone = $(levelTemplate).first().clone(true);
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
                        clone.attr("data-level", index + 1);
                        levelHolder.append(clone);
                    }

                    $(levelHolder).hide();
                }

                $(levelTemplate).first().hide();
            });
    }

    LoadLevel(level)
    {
        return fetch(`./assets/levels/chapter_${1}/level_${level}/dataFile.json`).then(response => { return response.json(); }).then( data =>
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
                var element = $(this);
                var tempCatagoryString = element.attr("data-category");
                if(categories.includes(tempCatagoryString))
                {
                    element.show();
                    var blocksRaw = "";

                    data.allowedblocks[categories.indexOf(tempCatagoryString)].blocks.forEach(element => {
                        blocksRaw += (element.function + ',');
                    });

                    var blocks = blocksRaw.split(',');
                    
                    $(`#${tempCatagoryString}-blocks button`).each(function()
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
                else
                {
                    element.hide();
                }
            });
            return  itemLocations;
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
