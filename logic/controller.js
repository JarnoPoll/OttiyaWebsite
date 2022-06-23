import {SceneManager} from './sceneManager.js';
import {LevelManager} from './levelManager.js';



$(document).ready(function() 
{
    let sceneManager = new SceneManager("menu");
    let levelManager = new LevelManager(document.getElementById("character"), $("#item-holder img"), $('.category-blocks'),"movement", $("#shells-counter .shellcounter"));
    var currentCategoryButton = $(`#Category img[data-category=movement]`);

    $('#Taskbar').sortable(
        {
            'axis': 'x',
            items: "il:not(.placeholder-codeblock)"
        }).disableSelection();

    currentCategoryButton[0].style.setProperty("transform", "scale(1.3)");

    
    $("#video")[0].addEventListener("ended", function()
    {
        sceneManager.SwitchScene("chapter-overview")
    });

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
            $(holders).hide();
            var levelHolder = $(".levelHolder[data-chapter='" + chapter + "']").first();
            $("#chapter-name")[0].innerHTML = `Chapter ${chapter}`;
            $(levelHolder).show();
            
            //levelSlider.slider = levelHolder;
            //console.log(levelSlider.slider);

        }

        sceneManager.SwitchScene(scene);
    });

    console.log(document.cookie);
    $('.level-buttons').on("click", function()
    {
        if(levelSlider.selected != null)
        {
            var chapter = $(levelSlider.selected).parent().data("chapter");
            var level = $(levelSlider.selected).data("level");
            var scene = $(this).data("scene");
            var itemData = sceneManager.LoadLevel(chapter, level);
            levelManager.ResetItems($("#item-holder img"));
            
            console.log(itemData);
            levelManager.SetItems(itemData, chapter, level);

            sceneManager.SwitchScene(scene);
        }
    });

    console.log(document.cookie);
    $('.action-button').on('click', function()
    {
        switch($(this).data("action"))
        {
            case "play":
                levelManager.PressedPlay($('#Taskbar'));
                break;
            case "reset":
                var taskbar = document.getElementById("Taskbar");
                var character = document.getElementById("character");
                var blocks = $('#Taskbar il.action-button')
                levelManager.Reset(taskbar, blocks, character);
                var resultWindow = document.getElementById("results-window");
                $(resultWindow).hide();

                break;
            case "category":
                console.log("Attempting to set category to: " + $(this).data("category"));
                if($(this).data("enabled"))
                {
                    console.log("category was true");
                    if(levelManager.ChangeCategory($(this).data("category")))
                    {
                        if(currentCategoryButton != null)
                        {
                            console.log("Scaling OLD: " + $(currentCategoryButton));
                            currentCategoryButton[0].style.setProperty("transform", "scale(1)");
                        }
                        
                        currentCategoryButton = $(this);
                        console.log($(this).parent());
                        switch($(this).data("category"))
                        {
                            case "movement":
                                $(this).parent()[0].style.setProperty("background-color", "#E7F7FD");
                                break;
                            case "appearance":
                                $(this).parent()[0].style.setProperty("background-color", "#F9EAFA");
                                break;
                            case "control":
                                $(this).parent()[0].style.setProperty("background-color", "#FFF3E6");
                                break;
                            
                        }
                        this.style.setProperty("transform", "scale(1.2)");
                    }
                }
                else
                {
                    console.log("category was false");
                }
                break;
            case "pause":
                var resultWindow = document.getElementById("results-window");

                levelManager.TogglePause();
                if($(resultWindow).is(":visible"))
                {
                    $(resultWindow).hide();
                }
                else
                {
                    $(resultWindow).show();
                }
                break;    
        }
    });

    console.log(document.cookie);
    var elements = document.getElementsByClassName("CodeBlock");

    for (let element of elements) 
    {
        var mc = new Hammer(element);
        mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        mc.add(new Hammer.Tap);
        mc.on("pan", handleDrag);
        mc.on("tap", handleTap);
    }
    
    sceneManager.LoadChapters(document.getElementsByClassName('chapter-template'), document.getElementsByClassName('levelTemplate'));    
});

function handleTap(ev)
{
    var elem = ev.target;

    placeholders = $('#Taskbar il:visible:not(.action-button)');
    if(placeholders.length == 0) return;

    placeholders[0].setAttribute("data-status", "disabled");
    isFlickering = false;
    var children = $(placeholders[0]).parent().children(".CodeBlock");
    var clone = $(elem).clone(true);
    if(children.length == 0)
    {
        $(placeholders[0]).parent().prepend(clone);
    }
    else
    {
        $(placeholders[0]).parent().children(".CodeBlock").last().after(clone);
    }
    var mc = new Hammer(clone[0]);
    mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
    mc.add(new Hammer.Press);
    mc.on("pan", handleTaskbarDrag);
    $(placeholders[0]).hide();
}

var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;
var taskbarBlocks;
var taskbarPosition;
var placeholders;
var isFlickering;

