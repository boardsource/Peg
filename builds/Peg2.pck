GDPC                                                                             !   <   res://.import/icon.png-487276ed1e3a0c39cad0279d744ee560.stex�      U      -��`�0��x�5�[,   res://.mono/metadata/scripts_metadata.debug �      o      � aN���~]��w�d   res://KeyLayout.tscn`      6      tO����Z4d����   res://SingleLayoutKey.tscn  �      �      �v�8-�a(H5��P�   res://SingleUableKey.tscn   0      �      ����Z���}1���   res://ToolTip.tscn  �      �      �8�b��5ϧ�>�	�o    res://customUseableKeyGrid.tscn �              ��ُ ��	���B~   res://default_env.tres  �      �       um�`�N��<*ỳ�8   res://icon.png.import   �)      �      �����%��(#AB�   res://main.gd.remap  [             ֤�\n�������Dݮ�   res://main.gdc  `,      �
      �b�g��Κ�V)�VHz   res://main.tscn  7      �      ��I���������   res://makeCustomKey.tscn�G      �      ��xI'�m����-4�   res://project.binary@[      O      �n7NW�O�~��e>Z   res://scripts/KeyCode.cs�X             h�)ژ��@��ح\��@   res://scripts/KeyCodes.cs   �X             h�)ژ��@��ح\��@   res://scripts/Keymap.cs �X             h�)ژ��@��ح\��@    res://scripts/LayoutFeatures.cs �X             h�)ژ��@��ح\��@   res://scripts/MapManager.cs �X             h�)ژ��@��ح\��@    res://scripts/MiscKeymapParts.cs�X             h�)ژ��@��ح\��@    res://scripts/ProgramSettings.cs Y             h�)ژ��@��ح\��@    res://scripts/Unsubscriber.cs   Y             h�)ژ��@��ح\��@   res://scripts/UsbDevice.cs   Y             h�)ژ��@��ح\��@,   res://scripts/Visual/CustomUseableKeyGrid.cs0Y             h�)ژ��@��ح\��@$   res://scripts/Visual/KeyLayout.cs   @Y             h�)ژ��@��ح\��@    res://scripts/Visual/Layout.cs  PY             h�)ژ��@��ح\��@$   res://scripts/Visual/LayoutKey.cs   `Y             h�)ژ��@��ح\��@(   res://scripts/Visual/MakeCustomKey.cs   pY             h�)ژ��@��ح\��@(   res://scripts/Visual/SingleLayoutKey.cs �Y             h�)ژ��@��ح\��@(   res://scripts/Visual/SingleUableKey.cs  �Y             h�)ژ��@��ح\��@    res://scripts/Visual/ToolTip.cs �Y             h�)ژ��@��ح\��@(   res://scripts/Visual/UseableKeyGrid.cs  �Y             h�)ژ��@��ح\��@   res://useableKeyGrid.tscn   �Y      T      O��>qK�@nU�!R�        {"res://scripts/Keymap.cs":{"modified_time":"1635365082","class":{"namespace":"Peg","class_name":"Keymap","nested":false}},"res://scripts/MapManager.cs":{"modified_time":"1632069569","class":{"namespace":"Peg","class_name":"MapManager","nested":false}},"res://scripts/Visual/CustomUseableKeyGrid.cs":{"modified_time":"1632333560","class":{"namespace":"Peg","class_name":"CustomUseableKeyGrid","nested":false}},"res://scripts/Visual/KeyLayout.cs":{"modified_time":"1633984773","class":{"namespace":"Peg","class_name":"KeyLayout","nested":false}},"res://scripts/Visual/LayoutKey.cs":{"modified_time":"1630947661","class":{"namespace":"Peg","class_name":"LayoutKey","nested":false}},"res://scripts/Visual/MakeCustomKey.cs":{"modified_time":"1632685519","class":{"namespace":"Peg","class_name":"MakeCustomKey","nested":false}},"res://scripts/Visual/SingleLayoutKey.cs":{"modified_time":"1635364377","class":{"namespace":"Peg","class_name":"SingleLayoutKey","nested":false}},"res://scripts/Visual/SingleUableKey.cs":{"modified_time":"1634993347","class":{"namespace":"Peg","class_name":"SingleUableKey","nested":false}},"res://scripts/Visual/ToolTip.cs":{"modified_time":"1635622658","class":{"namespace":"Peg","class_name":"ToolTip","nested":false}},"res://scripts/Visual/UseableKeyGrid.cs":{"modified_time":"1632685519","class":{"namespace":"Peg","class_name":"UseableKeyGrid","nested":false}}} [gd_scene load_steps=2 format=2]

