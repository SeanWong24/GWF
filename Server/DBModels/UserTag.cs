using System;
using System.Collections.Generic;

namespace Server.DBModels
{
    public partial class UserTag
    {
        public string UserId { get; set; }
        public string TagId { get; set; }

        public Tag Tag { get; set; }
        public User User { get; set; }
    }
}
