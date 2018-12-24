using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Server.DBModels;
using Server.Models;
using Vis.Utilities;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        private IConfiguration configuration;

        public DatasetController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet]
        public object GetInfo()
        {
            return configuration.GetSection("datasetInfo").Get(typeof(DatasetInfo));
        }
    }
}