[ext_resource path="res://scripts/Visual/KeyLayout.cs" type="Script" id=1]

[node name="KeyLayout" type="Panel"]
anchor_top = 0.085
anchor_right = 1.0
anchor_bottom = 1.0
margin_left = 1.0
margin_top = -4.8
script = ExtResource( 1 )
__meta__ = {
"_edit_use_anchors_": false
}
          [gd_scene load_steps=3 format=2]

[ext_resource path="res://scripts/Visual/SingleLayoutKey.cs" type="Script" id=1]

[sub_resource type="StyleBoxFlat" id=1]
bg_color = Color( 0.133333, 0.266667, 0.286275, 1 )

[node name="SingleLayoutKey" type="Panel"]
margin_right = 70.0
margin_bottom = 70.0
rect_min_size = Vector2( 70, 70 )
custom_styles/panel = SubResource( 1 )
script = ExtResource( 1 )
__meta__ = {
"_edit_use_anchors_": false
}

[node name="MainButton" type="Button" parent="."]
anchor_right = 1.0
anchor_bottom = 1.0
margin_left = 5.0
margin_top = 5.0
margin_right = -5.0
margin_bottom = -5.0
grow_vertical = 2
toggle_mode = true
text = "MIS"
clip_text = true

[node name="ClearButton" type="Button" parent="."]
anchor_left = 1.0
anchor_right = 1.0
margin_left = -16.0
margin_top = -4.0
margin_right = 4.0
margin_bottom = 16.0
text = "X"
__meta__ = {
"_edit_use_anchors_": false
}

[node name="SubButtonText" type="Label" parent="."]
anchor_right = 1.0
margin_bottom = 14.0
text = "Text"
__meta__ = {
"_edit_use_anchors_": false
}
[connection signal="mouse_entered" from="MainButton" to="." method="_on_SingleLayoutKey_mouse_entered"]
[connection signal="mouse_exited" from="MainButton" to="." method="_on_SingleLayoutKey_mouse_exited"]
[connection signal="pressed" from="MainButton" to="." method="_on_MainButton_pressed"]
[connection signal="pressed" from="ClearButton" to="." method="_on_ClearButton_pressed"]
   [gd_scene load_steps=2 format=2]

[ext_resource path="res://scripts/Visual/SingleUableKey.cs" type="Script" id=1]

[node name="SingleUableKey" type="Button"]
anchor_right = 1.0
anchor_bottom = 1.0
margin_right = -1850.0
margin_bottom = -1010.0
rect_min_size = Vector2( 70, 70 )
rect_clip_content = true
text = "KC.NO"
clip_text = true
script = ExtResource( 1 )
__meta__ = {
"_edit_use_anchors_": false
}
[connection signal="mouse_entered" from="." to="." method="_on_SingleUseableKey_mouse_entered"]
[connection signal="mouse_exited" from="." to="." method="_on_SingleUseableKey_mouse_exited"]
[connection signal="pressed" from="." to="." method="_on_SingleUseableKey_pressed"]
          [gd_scene load_steps=3 format=2]

[ext_resource path="res://scripts/Visual/ToolTip.cs" type="Script" id=1]

[sub_resource type="StyleBoxFlat" id=1]
bg_color = Color( 0.0901961, 0.262745, 0.368627, 1 )

