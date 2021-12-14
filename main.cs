using Godot;
using System;
using System.IO;
using System.Collections;
namespace Peg
{
	public class main : Control
	{
		string keymap = "";
		string kbDrive = "";
		string hasKeymap = "";
		string hasLayout = "";
		Keymap mainKeymap;
		// Declare member variables here. Examples:
		// private int a = 2;
		// private string b = "text";

		// Called when the node enters the scene tree for the first time.
		public override void _Ready()
		{
			Godot.OS.SetWindowTitle("Peg");
			DriveInfo[] allDrives = DriveInfo.GetDrives();
			for (int i = 0; i < allDrives.Length; i++)
			{
				DriveInfo d = allDrives[i];
				if (d.IsReady == true)
				{
					GD.Print(d.VolumeLabel);
					if (d.VolumeLabel.StartsWith("C")|| d.VolumeLabel.StartsWith("/boot"))
					{
						GD.Print("skipping");
						continue;
					}
					if (System.IO.Directory.Exists("" + d.VolumeLabel + "/"))
					{
						string[] files = System.IO.Directory.GetFiles("" + d.VolumeLabel + "/");
						string filesString = string.Join(",", files);
						if (filesString.Contains("main.py") && filesString.Contains("layout.json"))
						{
							this.kbDrive = "" + d.VolumeLabel + "/";
							this.hasKeymap = "" + kbDrive + "main.py";
							this.hasLayout = "" + kbDrive + "layout.json";
							break;
						}
					}
				}
			}
			if (this.kbDrive != "")
			{
				this.mainKeymap = Keymap.Instance();
				if (hasKeymap != "")
				{
					string keymapText = this.loadTextFile(hasKeymap);
					this.mainKeymap.StringToKeymap(keymapText);
				}
				if (hasLayout != "")
				{
					string layoutText = this.loadTextFile(hasLayout);
					this.mainKeymap.ParceLayout(layoutText);
				}
			}

		}
		public void _on_Button2_pressed()
		{
			string newMap = this.mainKeymap.ToString();
			Godot.File my_file = new Godot.File();
			my_file.Open(this.hasKeymap, Godot.File.ModeFlags.Write);
			my_file.StoreString(newMap);
			my_file.Close();

		}

		private string loadTextFile(string path)
		{
			Godot.File file = new Godot.File();
			file.Open(path, Godot.File.ModeFlags.Read);
			string text = file.GetAsText();
			file.Close();
			return text;

		}
	}

}