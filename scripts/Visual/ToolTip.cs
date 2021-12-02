using Godot;
using System;

namespace Peg
{
    public class ToolTip : Control
    {
        // todo this is not the best tool tip but it will do for now 
        Label tipTitle;
        Label body;
        Panel panel;
        ProgramSettings programSettings;

        public override void _Ready()
        {
            tipTitle = GetNode<Label>("Panel/title");
            body = GetNode<Label>("Panel/body");
            panel = GetNode<Panel>("Panel");
            this.programSettings = ProgramSettings.Instance();
        }
        bool nullCheck()
        {
            return tipTitle != null && body != null && panel != null&&programSettings.tooltips;
        }
        public void ShowToolTip(string title, string text)
        {
            if (nullCheck())
            {
                Vector2 pos =GetViewport().GetMousePosition();
                this.SetPosition(pos);
                body.Text = text;
                tipTitle.Text = title;
                panel.Show();
            }
        }
        public void HideToolTip()
        {
            if (nullCheck())
            {
                panel.Hide();
            }
        }

    }
}