[node name="ToolTip" type="Control"]
anchor_right = 1.0
anchor_bottom = 1.0
margin_right = -1919.0
margin_bottom = -1079.0
script = ExtResource( 1 )
__meta__ = {
"_edit_use_anchors_": false
}

[node name="Panel" type="Panel" parent="."]
visible = false
anchor_right = 1.0
anchor_bottom = 1.0
margin_right = 199.0
margin_bottom = 99.0
custom_styles/panel = SubResource( 1 )
__meta__ = {
"_edit_use_anchors_": false
}

[node name="title" type="Label" parent="Panel"]
margin_left = 21.3574
margin_top = 8.00903
margin_right = 219.357
margin_bottom = 43.009
text = "title"
__meta__ = {
"_edit_use_anchors_": false
}

[node name="body" type="Label" parent="Panel"]
margin_left = 26.0
margin_top = 30.0
margin_right = 303.0
margin_bottom = 115.0
text = "body"
__meta__ = {
"_edit_use_anchors_": false
}
         [gd_resource type="Environment" load_steps=2 format=2]

[sub_resource type="ProceduralSky" id=1]

[resource]
background_mode = 2
background_sky = SubResource( 1 )
             GDST@   @           9  PNG �PNG

   IHDR   @   @   �iq�   sRGB ���  �IDATx�ݜytTU��?��WK*�=���%�  F����0N��݂:���Q�v��{�[�����E�ӋH���:���B�� YHB*d_*�jyo�(*M�JR!h��S�T��w�߻���ro���� N�\���D�*]��c����z��D�R�[�
5Jg��9E�|JxF׵'�a���Q���BH�~���!����w�A�b
C1�dB�.-�#��ihn�����u��B��1YSB<%�������dA�����C�$+(�����]�BR���Qsu][`
�DV����у�1�G���j�G͕IY! L1�]��� +FS�IY!IP ��|�}��*A��H��R�tQq����D`TW���p\3���M���,�fQ����d��h�m7r�U��f������.��ik�>O�;��xm��'j�u�(o}�����Q�S�-��cBc��d��rI�Ϛ�$I|]�ơ�vJkZ�9>��f����@EuC�~�2�ym�ش��U�\�KAZ4��b�4������;�X婐����@Hg@���o��W�b�x�)����3]j_��V;K����7�u����;o�������;=|��Ŗ}5��0q�$�!?��9�|�5tv�C�sHPTX@t����w�nw��۝�8�=s�p��I}�DZ-̝�ǆ�'�;=����R�PR�ۥu���u��ǻC�sH`��>�p�P ���O3R�������۝�SZ7 �p��o�P!�
��� �l��ހmT�Ƴێ�gA��gm�j����iG���B� ܦ(��cX�}4ۻB��ao��"����� ����G�7���H���æ;,NW?��[��`�r~��w�kl�d4�������YT7�P��5lF�BEc��=<�����?�:]�������G�Μ�{������n�v��%���7�eoݪ��
�QX¬)�JKb����W�[�G ��P$��k�Y:;�����{���a��&�eפ�����O�5,;����yx�b>=fc�* �z��{�fr��7��p���Ôִ�P����t^�]͑�~zs.�3����4��<IG�w�e��e��ih�/ˆ�9�H��f�?����O��.O��;!��]���x�-$E�a1ɜ�u�+7Ȃ�w�md��5���C.��\��X��1?�Nغ/�� ��~��<:k?8��X���!���[���꩓��g��:��E����>��꩓�u��A���	iI4���^v:�^l/;MC��	iI��TM-$�X�;iLH���;iI1�Zm7����P~��G�&g�|BfqV#�M������%��TM��mB�/�)����f����~3m`��������m�Ȉ�Ƽq!cr�pc�8fd���Mۨkl�}P�Л�汻��3p�̤H�>+���1D��i�aۡz�
������Z�Lz|8��.ִQ��v@�1%&���͏�������m���KH�� �p8H�4�9����/*)�aa��g�r�w��F36���(���7�fw����P��&�c����{﹏E7-f�M�).���9��$F�f r �9'1��s2).��G��{���?,�
�G��p�µ�QU�UO�����>��/�g���,�M��5�ʖ�e˃�d����/�M`�=�y=�����f�ӫQU�k'��E�F�+ =΂���
l�&���%%�������F#KY����O7>��;w���l6***B�g)�#W�/�k2�������TJ�'����=!Q@mKYYYdg��$Ib��E�j6�U�,Z�鼌Uvv6YYYԶ��}( ���ߠ#x~�s,X0�����rY��yz�	|r�6l����cN��5ϑ��KBB���5ϡ#xq�7�`=4A�o�xds)�~wO�z�^��m���n�Ds�������e|�0�u��k�ٱ:��RN��w�/!�^�<�ͣ�K1d�F����:�������ˣ����%U�Ą������l{�y����)<�G�y�`}�t��y!��O@� A� Y��sv:K�J��ՎۣQ�܃��T6y�ǯ�Zi
��<�F��1>�	c#�Ǉ��i�L��D�� �u�awe1�e&')�_�Ǝ^V�i߀4�$G�:��r��>h�hݝ������t;)�� &�@zl�Ұր��V6�T�+����0q��L���[t���N&e��Z��ˆ/����(�i啝'i�R�����?:
P].L��S��E�݅�Á�.a6�WjY$F�9P�«����V^7���1Ȓ� �b6�(����0"�k�;�@MC���N�]7 �)Q|s����QfdI���5 ��.f��#1���G���z���>)�N�>�L0T�ۘ5}��Y[�W뿼mj���n���S?�v��ْ|.FE"=�ߑ��q����������p����3�¬8�T�GZ���4ݪ�0�L�Y��jRH��.X�&�v����#�t��7y_#�[�o��V�O����^�����paV�&J�V+V��QY����f+m��(�?/������{�X��:�!:5�G�x���I����HG�%�/�LZ\8/����yLf�Æ>�X�Єǣq���$E������E�Ǣ�����gێ��s�rxO��x孏Q]n���LH����98�i�0==���O$5��o^����>6�a� �*�)?^Ca��yv&���%�5>�n�bŜL:��y�w���/��o�褨A���y,[|=1�VZ�U>,?͑���w��u5d�#�K�b�D�&�:�����l~�S\���[CrTV�$����y��;#�������6�y��3ݸ5��.�V��K���{�,-ւ� k1aB���x���	LL� ����ңl۱������!U��0L�ϴ��O\t$Yi�D�Dm��]|�m���M�3���bT�
�N_����~uiIc��M�DZI���Wgkn����C��!xSv�Pt�F��kڨ��������OKh��L����Z&ip��
ޅ���U�C�[�6��p���;uW8<n'n��nͽQ�
�gԞ�+Z	���{���G�Ĭ� �t�]�p;躆 ��.�ۣ�������^��n�ut�L �W��+ ���hO��^�w�\i� ��:9>3�=��So�2v���U1z��.�^�ߋěN���,���� �f��V�    IEND�B`�           [remap]

importer="texture"
type="StreamTexture"
path="res://.import/icon.png-487276ed1e3a0c39cad0279d744ee560.stex"
metadata={
"vram_texture": false
}

[deps]

source_file="res://icon.png"
dest_files=[ "res://.import/icon.png-487276ed1e3a0c39cad0279d744ee560.stex" ]

[params]

compress/mode=0
compress/lossy_quality=0.7
compress/hdr_mode=0
compress/bptc_ldr=0
compress/normal_map=0
flags/repeat=0
flags/filter=true
flags/mipmaps=false
flags/anisotropic=false
flags/srgb=2
process/fix_alpha_border=true
process/premult_alpha=false
process/HDR_as_SRGB=false
process/invert_color=false
stream=false
size_limit=0
detect_3d=true
svg/scale=1.0
GDSC   2   	   ]   �     ������ڶ   �����ƶ�   �������Ӷ���   ���������ƶ�   ���������¶�   �����϶�   ��Ķ   ��������϶��   ����   ����¶��   ��������������¶   ߶��   �����������Ķ���   ��������Ӷ��   ����Ŷ��   ��������Ŷ��   ��Ŷ   ���������Ѷ�   ����������Ķ   ������������¶��   �������Ӷ���   ���¶���   �������������Ӷ�   �������������ƶ�   ����������¶   ���޶���   ���ض���   �������������ض�   ���Ӷ���   �������¶���   ж��   ���Ӷ���   ��Ķ   ���򶶶�   ����   ����������¶   ����Ӷ��   �����������������Ҷ�   ����ƶ��    ���������������������������Ҷ���   ���������؄�������Ҷ   �����ƶ�   �������Ѷ���   ������Ӷ   ������¶   ����󶶶   ������ض   �����������Ѷ���   ��������������������ƶ��   ��ƶ          C:               /         main.py       layout.json       res://scripts/Keymap.cs              Could not open file, error code                                                     	      
                     #      ,      5      ;      E      K      M      Y      b      j      s      {      �      �      �      �      �      �      �       �   !   �   "   �   #   �   $   �   %   �   &   �   '   �   (   �   )   �   *   �   +   �   ,   �   -   �   .   �   /   �   0   �   1      2     3   
  4     5     6     7     8   "  9   #  :   *  ;   3  <   A  =   G  >   N  ?   Q  @   Z  A   `  B   c  C   d  D   j  E   q  F   r  G   s  H   z  I     J   �  K   �  L   �  M   �  N   �  O   �  P   �  Q   �  R   �  S   �  T   �  U   �  V   �  W   �  X   �  Y   �  Z   �  [   �  \   �  ]   3YYYYYY;�  Y;�  Y;�  Y;�  YYY0�  PQV�  ;�  �  T�  PQ�  ;�	  �  T�
  PQ�  )�  �	  V�  ;�  �  T�  P�  Q�  &�  �  V�  ,�  ;�  �  P�  �  �  Q�  &�  T�  P�  QV�  �  �  �  �  �  &�  T�  P�  QV�  �  �  �  �  �  &�  T�  P�  QV�  �  �  �  �  �  +�  &�  V�  W�  T�  �  �  �  ;�  �L  P�  Q�  �  �  T�  PQ�  &�  V�  ;�  �  P�  Q�  �  T�  P�  Q�  &�  V�  ;�  �  P�  Q�  �  T�  P�  QY�  �  YYYY0�  P�  QV�  ;�  LM�  ;�  �  T�  PQ�  �  T�  P�  Q�  �  T�  P�  QY�  ;�  �  T�  PQ�  *�  �  V�  �  L�  M�  �  �  T�  PQY�  .�  �  Y0�  P�  QV�  ;�  �  T�  PQ�  ;�   �  T�  P�  R�  T�!  Q�  &�   �"  V�  �B  P�  R�   Q�  .�  �  ;�  �  T�#  PQ�  �  T�$  PQ�  .�  �  Y0�%  PQV�  W�  T�&  PQYYY0�'  P�  QV�  �?  P�  QY�  YYY0�(  PQV�  ;�)  �  T�*  PQY�  ;�+  �  T�  PQ�  ;�,  �>  P�)  Q�  �+  T�  P�  R�+  T�-  Q�  @P�+  T�.  PQQ�  �+  T�/  P�,  Q�  �+  T�$  PQYYYY0�0  P�1  QVY�  -Y`               [gd_scene load_steps=8 format=2]

[ext_resource path="res://KeyLayout.tscn" type="PackedScene" id=1]
[ext_resource path="res://makeCustomKey.tscn" type="PackedScene" id=2]
[ext_resource path="res://useableKeyGrid.tscn" type="PackedScene" id=3]
[ext_resource path="res://scripts/Keymap.cs" type="Script" id=4]
[ext_resource path="res://scripts/MapManager.cs" type="Script" id=5]
[ext_resource path="res://main.gd" type="Script" id=6]
[ext_resource path="res://ToolTip.tscn" type="PackedScene" id=7]

[node name="main" type="Control"]
anchor_right = 1.0
anchor_bottom = 1.0
script = ExtResource( 6 )
__meta__ = {
"_edit_use_anchors_": false
}

[node name="TabContainer" type="TabContainer" parent="."]
margin_right = 1916.0
margin_bottom = 689.0
tab_align = 0
__meta__ = {
"_edit_use_anchors_": false
}

[node name="default" parent="TabContainer" instance=ExtResource( 1 )]
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0

[node name="Layer 1" parent="TabContainer" instance=ExtResource( 1 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedLayer = 1

[node name="Layer 2" parent="TabContainer" instance=ExtResource( 1 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedLayer = 2

[node name="Layer 3" parent="TabContainer" instance=ExtResource( 1 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedLayer = 3

[node name="Make Custom Key" parent="TabContainer" instance=ExtResource( 2 )]
visible = false
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0

[node name="TabContainer2" type="TabContainer" parent="."]
margin_left = 3.0
margin_top = 719.0
margin_right = 1931.0
margin_bottom = 1081.0
tab_align = 0
__meta__ = {
"_edit_use_anchors_": false
}

[node name="Base" parent="TabContainer2" instance=ExtResource( 3 )]
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0

[node name="Modifiers" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 5

[node name="Shifted" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 6

[node name="Layers" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 7

[node name="Less used" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 1

[node name="BLE" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 2

[node name="International" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 4

[node name="Internal" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 3

[node name="Custom" parent="TabContainer2" instance=ExtResource( 3 )]
visible = false
anchor_top = 0.0
margin_left = 4.0
margin_top = 32.0
margin_right = -4.0
margin_bottom = -4.0
SelectedSet = 8

[node name="Keymap" type="Node" parent="."]
script = ExtResource( 4 )

[node name="MapManager" type="Node" parent="."]
script = ExtResource( 5 )

[node name="FileDialog" type="FileDialog" parent="."]
margin_left = 7.0
margin_top = 751.0
margin_right = 322.0
margin_bottom = 881.0

[node name="ToolTip" parent="." instance=ExtResource( 7 )]

[node name="Button2" type="Button" parent="."]
margin_left = 1737.6
margin_top = 697.125
margin_right = 1903.6
margin_bottom = 738.125
text = "save"
__meta__ = {
"_edit_use_anchors_": false
}

[connection signal="pressed" from="Button2" to="." method="_on_Button2_pressed"]
  [gd_scene load_steps=3 format=2]

[ext_resource path="res://scripts/Visual/MakeCustomKey.cs" type="Script" id=1]

[sub_resource type="StyleBoxFlat" id=1]
bg_color = Color( 0.168627, 0.164706, 0.219608, 1 )

[node name="Make Custom Key" type="Panel"]
anchor_right = 1.0
anchor_bottom = 1.0
margin_left = 1.0
margin_top = 87.0
margin_right = 0.00012207
margin_bottom = 0.00012207
script = ExtResource( 1 )
__meta__ = {
"_edit_use_anchors_": false
}

[node name="Save" type="Button" parent="."]
margin_left = 1465.34
margin_top = 375.304
margin_right = 1684.34
margin_bottom = 433.304
text = "Save key"

[node name="code" type="Panel" parent="."]
margin_left = 245.0
margin_top = 50.0
margin_right = 1367.0
margin_bottom = 166.0
custom_styles/panel = SubResource( 1 )

[node name="codeEdit" type="LineEdit" parent="code"]
margin_left = 10.0
margin_top = 40.0
margin_right = 273.0
margin_bottom = 84.0
__meta__ = {
"_edit_use_anchors_": false
}

[node name="Label" type="Label" parent="code"]
margin_left = 10.0
margin_top = 10.0
margin_right = 280.0
margin_bottom = 24.0
text = "Output Text"
__meta__ = {
"_edit_use_anchors_": false
}

[node name="RichTextLabel" type="RichTextLabel" parent="code"]
margin_left = 302.642
margin_top = 12.7279
margin_right = 666.642
margin_bottom = 87.7279
text = "This is the string you want your key to send when pressed"

[node name="Error" type="Label" parent="code"]
modulate = Color( 0.811765, 0.196078, 0.196078, 1 )
margin_left = 294.243
margin_top = 45.5736
margin_right = 826.243
margin_bottom = 92.5736
__meta__ = {
"_edit_use_anchors_": false
}

[node name="display" type="Panel" parent="."]
margin_left = 249.172
margin_top = 172.294
margin_right = 1372.17
margin_bottom = 292.294
custom_styles/panel = SubResource( 1 )

[node name="displayEdit" type="LineEdit" parent="display"]
margin_left = 10.0
margin_top = 40.0
margin_right = 273.0
margin_bottom = 84.0
__meta__ = {
"_edit_use_anchors_": false
}

[node name="Label" type="Label" parent="display"]
margin_left = 10.0
margin_top = 10.0
margin_right = 280.0
margin_bottom = 24.0
text = "Display Text"
__meta__ = {
"_edit_use_anchors_": false
}

[node name="RichTextLabel" type="RichTextLabel" parent="display"]
margin_left = 298.47
margin_top = 13.4701
margin_right = 662.47
margin_bottom = 88.4701
text = "This is what you want to display as in your key map
 ( just for the GUI)"
__meta__ = {
"_edit_use_anchors_": false
}

[node name="description" type="Panel" parent="."]
margin_left = 252.586
margin_top = 301.915
margin_right = 1371.59
margin_bottom = 415.915
custom_styles/panel = SubResource( 1 )

[node name="descriptionEdit" type="LineEdit" parent="description"]
margin_left = 10.0
margin_top = 40.0
margin_right = 273.0
margin_bottom = 84.0

[node name="Label" type="Label" parent="description"]
margin_left = 10.0
margin_top = 10.0
margin_right = 280.0
margin_bottom = 24.0
text = "Descripton Text"
__meta__ = {
"_edit_use_anchors_": false
}

[node name="RichTextLabel" type="RichTextLabel" parent="description"]
margin_left = 296.47
margin_top = 8.3006
margin_right = 660.47
margin_bottom = 83.3006
text = "this is the descripton avaiable on hover (just for the gui)"
__meta__ = {
"_edit_use_anchors_": false
}

[node name="RichTextLabel" type="RichTextLabel" parent="."]
margin_left = 261.0
margin_top = 443.0
margin_right = 1365.0
margin_bottom = 510.0
text = "add custom key code is alwasy a tab like layer then in there you can make a custom keyode maybe \"add blank key\" then you can slect key codes like normal then \"then send string \" and you can input a string  \"uni code \" input unicode \"emogi \" emogy picker  so on 
then you click save and that saves the keycode to your custom keycode json file 

we make one function custom keycode array to json 

that replaces the custom keycode json file and we can uust update the array and save the file again. 

so delete custom key removes its self from the array and calls the function
import from file imports them all from the file into the array of keycodes and calls save "
__meta__ = {
"_edit_use_anchors_": false
}
[connection signal="pressed" from="Save" to="." method="_on_Save_pressed"]
[connection signal="text_changed" from="code/codeEdit" to="." method="_on_codeEdit_text_changed"]
           
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               [gd_scene load_steps=2 format=2]

[ext_resource path="res://scripts/Visual/UseableKeyGrid.cs" type="Script" id=1]

[node name="UseableKeyGrid" type="GridContainer"]
anchor_top = 1.0
anchor_right = 1.0
anchor_bottom = 1.0
rect_min_size = Vector2( 1920, 150 )
columns = 25
script = ExtResource( 1 )
__meta__ = {
"_edit_use_anchors_": false
}
            [remap]

path="res://main.gdc"
 ECFG      _global_script_classes             _global_script_class_icons             application/config/name         Peg2   application/run/main_scene         res://main.tscn    autoload/MapManager$         *res://scripts/MapManager.cs   display/window/size/width      �     display/window/size/height      8   