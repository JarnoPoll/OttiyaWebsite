export class SceneManager
{
    activeScene = "";

    constructor(startingScene)
    {
        this.activeScene = startingScene;
        $('.scene:not(#' + startingScene + ', #main)').hide();
    }

    SwitchScene(scene)
    {
        if(scene == this.activeScene)
        { 
            return;
        }

        $('#' + this.activeScene).hide();
        this.activeScene = scene;
        $('#' + this.activeScene).show();
    }

    LoadLevel(level)
    {
        console.log("Should prep level!");
    }
}
