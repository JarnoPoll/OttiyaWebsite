function SwitchArea(oldArea, newArea)
{
    var oldElement = document.getElementById(oldArea);
    oldElement.classList.add("hidden");

    var newElement = document.getElementById(newArea);;
    newElement.classList.remove("hidden");
}

var pressed = false;

function Reset(gridID, characterID)
{
    var grid = document.getElementById(gridID);
    var character = document.getElementById(characterID);

    grid.children[22].append(character);
    pressed = false;
}

function PressedPlay(taskbarID, gridID, characterID)
{
    if(pressed) 
        return;

    pressed = true;
    
    var location = 0;
    
    //Read TaskBar
    var taskbar = document.getElementById(taskbarID);

    for (let index = 0; index < taskbar.children.length; index++) {
        const element = taskbar.children[index];
        element.classList.forEach(className => {
                switch(className)
                {
                    case "CodeBlock_One":
                        location += 1;
                        break;
                    case "CodeBlock_Two":
                        location -= 10;
                        break;
                    case "CodeBlock_Three":
                        location += 10;
                        break;
                    case "CodeBlock_Four":
                        location -= 1;
                        break;
                    case "CodeBlock_Five":
                        location += 2;
                        break;
                }
            });
        }

    //Get all sections
    var grid = document.getElementById(gridID);
    var character = document.getElementById(characterID);
    
    for (let index = 0; index < grid.children.length; index++) {
        const element = grid.children[index];
        
        if(element == character.parentElement)
        {
            location += index
            break;
        }
    }

    //Move Character
    grid.children[location].append(character);

}



function changeColor(elementID, color)
{
    //Get element
    var blok = document.getElementById(elementID);
    //Get class of element.
    var currentColorClass = blok.classList;
    
    //Check if element has a color.
    /*
    if (currentColorClass == "red")
    {
        blok.classList.remove("red");
        if (color == "blue")
        {
            blok.classList.add("blue");
        }
        else (color == "red")
        {
            blok.classList.add("white");
        }
    }
    else if (currentColorClass == "blue")
    {
        blok.classList.remove("blue");
        if (color == "red")
        {
            blok.classList.add("red");
        }
        else (color == "blue")
        {
            blok.classList.add("white");
        }
    }
    else 
    {
        blok.classList.remove("white");

        if (color == "red")
        {
            blok.classList.add("red");
        }
        else
        {
            blok.classList.add("blue");
        }
    }
    */
    //If the color is the same as the color requested, turn white.
    //Else remove the color and add the new color.
}









function Test(elementID, color)
{
    var blok = document.getElementById(blok);
    var currentColorClass = blok.className;

    if(currentColorClass == "white")
    {
        blok.classList.remove("white");
        blok.classList.add(color);
    }
    else if(currentColorClass == color)
    {
        blok.classList.remove(color);
        blok.classList.add("white");
    }
    else
    {
        blok.classList.remove(currentColorClass);
        blok.classList.add(color);
    }
}