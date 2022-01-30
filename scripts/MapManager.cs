using Godot;
using System;

namespace Peg
{
    public class MapManager : Node
    {
        bool waitingKey = false;
        int waitingLayer = 0;
        int waitingIndex = 0;
        bool led = false;
        Keymap keymap;
        [Signal]
        public delegate void ReleaceLastKey(int index, int layer);

        // Declare member variables here. Examples:
        // private int a = 2;
        // private string b = "text";

        // Called when the node enters the scene tree for the first time.
        public override void _Ready()
        {
            this.keymap = Keymap.Instance();



   


        }
        public void NoticeThatKeyIsWaiting(int index,int layer,bool led)
        {
            EmitSignal(nameof(ReleaceLastKey),waitingIndex,waitingLayer);
            waitingIndex = index;
            waitingLayer = layer;
            waitingKey = true;
            this.led = led;
            GD.Print("waiting"); 

        }
        public void NoticeToUpdateKey(KeyCode keyCode) {
            if (this.waitingKey)
            {
                if (!led)
                {
                    EmitSignal(nameof(ReleaceLastKey), waitingIndex, waitingLayer);
                    keymap.ChangeKey(waitingLayer, waitingIndex, keyCode);
                }
                else
                {
                    EmitSignal(nameof(ReleaceLastKey), waitingIndex, waitingLayer);
                }

            }
        }


        //  // Called every frame. 'delta' is the elapsed time since the previous frame.
        //  public override void _Process(float delta)
        //  {
        //      
        //  }

    }
}
