using Godot;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Peg
{
    public class SearchingForBoard : Control
    {
        FileDialog fileDialog;
        HTTPRequest httpRequest;
        List<PegServerBoards> serverBoards;
        ItemList itemList;
        Label DriveName;
        Label BoardName;
        Popup popup;
        PegServerBoards selectedBoard;
        string currentRequest;
        string path;
        ProgramSettings programSettings;
        public override void _Ready()
        {
            programSettings = ProgramSettings.Instance();
            popup = GetNode<Popup>("Popup");
            fileDialog = GetNode<FileDialog>("FileDialog");
            itemList = GetNode<ItemList>("Popup/popupBackGround/ItemList");
            DriveName = GetNode<Label>("Popup/popupBackGround/Drive");
            BoardName = GetNode<Label>("Popup/popupBackGround/Board");



            this.httpRequest = GetNode<HTTPRequest>("HTTPRequest");
            GD.Print("Imm here");

        }
        public void _on_SelectDrive_pressed()
        {
            currentRequest = programSettings.ApiUrl+"boards";
            httpRequest.Request(currentRequest);
            if (fileDialog != null)
            {
                fileDialog.Popup_();
            }
            else
            {
                GD.Print("show me some shit");
            }
            
        }
        public void _on_FileDialog_dir_selected(string path)
        {
            this.path = path;
            DriveName.Text = path;
            popup.Popup_();

        }

        public void _on_HTTPRequest_request_completed(int result, int response_code, string[] headers, byte[] body)
        {
            if (currentRequest.EndsWith("boards"))
            {
                serverBoards = JsonConvert.DeserializeObject<List<PegServerBoards>>(System.Text.Encoding.UTF8.GetString(body));
                foreach (var serverBoard in serverBoards)
                {
                    itemList.AddItem(serverBoard.name);
                }
                currentRequest = "";
                return;
            }
            if (currentRequest.EndsWith(selectedBoard._ID))
            {
                PegFullServiceBoard fullServerBoard = JsonConvert.DeserializeObject<PegFullServiceBoard>(System.Text.Encoding.UTF8.GetString(body));

                setupNewBoard(fullServerBoard);
                currentRequest = "";

                return;
            }

            GD.Print("I dont know what to do with this request" + currentRequest);

        }
        void setupNewBoard(PegFullServiceBoard selectedBoard)
        {
            InnitFiles init = new InnitFiles(selectedBoard);
            init.setupDrive(path);

        }
        public void _on_MakeBoard_pressed()
        {
            currentRequest = programSettings.ApiUrl + "boards/"+selectedBoard._ID;
            httpRequest.Request(currentRequest);
            popup.Hide();

            // take the selected board and make a init files class after making a request to get the final board data and close popup
        }

        public void _on_ItemList_item_selected(int index)
        {
            this.selectedBoard = serverBoards[index];
            BoardName.Text = selectedBoard.name;
        }
    }
}
