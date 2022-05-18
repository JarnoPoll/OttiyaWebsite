import {SceneManager} from './general.js';
import {LevelManager} from './levelManager.js';

$(document).ready(function() 
{
    let sceneManager = new SceneManager("menu");
    let levelManager = new LevelManager($('#player'));

    $('#Taskbar').sortable(
    {
        'axis': 'x',
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

    $('.action-button').on('click', function()
    {
        switch($(this).data("action"))
        {
            case "play":
                levelManager.PressedPlay('Taskbar', 'grid-container', 'character'); //NIET HIER KIJKEN!
                break;
            case "reset":
                //Thou shall need to grab thee taskbar and givith to reset as a object of variety.
                var taskbar = document.getElementById("Taskbar");
                var character = document.getElementById("character");
                levelManager.Reset(taskbar, character);
                break;
            case "codeblock":
                    var duplicate = levelManager.TransferCodeBlockToTaskbar(this.cloneNode());
                    $('#Taskbar').append(duplicate);
                break;
        }
    });
});
