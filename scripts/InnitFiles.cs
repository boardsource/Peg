using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;


namespace Peg
{
    class InnitFiles
    {

        string bootText;
        string kbText;
        string mainText;
        string layoutText;
        Layout jsonLayout;

        public InnitFiles(PegFullServiceBoard serverBoard)
        {
            kbText = serverBoard.kb;
            mainText = serverBoard.main;
            layoutText = serverBoard.layout;
            this.jsonLayout = JsonConvert.DeserializeObject<Layout>(layoutText);
            string name = jsonLayout.features.name.ToUpper();
            // pull the name from the layout and put it in the boot 
            bootText = $"import storage\nstorage.remount(' / ', readonly= False)\nm = storage.getmount(' / ')\nm.label = '{name}'\nstorage.remount(' / ', readonly= True)storage.enable_usb_drive()";
        }

        public void setupDrive(string path)
        {
  
            Godot.File my_file = new Godot.File();
            my_file.Open(path+"boot.py", Godot.File.ModeFlags.Write);
            my_file.StoreString(bootText);
            my_file.Close();
        
            my_file.Open(path + "kb.py", Godot.File.ModeFlags.Write);
            my_file.StoreString(kbText);
            my_file.Close();

            my_file.Open(path + "main.py", Godot.File.ModeFlags.Write);
            my_file.StoreString(mainText);
            my_file.Close();

            my_file.Open(path + "layout.json", Godot.File.ModeFlags.Write);
            my_file.StoreString(layoutText);
            my_file.Close();
        }


    }
}

