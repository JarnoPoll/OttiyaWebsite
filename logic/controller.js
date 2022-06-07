import {SceneManager} from './sceneManager.js';
import {LevelManager} from './levelManager.js';



$(document).ready(function() 
{
    let sceneManager = new SceneManager("menu");
    let levelManager = new LevelManager(document.getElementById("character"), $("#item-holder img"), $('.category-blocks'),"movement", $("#shells-counter .shellcounter"));

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
            var itemData = sceneManager.LoadLevel($(this).data('level'));
            levelManager.ResetItems($("#item-holder img"));
            levelManager.SetItems(itemData);
        }

        sceneManager.SwitchScene(scene);
    });

    $('.level-buttons').on("click", function()
    {
        if(selectedLevel != null)
        {
            var level = $(selectedLevel).data("level");

            var itemData = sceneManager.LoadLevel(level);
            levelManager.ResetItems($("#item-holder img"));
            levelManager.SetItems(itemData);

            sceneManager.SwitchScene("level");
        }
        /*
        if(scene == "level")
        {
            console.log(+$(this).data('level'));
            var itemData = sceneManager.LoadLevel($(this).data('level'));
            levelManager.ResetItems($("#item-holder img"));
            levelManager.SetItems(itemData);
        }
        sceneManager.SwitchScene(scene);
        
        */
    });

    $('.action-button').on('click', function()
    {
        switch($(this).data("action"))
        {
            case "play":
                levelManager.PressedPlay($('#Taskbar'));
                console.log(document.cookie);
                break;
            case "reset":
                var taskbar = document.getElementById("Taskbar");
                var character = document.getElementById("character");
                var blocks = $('#Taskbar il.action-button')
                levelManager.Reset(taskbar, blocks, character);
                break;
            case "level":
                    //var duplicate = levelManager.TransferCodeBlockToTaskbar(this.cloneNode());
                    //$('#Taskbar').append(duplicate);
                    console.log("Hello");
                    if(selectedLevel != null)
                    {
                        var level = $(selectedLevel).data("level");
            
                        var itemData = sceneManager.LoadLevel(level);
                        levelManager.ResetItems($("#item-holder img"));
                        levelManager.SetItems(itemData);
            
                        sceneManager.SwitchScene(level);
                    }
                break;
            case "category":
                console.log("Attempting to set category to: " + $(this).data("category"));
                levelManager.ChangeCategory($(this).data("category"));
                break;
        }
    });

    var elements = document.getElementsByClassName("CodeBlock");

    for (let element of elements) 
    {
        var mc = new Hammer(element);
        console.log("added");
        mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        mc.add(new Hammer.Press);
        mc.on("pan", handleDrag);
        mc.on("press", handlePressed);
    }
    sceneManager.LoadChapters(document.getElementsByClassName('chapterTemplate'), document.getElementsByClassName('levelTemplate'));    
});



var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;
var taskbarBlocks;
var taskbarPosition;
var placeholders;
var isFlickering;

function handlePressed(ev)
{
    var duplicate = ev.target.cloneNode(true);
    duplicate.style = "";
    var placeholders = $('#Taskbar il:visible:not(.action-button)');
    placeholders[0].parentNode.insertBefore(duplicate, placeholders[0].nextSibling);
    $(placeholders[0]).hide();
}

function handleDrag(ev) {
    var elem = ev.target;
    
    if ( ! isDragging ) {
        placeholders = $('#Taskbar il:visible:not(.action-button)');

        if(placeholders.length == 0)
            return;
        taskbarBlocks = $('#Taskbar il.action-button');

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
        isFlickering = true;
        isDragging = true;
    }
    
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;
    
    elem.style.left = posX + "px";
    elem.style.top = posY + "px";

    if(posY > 40 && posY < 200)
    {
        if(!isFlickering)
        {
            placeholders[0].setAttribute("data-status", "enabled");
            isFlickering = true;
        }
    }
    else if(isFlickering)
    {
        placeholders[0].setAttribute("data-status", "disabled");
        isFlickering = false;
    }
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
            
            //console.log("Index: " + index + " Current Closest: " + closest + "Distance: " + distance);
        }
        
        if(lastPosition != taskbarPosition)
        {
        
            
            if(lastPosition < taskbarPosition)
            {
                console.log("Move RIGHT");
                if ($(placeholders[0]).not(':last-child'))
                $(placeholders[0]).next().after($(taskbarBlocks[taskbarPosition]));
            }
            else
            {
                console.log("Move LEFT");
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
        
        if(posY > 40 && posY < 200)
        {
            placeholders[0].setAttribute("data-status", "disabled");
            isFlickering = false;
            var duplicate = elem.cloneNode(true);
            duplicate.style = "";
            placeholders[0].parentNode.insertBefore(duplicate, placeholders[0].nextSibling);
            $(placeholders[0]).hide();
        }
    }
}

const slider = document.querySelector('.levelHolder');
var isDown = false;
var moved = false;
var startX;
var scrollLeft;
var selectedLevel;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  moved = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  if(!moved)
  {
    var levelElement = $(document.querySelectorAll( ".levelTemplate:hover" ));
    if(levelElement != null && levelElement != selectedLevel)
    {
        $(selectedLevel).find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_unlocked.png`);
        selectedLevel = levelElement;
        $(levelElement).find('img:last').attr("src", `../assets/miscellaneous/level_overview/level_selected.png`);
    }
    
  }
  else
  {
    moved = false;
  }
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
  if(!moved && Math.abs(walk) > 40)
  {
    slider.classList.add('active');
    moved = true;
  }
  console.log(walk);
});