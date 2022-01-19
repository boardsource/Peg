using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Peg
{
    class ProgramSettings
    {
        static ProgramSettings instance;

        public bool seven = true;
        public bool tooltips = true;
        public string ApiUrl = "http://159.89.159.24:3000/api/";
        public static ProgramSettings Instance()
        {
            // Uses lazy initialization
            // Note: this is not thread safe.
            if (instance == null)
            {
                instance = new ProgramSettings();
            }
            return instance;
        }
        protected ProgramSettings()
        {
        }
        public void SaveOutToFile()
        {

        }
    }
}
