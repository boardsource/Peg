using Godot;
using System;
using System.Collections.Generic;
using System.Linq;




namespace Peg
{
   
	public class UseableKeyGrid : GridContainer
	{
	   public enum KeycodeSet
		{
			basic,
			lessUsed,
			blueTooth,
			internalCodes,
			international,
			modifiers,
			shifted,
			layers,
				led
			 ,custom
		}
		KeyCodes codes;
		List<KeyCode> selectedCodes;
		[Export] public KeycodeSet SelectedSet = KeycodeSet.basic;
		PackedScene blankKey;
		List<Button> subKeys;
		

		// Declare member variables here. Examples:
		// private int a = 2;
		// private string b = "text";

		// Called when the node enters the scene tree for the first time.
		public override void _Ready()
		{
			this.subKeys = new List<Button>();
			
			this.codes = KeyCodes.Instance();
			this.selectKeyCodes();

			this.blankKey =ResourceLoader.Load("res://views/SingleUableKey.tscn") as PackedScene;
			if (blankKey != null)
				this.renderKeyCodes();
			else
				GD.Print("Not of type PackedScene");
			if (SelectedSet == KeycodeSet.custom)
			{
				MakeCustomKey makeCustomKey = GetNode<MakeCustomKey>("/root/Main/mainViews/keyboardEditView/keyboard layout/Make Custom Key");
				if (makeCustomKey != null)
				{
					GD.Print("I found it");
					makeCustomKey.Connect("NewKey", this, nameof(_on_new_key));

				}

			}


		}
		public void _on_new_key()
		{
			GD.Print("plz");
			selectKeyCodes();
			renderKeyCodes();
		}

		void selectKeyCodes()
		{
			switch (this.SelectedSet)
			{
				case KeycodeSet.basic:
					selectedCodes = new List<KeyCode>(this.codes.Basic.Values);
					break;
				case KeycodeSet.blueTooth:
					selectedCodes = new List<KeyCode>(this.codes.Bluetooth.Values);
					break;
				case KeycodeSet.internalCodes:
					selectedCodes = new List<KeyCode>(this.codes.InternalCodes.Values);
					break;
				case KeycodeSet.international:
					selectedCodes = new List<KeyCode>(this.codes.International.Values);
					break;
				case KeycodeSet.modifiers:
					selectedCodes = new List<KeyCode>(this.codes.Modifiers.Values);
					break;
				case KeycodeSet.shifted:
					selectedCodes = new List<KeyCode>(this.codes.Shifted.Values);
					break;
				case KeycodeSet.lessUsed:
					selectedCodes = new List<KeyCode>(this.codes.LessUsed.Values);
					break;
				case KeycodeSet.layers:
					selectedCodes = new List<KeyCode>(this.codes.Layers.Values);
					break;
				case KeycodeSet.custom:
					selectedCodes = new List<KeyCode>(this.codes.CustomCodes.Values);
					break;
				case KeycodeSet.led:
					selectedCodes = new List<KeyCode>(this.codes.Led.Values);
					break;
			}
		}

		void renderKeyCodes()
		{
			if (this.subKeys.Count > 0)
			{
				foreach(Button subKey in this.subKeys)
				{
					subKey.QueueFree();
				}
				this.subKeys = new List<Button>();
			}


			foreach (KeyCode keyCode in this.selectedCodes)
				{
					var addedKey = (Button)this.blankKey.Instance();
					SingleUableKey buttonScript = addedKey as SingleUableKey;
					if (keyCode.Display == "")
					{
						addedKey.Text = keyCode.Code;
					}
					else
					{
						addedKey.Text = keyCode.Display;
					}
					buttonScript.code = keyCode;
					AddChild(addedKey);
					this.subKeys.Add(addedKey);
				}
	  

		}

		//  // Called every frame. 'delta' is the elapsed time since the previous frame.
		//  public override void _Process(float delta)
		//  {
		//      
		//  }
	}
}
