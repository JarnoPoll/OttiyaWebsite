/*
var counter = 1;

function SelectNewCodeBlock(codeBlockID)
{
    //The block you need to change has the following ID: TaskbarBlockOne
    //The color variable is the number of the block that it needs to be. For example CodeBlockOne

    var blok = null;

    switch(counter)
    {
        case 1:
            blok = document.getElementById("TaskbarBlockOne");
            break;
        case 2:
            blok = document.getElementById("TaskbarBlockTwo");
            break;
        case 3:
            blok = document.getElementById("TaskbarBlockThree");
            break;
        case 4:
            blok = document.getElementById("TaskbarBlockFour");
            break;
        case 5:
            blok = document.getElementById("TaskbarBlockFive");
            break;
        case 6:
            blok = document.getElementById("TaskbarBlockSix");
            break;
        case 7: 
        blok = document.getElementById("TaskbarBlockSeven");
            break;
        case 8:
            blok = document.getElementById("TaskbarBlockEight");
            break;
        case 9:
            blok = document.getElementById("TaskbarBlockNine");
            break;
    }

    //Set Color depending on the value of colorBlockID
    if (codeBlockID == 1)
    {
        blok.classList.add("CodeBlockOne");
    }
    else if(codeBlockID == 2)
    {
        blok.classList.add("CodeBlockTwo");
    }
    else if(codeBlockID == 3)
    {
        blok.classList.add("CodeBlockThree");
    }
    else if(codeBlockID == 4)
    {
        blok.classList.add("CodeBlockFour");
    }
    else if(codeBlockID == 5)
    {
        blok.classList.add("CodeBlockFive");
    }
    
    counter++;
}

function RemoveCodeBlock(TaskbarBlockID)
{

    var taskblok = document.getElementById (TaskbarBlockID);

    taskblok.setAttribute('class', 'CodeBlock');
}

*/

const codeBlocks = ["One","Two","Three", "Four", "Five"];

function CheckAssigned(classList)
{
    var tempBool = false;
    var tempClass;
    Array.from(classList).reverse().forEach(element => 
    {
        if(element.includes("CodeBlock_"))
        {
            var codeBlockId = element.replace("CodeBlock_", "");
            console.log(codeBlockId);
            if(codeBlocks.includes(codeBlockId))
            {
                tempClass = element;
                tempBool = true;
            }
        }
    });

    return [tempBool, tempClass];
}

function Test(test)
{
    test.outerHTML = "";
}

function TransferCodeBlockToTaskbar(element)
{ 
    element.setAttribute("onclick", "Test(this);");
    var tempElement = element.outerHTML.replace("button", "il");
   
    return tempElement
}