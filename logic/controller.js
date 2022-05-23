import {SceneManager} from './general.js';
import {LevelManager} from './levelManager.js';

let sceneManager = new SceneManager("menu");
let levelManager = new LevelManager($('#player'));

$(document).ready(function() 
{
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
                    //var duplicate = levelManager.TransferCodeBlockToTaskbar(this.cloneNode());
                    //$('#Taskbar').append(duplicate);
                break;
        }
    });

    /*
    $('.CodeBlock').on("mousedown", function()
    {
        var element = this.cloneNode();
        $('#Taskbar').append(element);
        var mc = new Hammer(element);
        mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        mc.on("pan", handleDrag);
        console.log(this.deltaX);
        element.style.left = this.style.left;
        element.style.top  = this.style.top;
    });
    */
    
    var elements = document.getElementsByClassName("CodeBlock");

    for (let element of elements) 
    {
        var mc = new Hammer(element);
            
        mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        mc.on("pan", handleDrag);
    }
    
});



var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;
var placeholder;
var taskbarBlocks;

function handleDrag(ev) {

    var elem = ev.target;
    

    if ( ! isDragging ) {
        isDragging = true;
        console.log("Dragging!");
        placeholder = $('#placeholder-codeblock')
        placeholder.attr('data-status', 'enabled');
        taskbarBlocks = $('#Taskbar button');
    }
    
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;
    
    elem.style.left = posX + "px";
    elem.style.top = posY + "px";

    //Loop through list and find if is in between blocks
    if(posY > 40)
    {
        for (let index = 0; index < taskbarBlocks.length; index++) {
            const element = taskbarBlocks[index];
            console.log(index);
            
        }
    }
    
    if (ev.isFinal) 
    {
        isDragging = false;
        elem.style.left = "0px";
        elem.style.top = "0px";
        console.log("Finished dragging!");
        placeholder.attr('data-status', 'disabled');

        if(posY > 40 && posY < 150)
        {
            var duplicate = elem.cloneNode();
            var taskbar = $('#Taskbar');
            taskbar.append(duplicate);
            taskbar.append(placeholder);
        }
        //If valid location, spawn block.
    }
}