function handleDrag(ev) {
    var elem = ev.target;

    if ( ! isDragging ) {
        placeholders = $('#Taskbar il:visible:not(.action-button):not(.main-placeholder-codeblock)');

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

    if (ev.isFinal) 
    {
        isDragging = false;
        elem.style.left = "0px";
        elem.style.top = "0px";
        console.log("Finished dragging!");
        
        if(Math.abs(posX) < 20 && Math.abs(posY) < 20)
        {
            placeholders[0].setAttribute("data-status", "disabled");
            isFlickering = false;
            var children = $(placeholders[0]).parent().children(".CodeBlock");
            var clone = $(elem).clone(true);
            if(children.length == 0)
            {
                $(placeholders[0]).parent().prepend(clone);
            }
            else
            {
                $(placeholders[0]).parent().children(".CodeBlock").last().after(clone);
            }
            var mc = new Hammer(clone[0]);
            mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: -1 }) );
            mc.add(new Hammer.Press);
            mc.on("pan", handleTaskbarDrag);
            $(placeholders[0]).hide();
        }
        else if(posY > 40 && posY < 200)
        {
            placeholders[0].setAttribute("data-status", "disabled");
            isFlickering = false;
            var children = $(placeholders[0]).parent().children(".CodeBlock");
            var clone = $(elem).clone(true);
            if(children.length == 0)
            {
                $(placeholders[0]).parent().prepend(clone);
            }
            else
            {
                $(placeholders[0]).parent().children(".CodeBlock").last().after(clone);
            }
            var mc = new Hammer(clone[0]);
            mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
            mc.add(new Hammer.Press);
            mc.on("pan", handleTaskbarDrag);
            $(placeholders[0]).hide();
        }
    }
}

var startingIndex;

function handleTaskbarDrag(ev)
{
    var elem = ev.target;
    var trashcan = document.getElementById("trash-icon");
    var trashRect = trashcan.getBoundingClientRect();
    var distance = Math.abs(trashRect.left - elem.getBoundingClientRect().left);
    
    if(distance < 50)
    {
        //Trash open
        $(trashcan).attr("src","assets/miscellaneous/trashcan_open.png");
    }
    else if(distance < 80)
    {
        //Trash closed
        $(trashcan).attr("src","assets/miscellaneous/trashcan_closed.png");
    }

    if (ev.isFinal && distance < 50) 
    {
        elem.remove();
        placeholders = $('#Taskbar il:hidden:not(.action-button):not(.main-placeholder-codeblock)');
        $(placeholders.last()).show();
        $(trashcan).attr("src","assets/miscellaneous/trashcan_closed.png");
    }
    /*
    
    
    if ( ! isDragging ) {
        elem.style.visibility = "collapse";
        placeholders = $('#Taskbar il:visible:not(.action-button)');
        if(placeholders.length == 0)
            return;

        taskbarBlocks = $('#Taskbar il.action-button');

        var closest;

        for (let index = 0; index < taskbarBlocks.length; index++)
        {
            const elementRect = taskbarBlocks[index].getBoundingClientRect();
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
        console.log(taskbarBlocks[taskbarPosition]);
        startingIndex == taskbarPosition;
        isDragging = true;
    }
    
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;
    
    //elem.style.left = posX + "px";
    //elem.style.top = posY + "px";

    FindTaskbarLocation(ev);

    if (ev.isFinal) 
    {
        isDragging = false;
        //elem.style.left = "0px";
        //elem.style.top = "0px";
        console.log("Finished dragging!");
        elem.style.visibility = "visible";
        $(".main-placeholder-codeblock").hide();
    }

    function FindTaskbarLocation(ev)
    {
        console.log("RIP");
        var closest;
        var previous = taskbarPosition;

        for (let index = 0; index < taskbarBlocks.length; index++)
        {
            if(taskbarBlocks[index] == elem)
                continue;
            const elementRect = taskbarBlocks[index].getBoundingClientRect();
            var distance = Math.abs(elementRect.left - elem.getBoundingClientRect().left);

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

        if(taskbarPosition != previous)
        {
            console.log(taskbarPosition + " " + taskbarBlocks.length);
            if(taskbarPosition == taskbarBlocks.length - 2)
            {
                console.log("Last Call");
                //$(".main-placeholder-codeblock").show();
                //$(taskbarBlocks[taskbarPosition]).parent()[0].insertBefore($(".main-placeholder-codeblock")[0], $(taskbarBlocks[taskbarPosition]).parent().children[taskbarPosition + 1]);
            }
            else
            {
                console.log("Call");
                //$(".main-placeholder-codeblock").show();
                //$(taskbarBlocks[taskbarPosition]).parent()[0].insertBefore($(".main-placeholder-codeblock")[0], taskbarBlocks[taskbarPosition + 1]);
            }
        }
    }
    */
}


class SliderData
{
    holder;
    slider;
    isDown = false;
    moved = false;
    startX;
    scrollLeft;
    selected;
}

var levelSlider = new SliderData();

//levelSlider.slider = document.querySelector('.levelHolder');
levelSlider.holder = document.querySelector('.grid-levels');

levelSlider.holder.addEventListener('mousedown', (e) => 
{
    levelSlider.slider = $(levelSlider.holder).children(".levelHolder:visible")[0];
    levelSlider.isDown = true;
    levelSlider.startX = e.pageX - levelSlider.slider.offsetLeft;
    levelSlider.scrollLeft = levelSlider.slider.scrollLeft;
});

levelSlider.holder.addEventListener('mouseleave', () => 
{
    if(!levelSlider.slider) return;

    levelSlider.isDown = false;
    levelSlider.moved = false;
    levelSlider.slider.classList.remove('active');
});

levelSlider.holder.addEventListener('mouseup', () => 
{
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
                levelSlider.selected = levelElement;
                levelSlider.selected[0].classList.add('selected');
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

levelSlider.holder.addEventListener('mousemove', (e) => 
{
    if(!levelSlider.isDown) return;
    console.log("Logging");
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
                chapterSlider.selected = chapterElement;
                chapterSlider.selected[0].classList.add('selected');
                chapterName = $(chapterSlider.selected).attr("data-chapter");
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