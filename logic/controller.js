import {SceneManager} from './general.js';
import {LevelManager} from './levelManager.js';

let sceneManager = new SceneManager("menu");
let levelManager = new LevelManager(document.getElementById("character"), $('.shell'));

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
            console.log(+$(this).data('level'));
            sceneManager.LoadLevel($(this).data('level'));
        }

        sceneManager.SwitchScene(scene);
    });

    $('.action-button').on('click', function()
    {
        switch($(this).data("action"))
        {
            case "play":
                levelManager.PressedPlay('Taskbar', 'grid-container', 'character');
                break;
            case "reset":
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
var taskbarBlocks;
var placeholders;
var placeholderPosition = 0;

function handleDrag(ev) {

    var elem = ev.target;
    

    if ( ! isDragging ) {
        placeholders = $('#Taskbar il:visible');
        console.log(placeholders.length);
        var closest;
        for (let index = 0; index < placeholders.length; index++)
        {
            const elementRect = placeholders[index].getBoundingClientRect();
            var dragRect = elem.getBoundingClientRect();
            var distance = Math.abs(elementRect.left - dragRect.left);
            if(index == 0)
            {
                closest = distance
            }
            else if(closest > distance)
            {
                placeholderPosition = index;
                closest = distance;
            }
        }
        
        placeholders[placeholderPosition].setAttribute("data-status", "enabled");
        isDragging = true;
    }
    
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;
    
    elem.style.left = posX + "px";
    elem.style.top = posY + "px";

    //Loop through list and find if is in between blocks

    if(posY > 40)
    {   
        var closest;
        var lastPosition = placeholderPosition;
        var customizer = 1;
        var startingIndex = lastPosition - 1;
        var endingIndex = lastPosition + 2;

        if(lastPosition == 0)
        { 
            startingIndex = lastPosition;
        }
        else if(lastPosition == placeholders.length - 1)
        {
            endingIndex = lastPosition + 1;
        }

        for (let index = startingIndex; index < endingIndex; index++)
        {
            const elementRect = placeholders[index].getBoundingClientRect();
            var dragRect = elem.getBoundingClientRect();
            var distance = Math.abs(elementRect.left - dragRect.left);

            if(index == startingIndex)
            {
                closest = distance;
                placeholderPosition = index;
            }
            else if(closest > distance)
            {
                placeholderPosition = index;
                closest = distance;
            }
        }

        if(lastPosition != placeholderPosition)
        {
            placeholders[placeholderPosition].setAttribute("data-status", "enabled");
            placeholders[lastPosition].setAttribute("data-status", "disabled");
        }
    }

    if (ev.isFinal) 
    {
        isDragging = false;
        elem.style.left = "0px";
        elem.style.top = "0px";
        console.log("Finished dragging!");
        
        placeholders[placeholderPosition].setAttribute("data-status", "disabled");
        var duplicate = elem.cloneNode();
        // duplicate.insertBefore(placeholders[placeholderPosition]);
        placeholders[placeholderPosition].parentNode.insertBefore(duplicate, placeholders[placeholderPosition].nextSibling);
        $(placeholders[placeholderPosition]).hide();
        if(posY > 40 && posY < 150)
        {
            
            var taskbar = $('#Taskbar');
            //taskbar.append(duplicate);
            //taskbar.append(placeholder);
        }
        //If valid location, spawn block.
    }
}