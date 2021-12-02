using Godot;
using System;

namespace Peg
{
    public class SingleUableKey : Button
    {
        public KeyCode code;
        MapManager mapManager;
        ToolTip toolTip;

        // Declare member variables here. Examples:
        // private int a = 2;
        // private string b = "text";

        // Called when the node enters the scene tree for the first time.
        public override void _Ready()
        {
            mapManager = GetNode<MapManager>("/root/MapManager");
            toolTip = GetNode<ToolTip>("/root/main/ToolTip");


        }

        //  // Called every frame. 'delta' is the elapsed time since the previous frame.
        //  public override void _Process(float delta)
        //  {
        //      
        //  }
        private void _on_SingleUseableKey_pressed()
        {
            if (code != null)
            {
                mapManager.NoticeToUpdateKey(code.NewKeyCode());
            }
            else
            {
                GD.Print("missing");
            }
            
        }
        public void _on_SingleUseableKey_mouse_entered()
        {
            if (toolTip != null)
            {
                toolTip.ShowToolTip(code.Code, code.Description);
            }
            else
            {
                GD.Print("cant find the toool tip");
            }

        }
        public void _on_SingleUseableKey_mouse_exited()
        {
            if (toolTip != null)
            {
                toolTip.HideToolTip();
            }
        }
    }
}