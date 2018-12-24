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
    public class TagController : ControllerBase
    {
        private GWFContext gwfContext;

        public TagController(GWFContext gwfContext)
        {
            this.gwfContext = gwfContext;
        }

        [HttpGet]
        public IList<Tag> Get([FromHeader(Name = "User-Unique-Id")] string id)
        {
            var user = gwfContext.User.Find(id);
            var tags = (from t in gwfContext.Tag
                        from ut in gwfContext.UserTag
                        where ut.UserId == id && ut.TagId == t.Id
                        select t).ToList();

            return tags;
        }

        [HttpPut]
        public void Add([FromHeader(Name = "User-Unique-Id")] string id, [FromBody] Tag tag)
        {
            tag.Id = DateTime.Now.Ticks.ToString().Substring(3);
            gwfContext.Tag.Add(tag);
            gwfContext.UserTag.Add(new UserTag
            {
                TagId = tag.Id,
                UserId = id
            });
            gwfContext.SaveChanges();
        }

        [HttpPost]
        public void Modify([FromBody] Tag updatedTag)
        {
            var tag = gwfContext.Tag.Find(updatedTag.Id);

            tag.Name = updatedTag.Name;
            tag.Comment = updatedTag.Comment;
            tag.Color = updatedTag.Color;

            gwfContext.SaveChanges();
        }

        [HttpGet("share")]
        public object GetShareList(string tagId)
        {
            return (from ut in gwfContext.UserTag
                    where tagId == ut.TagId
                    select new
                    {
                        id = ut.UserId,
                        username = ut.User.Username
                    }).ToList();
        }

        [HttpPut("share")]
        public void Share(string tagId, [FromBody] List<string> userIdList)
        {
            var removeList = from userTag in gwfContext.UserTag
                             where !userIdList.Contains(userTag.UserId)
                             select userTag;
            var addList = from userId in userIdList
                          from userTag in gwfContext.UserTag
                          where userId != userTag.UserId
                          select userId;
            gwfContext.UserTag.RemoveRange(removeList);
            foreach (var userId in addList)
            {
                gwfContext.UserTag.Add(new UserTag
                {
                    TagId = tagId,
                    UserId = userId
                });
            }
            gwfContext.SaveChanges();
        }
    }
}
