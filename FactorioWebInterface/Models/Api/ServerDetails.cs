using System.Collections.Generic;
using System.Linq;

namespace FactorioWebInterface.Models.Api
{
    public class ServerDetails
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Version { get; set; } = "";
        public bool IsOnline { get; set; }
        public int OnlinePlayerCount { get; set; }
        public IEnumerable<string> OnlinePlayers { get; set; } = Enumerable.Empty<string>();
    }
}
