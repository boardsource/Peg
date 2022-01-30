using Godot;
using System;

public class LedLayout : Panel
{
    ColorPicker colorPicker;
    public override void _Ready()
    {
        colorPicker = GetNode<ColorPicker>("ColorPicker");

    }

}
