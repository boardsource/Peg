using Godot;
using System;

namespace Peg
{
    public class AppSettings : Panel
    {
        // Declare member variables here. Examples:
        // private int a = 2;
        // private string b = "text";

        // Called when the node enters the scene tree for the first time.
        ProgramSettings programSettings;
        CheckButton sevenCheck;
        CheckButton toolTipCheck;
        public override void _Ready()
        {
            programSettings = ProgramSettings.Instance();
            sevenCheck = GetNode<CheckButton>("seven");
            toolTipCheck = GetNode<CheckButton>("toolTip");

            if (toolTipCheck != null)
            {
                toolTipCheck.Pressed = programSettings.tooltips;
            }

            if (sevenCheck != null)
            {
                sevenCheck.Pressed = programSettings.seven;
            }

        }

        //  // Called every frame. 'delta' is the elapsed time since the previous frame.
        //  public override void _Process(float delta)
        //  {
        //      
        //  }
        public void _on_seven_toggled(bool pressed)
        {
            programSettings.seven = pressed;
        }
        public void _on_toolTip_toggled(bool pressed)
        {
            programSettings.tooltips = pressed;
        }

    }

}