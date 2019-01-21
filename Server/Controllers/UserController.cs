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
        private GWFContext gwfContext;

        public UserController(GWFContext gwfContext)
        {
            this.gwfContext = gwfContext;
        }

        [HttpGet]
        public string GetUsername([FromHeader(Name = "User-Unique-Id")] string id)
        {
            return (from u in gwfContext.User
                    where u.Id == id
                    select u.Username).FirstOrDefault();
        }

        [HttpGet("exist")]
        public void ExistUser(string username){
            var foundUser = (from u in gwfContext.User
                             where u.Username == username
                             select u).FirstOrDefault();
            if(foundUser == null){
                throw new Exception("User does not exist.");
            }
        }

        [HttpPut]
        public void Add([FromBody] User user)
        {
            var foundUser = (from u in gwfContext.User
                             where u.Username == user.Username
                             select u).FirstOrDefault();
            if (foundUser == null)
            {
                user.Id = DateTime.Now.Ticks.ToString().Substring(3);
                gwfContext.User.Add(user);
                gwfContext.SaveChanges();
            }
            else
            {
                throw new Exception("User already exists.");
            }
        }

        [HttpPost("verify")]
        public string Verify([FromBody] User user)
        {
            var foundUser = (from u in gwfContext.User
                             where u.Username == user.Username && u.Password == user.Password
                             select u).FirstOrDefault();
            return foundUser == null ? "" : foundUser.Id;
        }
    }
}
