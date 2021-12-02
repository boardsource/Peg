using Godot;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;


namespace Peg
{

     class Layout 
    {
        public LayoutFeatures features { get; set; }

        public List<LayoutKey> layout { get; set; }

    }
}