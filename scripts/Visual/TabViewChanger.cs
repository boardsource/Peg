using Godot;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Peg
{
    public class TabViewChanger : Control
    {
        List<TextureButton> layerButtons;
        [Export] public NodePath mainView;
        TabContainer mainViews;

        public override void _Ready()
        {
            if (this.mainView!=null)
            {
                this.mainViews = GetNode<TabContainer>(mainView);
            }
            else
            {
                GD.PrintErr("no main view selected");
            }
            layerButtons = this.GetChildren().OfType<TextureButton>().ToList();
            for (int index = 0; index < layerButtons.Count; index++)
            {
                 TextureButton button = layerButtons[index];
                 button.Connect("pressed", this, nameof(_on_layer_change_press), new Godot.Collections.Array { index });
            }
        }
        public void _on_layer_change_press(int selectedIndex)
        {

            layerButtons[selectedIndex].Pressed = true;
            mainViews.CurrentTab = selectedIndex;

            for (int index = 0; index < layerButtons.Count; index++)
            {
                if(index!= selectedIndex)
                {
                    TextureButton button = layerButtons[index];
                    button.Pressed = false;
                }
                
                
            }

        }


    }

}