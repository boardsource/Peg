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
    }
}
