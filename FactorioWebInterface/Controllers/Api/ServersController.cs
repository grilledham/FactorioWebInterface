using FactorioWebInterface.Models.Api;
using FactorioWebInterface.Services.Api;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FactorioWebInterface.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServersController : ControllerBase
    {
        private readonly IServersService _serversService;

        public ServersController(IServersService serversService)
        {
            _serversService = serversService;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<ServerDetails>> GetAll()
        {
            return await _serversService.GetAll();
        }

        [HttpGet("online")]
        public async Task<IEnumerable<ServerDetails>> GetOnline()
        {
            return await _serversService.GetOnline();
        }
    }
}
