import {SceneManager} from './general.js';
import {LevelManager} from './levelManager.js';

let sceneManager = new SceneManager("menu");
let levelManager = new LevelManager(document.getElementById("character"), $('.shell'), $('.category-blocks'),"movement");

$(document).ready(function() 
{
    $('#Taskbar').sortable(
        {
            'axis': 'x',
            items: "il:not(.placeholder-codeblock)"
        }).disableSelection();

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
                var blocks = $('#Taskbar il.action-button')
                levelManager.Reset(taskbar, blocks, character);
                break;
            case "codeblock":
                    //var duplicate = levelManager.TransferCodeBlockToTaskbar(this.cloneNode());
                    //$('#Taskbar').append(duplicate);
                break;
            case "category":
                console.log("Attempting to set category to: " + $(this).data("category"));
                levelManager.ChangeCategory($(this).data("category"));
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
        console.log("added");
        mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        mc.on("pan", handleDrag);
    }
    
});



var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;
var taskbarBlocks;
var taskbarPosition;
var placeholders;

function handleDrag(ev) {

    var elem = ev.target;
    
    console.log("Draggin");
    if ( ! isDragging ) {
        placeholders = $('#Taskbar il:visible:not(.action-button)');
        taskbarBlocks = $('#Taskbar il:visible');

        var closest;

        for (let index = 0; index < placeholders.length; index++)
        {
            const elementRect = placeholders[index].getBoundingClientRect();
            var dragRect = elem.getBoundingClientRect();
            var distance = Math.abs(elementRect.left - dragRect.left);
            if(index == 0)
            {
                closest = distance
                taskbarPosition = index;
            }
            else if(closest > distance)
            {
                taskbarPosition = index;
                closest = distance;
            }
        }
        
        placeholders[0].setAttribute("data-status", "enabled");
        isDragging = true;
    }
    
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;
    
    elem.style.left = posX + "px";
    elem.style.top = posY + "px";
    /*
        var closest;
        var lastPosition = taskbarPosition;
        var startingIndex = lastPosition - 1;
        var endingIndex = lastPosition + 2;

        if(lastPosition == 0)
        { 
            startingIndex = lastPosition;
        }
        else if(lastPosition == taskbarBlocks.length - 1)
        {
            endingIndex = lastPosition + 1;
        }

        for (let index = startingIndex; index < endingIndex; index++)
        {
            const elementRect = taskbarBlocks[index].getBoundingClientRect();
            var dragRect = elem.getBoundingClientRect();
            var distance = Math.abs(elementRect.left - dragRect.left);

            if(index == startingIndex)
            {
                taskbarPosition = index;
                closest = distance;
            }
            else if(closest > distance)
            {
                taskbarPosition = index;
                closest = distance;
            }
            
            console.log("Index: " + index + " Current Closest: " + closest + "Distance: " + distance);
        }
        
        if(lastPosition != taskbarPosition)
        {
            console.log("Should move!");
            if(lastPosition < taskbarPosition)
            {
                if ($(placeholders[0]).not(':last-child'))
                $(placeholders[0]).next().after($(taskbarBlocks[taskbarPosition]));
            }
            else
            {
                if ($(placeholders[0]).not(':first-child'))
                $(placeholders[0]).prev().before($(taskbarBlocks[taskbarPosition]));
            }
            

            
            //placeholders[0].parentNode.insertBefore(taskbarBlocks[taskbarPosition], placeholders[0].nextSibling);
            taskbarBlocks = $('#Taskbar il:visible');
        }
    */
    if (ev.isFinal) 
    {
        isDragging = false;
        elem.style.left = "0px";
        elem.style.top = "0px";
        console.log("Finished dragging!");
        
        placeholders[0].setAttribute("data-status", "disabled");
        var duplicate = elem.cloneNode();
        duplicate.style = "";
        placeholders[0].parentNode.insertBefore(duplicate, placeholders[0].nextSibling);
        $(placeholders[0]).hide();
    }
}