using Godot;
using System;
using System.IO;
using System.Collections;
namespace Peg
{
	public class KeyboardEditMain : Control
	{
		string keymap = "";
		string kbDrive = "";
		string hasKeymap = "";
		string hasLayout = "";
		bool didNotFindDrive = false;
		bool keepLooking = true;
		PackedScene searchingForBoardScene;
		Control searchingForBoard;
		Timer delayTimer;
		Keymap mainKeymap;
		// Declare member variables here. Examples:
		// private int a = 2;
		// private string b = "text";

		// Called when the node enters the scene tree for the first time.
		public override void _Ready()
		{
			this.searchingForBoardScene = ResourceLoader.Load("res://views/SearchingForBoard.tscn") as PackedScene;
			delayTimer = GetNode<Timer>("Timer");
			Godot.OS.SetWindowTitle("Peg");
			scanDrives();
			manageTimer();
		}

		void manageTimer()
        {
			delayTimer.SetWaitTime(3f);
			if (didNotFindDrive && keepLooking)
			{
				delayTimer.Start();
				if (searchingForBoardScene != null)
				{
					if (searchingForBoard == null)
                    {
						this.searchingForBoard = (Control)searchingForBoardScene.Instance();
						AddChild(searchingForBoard);
					}
				}
				else
                {
					GD.Print("Not of type PackedScene");
				}
					
			}
			else
			{
                if (searchingForBoard != null)
                {
					RemoveChild(searchingForBoard);
				}
				delayTimer.Stop();
			}
		
		}

		public void _on_Timer_timeout()
        {
			if (didNotFindDrive && keepLooking)
			{
				scanDrives();
			}
			manageTimer();
		}
		void scanDrives()
        {
			DriveInfo[] allDrives = DriveInfo.GetDrives();
			for (int i = 0; i < allDrives.Length; i++)
			{
				DriveInfo d = allDrives[i];
				if (d.IsReady == true)
				{
					if (d.VolumeLabel.StartsWith("C") || d.VolumeLabel.StartsWith("/boot"))
					{
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
				didNotFindDrive = false;
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
            else
            {
				didNotFindDrive = true;
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