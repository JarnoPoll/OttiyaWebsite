class Level
{
    number = 0;

    constructor()
    {
        this.number = 10;
    }

    ShowNumber()
    {
        console.log(this.number);
    }
}

var basePath = "./assets/levels/";

function LoadLevel()
{
    fetch(CreatePath(1,1)).then(response => { return response.json(); })
    .then(jsondata => 
        console.log(jsondata.Time)
        //Use gathered data.
        );
}

function CreatePath(difficulty, level)
{
    return basePath + `difficulty_${difficulty}/level_${level}/dataFile.json`;
}