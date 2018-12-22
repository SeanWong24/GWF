using System;
using System.Collections.Generic;

namespace Server.DBModels
{
    public partial class Tag
    {
        public Tag()
        {
            UserTag = new HashSet<UserTag>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Color { get; set; }
        public string Position { get; set; }
        public string Comment { get; set; }
        public string Date { get; set; }
        public string Variable { get; set; }

        public ICollection<UserTag> UserTag { get; set; }
    }
}
