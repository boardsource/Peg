using Godot;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;
using System.Text.RegularExpressions;

namespace Peg
{
    public class KeyCodes
    {
        static KeyCodes instance;
        public Dictionary<string, KeyCode> Basic;
        public Dictionary<string, KeyCode> LessUsed;
        public Dictionary<string, KeyCode> Bluetooth;
        public Dictionary<string, KeyCode> InternalCodes;
        public Dictionary<string, KeyCode> International;
        public Dictionary<string, KeyCode> Modifiers;
        public Dictionary<string, KeyCode> Shifted;
        public Dictionary<string, KeyCode> Layers;
        public Dictionary<string, KeyCode> Led;
        public Dictionary<string, KeyCode> CustomCodes;


        protected KeyCodes(){
            Godot.File file = new Godot.File();
            file.Open("res://jsonKeycodes/basic-keycodes.json", Godot.File.ModeFlags.Read);
            string basictext = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/lessused-keycodes.json", Godot.File.ModeFlags.Read);
            string lessUsedtext = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/bluetooth-keycodes.json", Godot.File.ModeFlags.Read);
            string bluetoothtext = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/internal-keycodes.json", Godot.File.ModeFlags.Read);
            string internalText = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/international-keycodes.json", Godot.File.ModeFlags.Read);
            string internationalText = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/modifiers-keycodes.json", Godot.File.ModeFlags.Read);
            string modifiersText = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/shifted-keycodes.json", Godot.File.ModeFlags.Read);
            string shiftedText = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/layers-keycodes.json", Godot.File.ModeFlags.Read);
            string layersText = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/led-keycodes.json", Godot.File.ModeFlags.Read);
            string ledText = file.GetAsText();
            file.Close();
            file.Open("res://jsonKeycodes/custom-keycodes.json", Godot.File.ModeFlags.Read);
            string customText = file.GetAsText();
            file.Close();
            Basic = JsonConvert.DeserializeObject<List<KeyCode>>(basictext).ToDictionary(keycode => keycode.Code);
            LessUsed = JsonConvert.DeserializeObject<List<KeyCode>>(lessUsedtext).ToDictionary(keycode => keycode.Code);
            Bluetooth = JsonConvert.DeserializeObject<List<KeyCode>>(bluetoothtext).ToDictionary(keycode => keycode.Code);
            InternalCodes = JsonConvert.DeserializeObject<List<KeyCode>>(internalText).ToDictionary(keycode => keycode.Code);
            International = JsonConvert.DeserializeObject<List<KeyCode>>(internationalText).ToDictionary(keycode => keycode.Code);
            Modifiers = JsonConvert.DeserializeObject<List<KeyCode>>(modifiersText).ToDictionary(keycode => keycode.Code);
            Shifted = JsonConvert.DeserializeObject<List<KeyCode>>(shiftedText).ToDictionary(keycode => keycode.Code);
            Layers = JsonConvert.DeserializeObject<List<KeyCode>>(layersText).ToDictionary(keycode => keycode.Code);
            Led = JsonConvert.DeserializeObject<List<KeyCode>>(ledText).ToDictionary(keycode => keycode.Code);

            CustomCodes = JsonConvert.DeserializeObject<List<KeyCode>>(customText).ToDictionary(keycode => keycode.Code);
            addBlankSubKeys();

        }
        public static KeyCodes Instance()
        {
            // Uses lazy initialization
            // Note: this is not thread safe.
            if (instance == null)
            {
                instance = new KeyCodes();
            }
            return instance;
        }
        void addBlankSubKeys()
        {
            KeyCode noKey = BaseKeyCodeForString("KC.NO");
            for (int i = 0; i < Modifiers.Values.Count; i++)    
            {
                KeyCode keycode = Modifiers.ElementAt(i).Value;
                if (keycode.CanHaveSub)
                {
                    keycode.SubOne = noKey;
                }

            }
        }
        // todo not dry clean up
        public KeyCode BaseKeyCodeForString(string code)
        {
            bool hasValue = Basic.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode LedKeyCodeForString(string code)
        {
            bool hasValue = Led.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode LessUsedKeyCodeForString(string code)
        {
            bool hasValue = LessUsed.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode BluetoothKeyCodeForString(string code)
        {
            bool hasValue = Bluetooth.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode InternalKeyCodeForString(string code)
        {
            bool hasValue = InternalCodes.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode LayerKeyCodeForString(string code)
        {
            bool hasValue = Layers.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode InternationalKeyCodeForString(string code)
        {
            bool hasValue = International.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode ModifiersKeyCodeForString(string code)
        {
            bool hasValue = Modifiers.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else 
            {
                if (code.Contains("("))
                {
                    var splitCode = code.Split("(");
                    string newSeachCode = splitCode[0] + "(kc)";
                    bool secondSearch = Modifiers.TryGetValue(newSeachCode, out KeyCode SecondValue);
                    if (secondSearch)
                    {
                        string remvedstuff= splitCode[1].Substring(0, splitCode[1].Length - 1);
                        KeyCode NeededKey = SecondValue.NewKeyCode();
                        NeededKey.SubOne = KeyCodeForString(remvedstuff);
                        GD.Print(NeededKey.SubOne.Code);
                        return NeededKey;
                    }

                }

                return null;
            }
        }
        public KeyCode ShiftedKeyCodeForString(string code)
        {
            bool hasValue = Shifted.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                return null;
            }
        }
        public KeyCode CustomKeyCodeForString(string code, string dirtycode)
        {
            bool hasValue = CustomCodes.TryGetValue(code, out KeyCode value);
            if (hasValue)
            {
                return value.NewKeyCode();
            }
            else
            {
                bool hasValueSecond = CustomCodes.TryGetValue(dirtycode, out KeyCode valueSecond);
                if (hasValueSecond)
                {
                    return valueSecond.NewKeyCode();
                }
                else
                {
                    return null;

                }
            }
        }
        private static readonly Regex sWhitespace = new Regex(@"\s+");
        public static string ReplaceWhitespace(string input, string replacement)
        {
            return sWhitespace.Replace(input, replacement);
        }
        public KeyCode KeyCodeForString(string dirtycode)
        {
            string code = ReplaceWhitespace(dirtycode, "");
            KeyCode tempCode;
           tempCode= BaseKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = ShiftedKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = ModifiersKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = LessUsedKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = InternationalKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = InternalKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = LedKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = LayerKeyCodeForString(code);
            if (tempCode != null)
            {
                return tempCode;
            }
            tempCode = CustomKeyCodeForString(code, dirtycode);
            if (tempCode != null)
            {
                return tempCode;
            }
            else
            {
                KeyCode errorCode = new KeyCode();
                errorCode.Code = "KC.NO";
                errorCode.Display = "ERR ";
                errorCode.Keybinding = "";
                errorCode.Description = "error no key code '" + code+"' from imported map";
                errorCode.SubNumber = 0;
                errorCode.CanHaveSub = false;
                errorCode.CanHaveSubNumber = false;
                return errorCode;
                // return null;
            }
        }
        public void RemoveCustomCode(string code)
        {
            CustomCodes.Remove(code);
            this.saveCustomCodes();

        }
        public void AddCustomCode(KeyCode newCode)
        {
            CustomCodes.Add(newCode.Code, newCode);
            this.saveCustomCodes();
        }
        void saveCustomCodes()
        {
            Godot.File file = new Godot.File();
            file.Open("res://jsonKeycodes/custom-keycodes.json", Godot.File.ModeFlags.Write);
            string customText = JsonConvert.SerializeObject(new List<KeyCode>(this.CustomCodes.Values), Formatting.Indented);
            file.StoreString(customText);
            file.Close();
        }



    }
}