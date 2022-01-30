using Godot;
using System;

namespace Peg
{
    public abstract class SingleLayoutKey : Panel
    {
        int layer = 0;
        int index = 0;
        KeyCode currentKeyCode;
        LayoutKey currentLayoutKey;
        MapManager mapManager;
        Button mainButton;
        Button clearButton;
        Label subButtonText;
        Keymap keymap;
        KeyCodes codes;
        ToolTip toolTip;
        public bool ledAdjust = false;



        // Declare member variables here. Examples:
        // private int a = 2;
        // private string b = "text";

        // Called when the node enters the scene tree for the first time.
        public override void _Ready()
        {
            mapManager = GetNode<MapManager>("/root/Main/mainViews/keyboardEditView/MapManager");
            toolTip = GetNode<ToolTip>("/root/Main/mainViews/keyboardEditView/ToolTip");
            mapManager.Connect("ReleaceLastKey", this, nameof(_on_MapManager_ReleaceLastKey));

        }

        public void Setup(LayoutKey layoutKey, KeyCode keycode, int index,int layer,bool ledAdjust)
        {
            this.layer = layer;
            this.index = index;
            this.currentKeyCode = keycode;
            this.currentLayoutKey = layoutKey;
            this.SetPosition(new Vector2(layoutKey.X*52, layoutKey.Y*52));
            this.RectSize = new Vector2(layoutKey.W * 50,layoutKey.H==0?50:layoutKey.H*50);
            this.ledAdjust = ledAdjust;
            if (subButtonText == null)
            {
                subButtonText = GetNode<Label>("SubButtonText");
            }
            if (clearButton == null)
            {
                clearButton = GetNode<Button>("ClearButton");
            }
            if (mainButton == null)
            {
                mainButton = GetNode<Button>("MainButton");
            }
            if (subButtonText != null)
            {
                subButtonText.Hide();
            }
            if (clearButton != null)
            {
                clearButton.Hide();
            }
            this.setText();


        }
        public void Update(KeyCode keycode)
        {
            this.currentKeyCode = keycode;
            this.setText();


        }
        void setText()
        {
            if (currentKeyCode.CanHaveSub)
            { 
                HandleSubKey();
            }
            else
            {
                if (subButtonText != null)
                {
                    subButtonText.Hide();
                }
                if (clearButton != null)
                {
                    clearButton.Hide();
                }
                if (mainButton != null)
                {
                    if (currentKeyCode.Display == "")
                    {
                        mainButton.Text = currentKeyCode.Code;
                    }
                    else
                    {
                        mainButton.Text = currentKeyCode.Display;
                    }
                }
            }
        }
        void HandleSubKey()
        {
            GD.Print("I need other shit");
            subButtonText.Show();
            clearButton.Show();
            subButtonText.Text = currentKeyCode.Code;
            if (currentKeyCode.SubOne != null)
            {
                if (mainButton != null)
                {
                    if (currentKeyCode.SubOne.Display == "")
                    {
                        mainButton.Text = currentKeyCode.SubOne.Code;
                    }
                    else
                    {
                        mainButton.Text = currentKeyCode.SubOne.Display;
                    }
                }

            }

        }

        void clearPress()
        {
            mainButton.Pressed = false;
        }



        //  // Called every frame. 'delta' is the elapsed time since the previous frame.
        //  public override void _Process(float delta)
        //  {
        //      
        //  }
        public void _on_MainButton_pressed() {
            mapManager.NoticeThatKeyIsWaiting(index, layer,ledAdjust);
        }
        public void _on_MapManager_ReleaceLastKey(int index,int layer)
        {
            if (this.index == index && this.layer == layer)
            {
                GD.Print("Im out");
                clearPress();
            }
          
        }
        public void _on_ClearButton_pressed() {
            if (this.keymap == null)
            {
                this.keymap = Keymap.Instance();
            }
            if (this.codes == null)
            {
                this.codes = KeyCodes.Instance();

            }
            keymap.ChangeKey(this.layer, this.index, codes.BaseKeyCodeForString("KC.NO"));


        }
        public void _on_SingleLayoutKey_mouse_entered()
        {
            if (toolTip != null)
            {
                toolTip.ShowToolTip(currentKeyCode.Code, currentKeyCode.Description);
            }
            else
            {
                GD.Print("cant find the toool tip");
            }
        }
        public void _on_SingleLayoutKey_mouse_exited()
        {
            if (toolTip != null)
            {
                toolTip.HideToolTip();
            }
        }
    }
}
