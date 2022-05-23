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

    LoadLevel(level)
    {
        fetch(`./assets/levels/difficulty_${1}/level_${level}/dataFile.json`).then(response => { return response.json(); }).then( data =>
        {
            var categoriesRaw = "";
            
            for (let index = 0; index < data.allowedblocks.length; index++) {
                const element = data.allowedblocks[index];
                categoriesRaw += (element.name + ",");
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
        });
    }

    

    SwitchCategory(category)
    {
    }
}
