import {SceneManager} from './general.js';

$(document).ready(function() 
{7
    let sceneManager = new SceneManager("menu");
    
    $('#Taskbar').sortable({
        'axis': 'x',
    });

    $('.CodeBlock').click( function ()
    {
        var duplicate = TransferCodeBlockToTaskbar(this.cloneNode());
        $('#Taskbar').append(duplicate);
    });

    $('.navigation-button').on("click", function()
    {
        var scene = $(this).data("scene");
        
        if(scene == "level")
        {
            sceneManager.LoadLevel($(this).data("level"));
        }

        sceneManager.SwitchScene(scene);
    });
});
