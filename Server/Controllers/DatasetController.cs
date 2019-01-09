using System.Collections.Generic;
using System.IO;
using System.Linq;
using CsvHelper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        private IConfiguration configuration;
        private IHostingEnvironment hostingEnvironment;

        public DatasetController(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            this.configuration = configuration;
            this.hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public object GetInfo()
        {
            return configuration.GetSection("datasetInfo").Get(typeof(DatasetInfo));
        }

        [HttpGet("detail")]
        public object GetDetail(string date, int xMin, int yMin, int xMax, int yMax)
        {
            var basePath = hostingEnvironment.WebRootPath;
            var filePath = Path.Combine(basePath, "csv", date + ".csv");

            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader))
            {
                var records = csv.GetRecords<dynamic>();
                var rangedRecord = from record in records
                                   let dict = new Dictionary<string, object>(record)
                                   let lat = int.Parse(dict["latitude"].ToString())
                                   where lat >= xMin && lat <= xMax
                                   let lon = int.Parse(dict["longitude"].ToString())
                                   where lon >= yMin && lon <= yMax
                                   // Todo calculate mean
                                   group record by lat / 10 + " " + lon / 10 into g
                                   select g.FirstOrDefault();
                return rangedRecord.ToList();
            }
        }
    }
}
