using Godot;
using System;
using System.Collections.Generic;

namespace Peg
{
	 class KeyLayout : Panel
	{
		[Export] public int SelectedLayer = 0;
		int selectedIndex;
		Keymap keymap;
		List<SingleLayoutKey> keysInLayout;
		PackedScene blankKey;


		// Declare member variables here. Examples:
		// private int a = 2;
		// private string b = "text";

		// Called when the node enters the scene tree for the first time.
		public override void _Ready()
		{
			/// this.keymap = Keymap.Instance();
			//GD.Print(this.GetType());
			//this.unsub= keymap.Subscribe(this);
			//GD.Print(this.keymap.keymap[0][0].Code);
			this.blankKey = ResourceLoader.Load("res://views/SingleLayoutKey.tscn") as PackedScene;
			this.keysInLayout = new List<SingleLayoutKey>();

			this.keymap = Keymap.Instance();
			keymap.Connect("UpdatedMap", this, nameof(_on_keymap_UpdatedMap));

		}
		public override void _EnterTree()
		{
			//GD.Print(this.GetType());
		  //keymap.Subscribe(this);
			//GD.Print(this.keymap.keymap[0][0].Code);
		}


		public void SelectIndex(int index)
		{
			selectedIndex = index;
		}

		public void OnNext()
		{
			throw new NotImplementedException();
		}
		void renderLayout() {
			if (keysInLayout.Count == 0)
			{
				for (int index = 0; index < keymap.KeyLayout.layout.Count; index++)
				{
					
					var item = keymap.KeyLayout.layout[index];
					var indexCode = keymap.keymap[SelectedLayer][index];
					var addedKey = (Panel)this.blankKey.Instance();
					SingleLayoutKey buttonScript = addedKey as SingleLayoutKey;
					buttonScript.Setup(item, indexCode, index, SelectedLayer);
					this.keysInLayout.Add(buttonScript);
					AddChild(addedKey);
				}
			}
			else
			{
				updateDisplay();
			}

		}

   
		void updateDisplay() {
			for (int index = 0; index < keysInLayout.Count; index++)
			{
				var script = keysInLayout[index];
				var indexCode = keymap.keymap[SelectedLayer][index];
				script.Update(indexCode);
			}
		}

		public void _on_keymap_UpdatedMap(Keymap map)
		{
	 
			if (map.HaveLayout&&map.HaveMap)
			{
				renderLayout();
			}
			else if(map.HaveLayout)
			{
			}
			
			  
		}
	}
}
