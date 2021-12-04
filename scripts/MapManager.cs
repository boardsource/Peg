using Godot;
using System;

namespace Peg
{
    public class MapManager : Node
    {
        bool waitingKey = false;
        int waitingLayer = 0;
        int waitingIndex = 0;
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
        public void NoticeThatKeyIsWaiting(int index,int layer)
        {
            EmitSignal(nameof(ReleaceLastKey),waitingIndex,waitingLayer);
            waitingIndex = index;
            waitingLayer = layer;
            waitingKey = true;

        }
        public void NoticeToUpdateKey(KeyCode keyCode) {
            if (this.waitingKey)
            {
                EmitSignal(nameof(ReleaceLastKey), waitingIndex, waitingLayer);

                keymap.ChangeKey(waitingLayer, waitingIndex, keyCode);
            }
        }


        //  // Called every frame. 'delta' is the elapsed time since the previous frame.
        //  public override void _Process(float delta)
        //  {
        //      
        //  }

    }
}
