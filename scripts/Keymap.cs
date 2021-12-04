using Godot;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;
using System.Text.RegularExpressions;


namespace Peg
{
     class Keymap : Node
    {
     
        static Keymap instance;

        KeyCodes codes;
        List<List<string>> keymapStr;
        MiscKeymapParts miscKeymapParts;
        public List<List<KeyCode>> keymap;
        public Layout KeyLayout;
        public string layout;
        public bool HaveLayout;
        public bool HaveMap;

        [Signal]
        public delegate void UpdatedMap(Keymap map);

        public static Keymap Instance()
        {
            // Uses lazy initialization
            // Note: this is not thread safe.
            if (instance == null)
            {
                instance = new Keymap();
            }
            return instance;
        }
        protected Keymap()
        {
            this.codes = KeyCodes.Instance();

        }
        public void ParceLayout(string layoutJson)
        {
            this.KeyLayout = JsonConvert.DeserializeObject<Layout>(layoutJson);
            this.HaveLayout = true;
            this.miscKeymapParts = new MiscKeymapParts(KeyLayout);
   

            EmitSignal(nameof(UpdatedMap), this);

        }

        public void StringToKeymap(string baseMap){
            this.keymapStr = new List<List<string>>();
            int headderCharacterCount =20;
            int footerCharacterCount = 3;
            string justLayers = baseMap.Split("# keymap")[1];
            string remvedFooters = justLayers.Substring(0, justLayers.Length - footerCharacterCount);
            string rawLayers= remvedFooters.Substring(headderCharacterCount);
            string[] layers= rawLayers.Split("],");
            foreach (string match in layers)
            {
                this.keymapStr.Add(new List<string>(match.Replace("[","").Replace("]","").Replace(" ", "").Split(",")));
            }
            this.keymap = new List<List<KeyCode>>();

            foreach (List<string> layer in keymapStr)
            {
                List<KeyCode> tempLayer = new List<KeyCode>();
                foreach (string code in layer)
                {
                    KeyCode tempCode = codes.KeyCodeForString(code);
                    tempLayer.Add(tempCode);  
                }
                keymap.Add(tempLayer);
            }
            this.HaveMap = true;
      
            EmitSignal(nameof(UpdatedMap), this);

        }
        
        public void ChangeKey(int layer,int pos, KeyCode newKey)
        {
            // todo add in saving old changes for ctrl z 
            if (keymap[layer][pos].CanHaveSub && newKey.Code != "KC.NO")  
            {
                keymap[layer][pos].SubOne = newKey;
            }
            else
            {
                keymap[layer][pos] = newKey;
            }

            EmitSignal(nameof(UpdatedMap), this);

        }
        string keymapBackToString()
        {
            List<string> keymapString = new List<string>();
            foreach (List<KeyCode> layer in this.keymap)
            {
                string combinedLayer = string.Join(", ", layer);
                keymapString.Add("[" + combinedLayer + "]");
            }
            return "# keymap\nkeyboard.keymap = [" + string.Join(", \n", keymapString) + "] \n# keymap\n";
        }
        public override string ToString()
        {
            GD.Print("this is what I got");

            string newLayers = this.keymapBackToString();
            string newHeader = miscKeymapParts.ReturnFileHeader();
            string newfooter= miscKeymapParts.ReturnFileFooter();
            return newHeader + newLayers + newfooter; 
        }


    }
}
