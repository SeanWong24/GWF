using System.Collections.Generic;

namespace Server.Models
{
    public class DatasetInfo
    {
        public string minDate { get; set; }
        public string maxDate { get; set; }
        public List<string> variableList { get; set; }
    }
}