extends Control


# Declare member variables here. Examples:
# var a = 2
# var b = "text"
var keymap = null
var kb_drive = null
var has_keymap=null
var has_layout=null

# Called when the node enters the scene tree for the first time.
func _ready():
	var dir = Directory.new()
	#var count= dir.get_drive_count()
	print(dir)
	for i in 10:
		var drive_letter =dir.get_drive(i)
		drive_letter = "D:"
		print("is"+drive_letter+"was ")
		if drive_letter== "C:"|| drive_letter=="":
			continue
		var files = get_files(""+drive_letter+"/")
		print(files)
		if files.has("main.py"):
			print("found main")
			kb_drive=""+drive_letter+"/"
			if files.has("main.py"):
				has_keymap=""+kb_drive+"main.py"
			if files.has("layout.json"):
				has_layout=""+kb_drive+"layout.json"
				print("has layout")
			break
	if kb_drive!= null:
		print("kb_drive not null")
		$FileDialog.current_dir = kb_drive
		
		var keymap_script=load("res://scripts/Keymap.cs")
		keymap= keymap_script.Instance()
		if has_keymap!=null:
			var text = load_text_file(has_keymap)
			keymap.StringToKeymap(text)
			print(has_keymap)
		if has_layout!=null:
			var text = load_text_file(has_layout)
			keymap.ParceLayout(text)
			print(has_layout)

		
		
#func _process(delta):
#	pass

func get_files(path):
	var files = []
	var dir = Directory.new()
	dir.open(path)
	dir.list_dir_begin(true)

	var file = dir.get_next()
	while file != '':
		files += [file]
		file = dir.get_next()

	return files
	
func load_text_file(path):
	var f = File.new()
	var err = f.open(path, File.READ)
	if err != OK:
		printerr("Could not open file, error code ", err)
		return ""
	var text = f.get_as_text()
	f.close()
	return text
	
func _on_Button_pressed():
	$FileDialog.popup()


func _on_FileDialog_file_selected(path):
	print(path)

	


func _on_Button2_pressed():
	var newMap=keymap.ToString()
	var my_file = File.new()
	var my_text = str(newMap)
	my_file.open(has_keymap, my_file.WRITE)
	assert(my_file.is_open())
	my_file.store_string(my_text)
	my_file.close()



func _on_keymap_UpdatedMap(map):

	pass # Replace with function body.
