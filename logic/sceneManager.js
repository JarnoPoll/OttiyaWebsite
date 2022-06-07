export class SceneManager
{
    activeScene = "";

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

                for (let index = 0; index < data.chapters.length; index++) {
                    const chapter = data.chapters[index];

                    //Create instance for each chapter.
                    if(index != 0)
                    {
                        var clone = $(chapterTemplate).first().clone(true);
                        clone.attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_unlocked.png`);
                        $(chapterTemplate).after(clone);
                    }
                    else
                    {
                        $(chapterTemplate).attr("src", `../assets/levels/chapter_${chapter.name}/chapter_backgrounds/chapter_unlocked.png`);
                    }

                    //check completed status using cookies.
                    for (let i = 0; i < chapter.levels.length; i++) {
                        const level = chapter.levels[i];
                        
                        if(i != 0)
                        {
                            console.log("ONCE");
                            var clone = $(levelTemplate).first().clone(true);
                            clone.find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_unlocked.png`);
                            clone.find('p:last').text(i + 1);
                            clone.attr("data-level", i + 1);
                            $(levelTemplate).last().after(clone);
                            
                        }
                        else
                        {
                            $(levelTemplate).find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_unlocked.png`);
                            $(levelTemplate).find('p:last').text(i + 1);
                            $(levelTemplate).attr("data-level", i + 1);
                        }
                    }
                }

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
}
