using Godot;
using System;

namespace Peg
{
    public class KeyCode
    {
        public string Code { get; set; }
        public string Display { get; set; }
        public string Keybinding { get; set; }
        public bool CanHaveSub { get; set; }
        public bool CanHaveSubNumber { get; set; }
        public int SubNumber { get; set; }
        public string Description { get; set; }
        public KeyCode SubOne { get; set; }
        public KeyCode SubTwo { get; set; }

        public KeyCode() { }
        public KeyCode(KeyCode keycode)
        {
     
            Code = keycode.Code;
            Display = keycode.Display;
            Keybinding = keycode.Keybinding;
            CanHaveSub = keycode.CanHaveSub;
            CanHaveSubNumber = keycode.CanHaveSubNumber;
            SubNumber = keycode.SubNumber;
            Description = keycode.Description;
            SubOne = keycode.SubOne;
            SubTwo = keycode.SubTwo;
        }
        public KeyCode(string code, string display, string keybinding, bool canHaveSub, bool canHaveSubNumber,int subNumber,string description)
        {
            Code = code;
            Display = display;
            Keybinding = keybinding;
            CanHaveSub = canHaveSub;
            CanHaveSubNumber = canHaveSubNumber;
            SubNumber = subNumber;
            Description = description;
        }
  

   public KeyCode NewKeyCode()
        {
            KeyCode TempCode = new KeyCode();
            TempCode.Code = this.Code;
            TempCode.Display = this.Display;
            TempCode.Keybinding = this.Keybinding;
            TempCode.CanHaveSub = this.CanHaveSub;
            TempCode.CanHaveSubNumber = this.CanHaveSubNumber;
            TempCode.SubNumber = this.SubNumber;
            TempCode.Description = this.Description;
            TempCode.SubOne = this.SubOne;
            TempCode.SubTwo = this.SubTwo;
            return TempCode;
        }
        public override string ToString()
        {
            //todo maybe add logic for sub keys and shit here
            // the idea is that to tostring will return the code that can be run
            if (CanHaveSub)
            {
                return Code.Split("kc")[0] + SubOne.Code + ")";
            }
            else
            {
                return Code;
            }
        }
    }
}
