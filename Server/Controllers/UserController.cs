using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.DBModels;
using Vis.Utilities;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPut]
        public void Add([FromBody] User user)
        {
            DBContextHelper.Worker<GWFContext>(context =>
            {
                var foundUser = (from u in context.User
                                 where u.Username == user.Username
                                 select u).FirstOrDefault();
                if (foundUser == null)
                {
                    user.Id = DateTime.Now.Ticks.ToString().Substring(3);
                    context.User.Add(user);
                    context.SaveChanges();
                }
                else
                {
                    throw new Exception("User already exists.");
                }
            });
        }

        [HttpPost("verify")]
        public string Verify([FromBody] User user)
        {
            return DBContextHelper.Worker<GWFContext, string>(context =>
            {
                var foundUser = (from u in context.User
                                 where u.Username == user.Username && u.Password == user.Password
                                 select u).FirstOrDefault();
                return foundUser == null ? "" : foundUser.Id;
            });
        }
    }
}
