function SwitchArea(oldArea, newArea)
{
    var oldElement = document.getElementById(oldArea);
    oldElement.classList.add("hidden");

    var newElement = document.getElementById(newArea);;
    newElement.classList.remove("hidden");
}

var pressed = false;





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