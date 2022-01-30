using Godot;
using System;
using System.Collections.Generic;

namespace Peg
{
	 class KeyLayout : Panel
	{
		[Export] public int SelectedLayer = 0;
		[Export] public bool ledAdjust = false;
		int selectedIndex;
		Keymap keymap;
		List<SingleLayoutKey> keysInLayout;
		PackedScene blankKey;

		public override void _Ready()
		{
			this.blankKey = ResourceLoader.Load("res://views/SingleLayoutKey.tscn") as PackedScene;
			this.keysInLayout = new List<SingleLayoutKey>();
			this.keymap = Keymap.Instance();
			keymap.Connect("UpdatedMap", this, nameof(_on_keymap_UpdatedMap));
		}
		public override void _EnterTree()
		{

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
					
					// you need to add an array to the keymap of the per key colors. 
					// when then you need to on update update that araray
					// here you need to pass to a key that is a color thing not key thig 
					// 
					var item = keymap.KeyLayout.layout[index];
					var indexCode = keymap.keymap[SelectedLayer][index];
					var addedKey = (Panel)this.blankKey.Instance();
					SingleLayoutKey buttonScript = addedKey as SingleLayoutKey;
					buttonScript.Setup(item, indexCode, index, SelectedLayer, this.ledAdjust);
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
