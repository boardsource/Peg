using Godot;
using System;

namespace Peg
{
	public class MakeCustomKey : Panel
	{
		LineEdit description;
		LineEdit code;
		LineEdit display;
		Label errorLabel;
		KeyCodes codes;
		[Signal]
		public delegate void NewKey();

		public override void _Ready()
		{
			description = GetNode<LineEdit>("description/descriptionEdit");
			code = GetNode<LineEdit>("code/codeEdit");
			display = GetNode<LineEdit>("display/displayEdit");
			errorLabel = GetNode<Label>("code/Error");
			codes = KeyCodes.Instance();
		}
		public void _on_Save_pressed()
		{
			if (description != null && code != null && display != null)
			{
				string codeValue = code.Text;
				string displayValue = display.Text;
				string descriptionValue = description.Text;
				if (errorLabel != null)
				{
					if (codeValue == "")
					{
						errorLabel.Text = "ERROR This is missing";
					}
					else
					{
						KeyCode newCustomKey = new KeyCode("send_string('" + codeValue+"')", displayValue, "", false, false, 0, descriptionValue);
						codes.AddCustomCode(newCustomKey);
						EmitSignal(nameof(NewKey));
					 

					}
				}
			}
		}
		public void _on_codeEdit_text_changed(string value)
		{
			if (value != null&& errorLabel.Text == "ERROR This is missing")
			{
				errorLabel.Text = "";

			}
		}

	}
}
