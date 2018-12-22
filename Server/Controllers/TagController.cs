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
        [HttpGet]
        public IList<Tag> Get([FromHeader(Name = "User-Unique-Id")] string id)
        {
            var user = DBContextHelper.Worker<GWFContext, User>(context => context.User.Find(id));
            var tags = DBContextHelper.Worker<GWFContext, List<Tag>>(context =>
            {
                return (from t in context.Tag
                        from ut in context.UserTag
                        where ut.UserId == id && ut.TagId == t.Id
                        select t).ToList();
            });

            return tags;
        }

        [HttpPut]
        public void Add([FromHeader(Name = "User-Unique-Id")] string id, [FromBody] Tag tag)
        {
            DBContextHelper.Worker<GWFContext>(context =>
            {
                tag.Id = DateTime.Now.Ticks.ToString().Substring(3);
                context.Tag.Add(tag);
                context.UserTag.Add(new UserTag
                {
                    TagId = tag.Id,
                    UserId = id
                });
                context.SaveChanges();
            });
        }

        [HttpPost]
        public void Modify([FromBody] Tag updatedTag)
        {
            DBContextHelper.Worker<GWFContext>(context =>
            {
                var tag = context.Tag.Find(updatedTag.Id);

                tag.Name = updatedTag.Name;
                tag.Comment = updatedTag.Comment;
                tag.Color = updatedTag.Color;

                context.SaveChanges();
            });
        }

        [HttpGet("share")]
        public object GetShareList(string tagId)
        {
            return DBContextHelper.Worker<GWFContext, object>(context =>
            {
                return (from ut in context.UserTag
                        where tagId == ut.TagId
                        select new {
                            id = ut.UserId,
                            username = ut.User.Username
                        }).ToList();
            });
        }

        [HttpPut("share")]
        public void Share(string tagId, [FromBody] List<string> userIdList)
        {
            DBContextHelper.Worker<GWFContext>(context =>
            {
                var removeList = from userTag in context.UserTag
                                 where !userIdList.Contains(userTag.UserId)
                                 select userTag;
                var addList = from userId in userIdList
                              from userTag in context.UserTag
                              where userId != userTag.UserId
                              select userId;
                context.UserTag.RemoveRange(removeList);
                foreach (var userId in addList)
                {
                    context.UserTag.Add(new UserTag
                    {
                        TagId = tagId,
                        UserId = userId
                    });
                }
                context.SaveChanges();
            });
        }
    }
}
