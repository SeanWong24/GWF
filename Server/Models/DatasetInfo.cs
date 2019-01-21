using System;
using System.Collections.Generic;

namespace Server.Models
{
    public class VariableDetail
    {
        public string name { get; set; }
        public double minValue { get; set; }
        public double maxValue { get; set; }
    }

    public class DatasetInfo
    {
        public string minDate { get; set; }
        public string maxDate { get; set; }
        public List<VariableDetail> variableList { get; set; }
    }
}