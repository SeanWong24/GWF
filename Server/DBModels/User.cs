using System;
using System.Collections.Generic;

namespace Server.DBModels
{
    public partial class User
    {
        public User()
        {
            UserTag = new HashSet<UserTag>();
        }

        public string Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public ICollection<UserTag> UserTag { get; set; }
    }
}
