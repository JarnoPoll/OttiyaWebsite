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
        else if(scene == "level-overview")
        {
            if(chapterSlider.selected == null)
            {
                return;
            }

            var chapter = $(chapterSlider.selected).data("chapter");
            var holders = $(".levelHolder");
            console.log(holders);
            $(holders).hide();
            var levelHolder = $(".levelHolder[data-chapter='" + chapter + "']").first();
            $(levelHolder).show();

        }

        sceneManager.SwitchScene(scene);
    });

    $('.level-buttons').on("click", function()
    {
        if(levelSlider.selected != null)
        {
            var level = $(levelSlider.selected).data("level");
            var scene = $(this).data("scene");
            var itemData = sceneManager.LoadLevel(level);
            levelManager.ResetItems($("#item-holder img"));
            levelManager.SetItems(itemData);

            sceneManager.SwitchScene(scene);
        }
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
            case "category":
                console.log("Attempting to set category to: " + $(this).data("category"));
                levelManager.ChangeCategory($(this).data("category"));
                break;
            case "pause":
                var pauseWindow = document.getElementById("pause-window");
                levelManager.TogglePause();
                if($(pauseWindow).is(":visible"))
                {
                    $(pauseWindow).hide();
                }
                else
                {
                    $(pauseWindow).show();
                }
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
    sceneManager.LoadChapters(document.getElementsByClassName('chapter-template'), document.getElementsByClassName('levelTemplate'));    
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




class SliderData
{
    slider;
    isDown = false;
    moved = false;
    startX;
    scrollLeft;
    selected;
}

var levelSlider = new SliderData();
levelSlider.slider = document.querySelector('.levelHolder');

levelSlider.slider.addEventListener('mousedown', (e) => {
    levelSlider.isDown = true;
    levelSlider.startX = e.pageX - levelSlider.slider.offsetLeft;
    levelSlider.scrollLeft = levelSlider.slider.scrollLeft;
});
levelSlider.slider.addEventListener('mouseleave', () => {
    levelSlider.isDown = false;
    levelSlider.moved = false;
    levelSlider.slider.classList.remove('active');
});
levelSlider.slider.addEventListener('mouseup', () => {
    levelSlider.isDown = false;
if(!levelSlider.moved)
{
    var levelElement = $(document.querySelectorAll( ".levelTemplate:hover" ));
    if(levelElement.length != 0 && levelElement != levelSlider.selected)
    {
        if(levelSlider.selected != null)
        {
            levelSlider.selected[0].classList.remove('selected');
            levelSlider.selected = null;
        }
        else if(!$(levelElement).hasClass('locked'))
        {
            levelSlider.selected = levelElement;
            levelSlider.selected[0].classList.add('selected');
        }
    }
    
}
else
{
    levelSlider.moved = false;
}
levelSlider.slider.classList.remove('active');
});
levelSlider.slider.addEventListener('mousemove', (e) => {
if(!levelSlider.isDown) return;

e.preventDefault();
const x = e.pageX - levelSlider.slider.offsetLeft;
const walk = (x - levelSlider.startX) * 3; //scroll-fast
levelSlider.slider.scrollLeft = levelSlider.scrollLeft - walk;
if(!levelSlider.moved && Math.abs(walk) > 40)
{
    levelSlider.slider.classList.add('active');
    levelSlider.moved = true;
}
});


var chapterSlider = new SliderData();
chapterSlider.slider = document.querySelector('#chapter-holder');

chapterSlider.slider.addEventListener('mousedown', (e) => {
    chapterSlider.isDown = true;
    chapterSlider.startX = e.pageX - chapterSlider.slider.offsetLeft;
    chapterSlider.scrollLeft = chapterSlider.slider.scrollLeft;
});
chapterSlider.slider.addEventListener('mouseleave', () => {
    chapterSlider.isDown = false;
    chapterSlider.moved = false;
    chapterSlider.slider.classList.remove('active');
});
chapterSlider.slider.addEventListener('mouseup', () => {
    chapterSlider.isDown = false;
    if(!chapterSlider.moved)
    {
        var chapterElement = $(document.querySelectorAll( ".chapter-template:hover" ));
        if(chapterElement.length != 0 && chapterElement != chapterSlider.selected)
        {
            if(chapterSlider.selected != null)
            {
                var chapterName = $(chapterSlider.selected).attr("data-chapter");
                chapterSlider.selected[0].classList.remove('selected');
                chapterSlider.selected = null;
            }
            else if(!$(chapterElement).hasClass('locked'))
            {
                chapterSlider.selected = chapterElement;
                chapterSlider.selected[0].classList.add('selected');
                chapterName = $(chapterSlider.selected).attr("data-chapter");
            }
        }
        
    }
    else
    {
        chapterSlider.moved = false;
    }
    chapterSlider.slider.classList.remove('active');
});
chapterSlider.slider.addEventListener('mousemove', (e) => {
if(!chapterSlider.isDown) return;

e.preventDefault();
const x = e.pageX - chapterSlider.slider.offsetLeft;
const walk = (x - chapterSlider.startX) * 3; //scroll-fast
chapterSlider.slider.scrollLeft = chapterSlider.scrollLeft - walk;
if(!chapterSlider.moved && Math.abs(walk) > 40)
{
    chapterSlider.slider.classList.add('active');
    chapterSlider.moved = true;
}
console.log(walk);
});